const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

function handleRequest(req, res, {filepath, pathname}) {
  if (isPathNested(pathname)) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File already exists');
    return;
  }

  const directoryForFiles = path.join(__dirname, 'files');

  if (!fs.existsSync(directoryForFiles)) {
    fs.mkdirSync(directoryForFiles);
  }

  const limitSizeTransformStream = new LimitSizeStream({limit: 1024 * 1024});
  const writeStream = fs.createWriteStream(filepath);

  req.pipe(limitSizeTransformStream).pipe(writeStream);

  writeStream.on('finish', () => {
    res.statusCode = 201;
    res.end();
    return;
  });

  limitSizeTransformStream.on('error', (error) => {
    if (error.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end('Limit exceeded');
      return;
    }

    res.statusCode = 500;
    res.end('Internal server errror');
    return;
  });

  res.on('close', () => {
    if (res.statusCode === 201) return;
    writeStream.destroy();
    fs.unlinkSync(filepath);
  });
}

function isPathNested(pathname) {
  return pathname.includes('/');
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      handleRequest(req, res, {filepath, pathname});
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
