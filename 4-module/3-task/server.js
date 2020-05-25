const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

function handleRequest(req, res, {pathname, filepath}) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested folders are not allowed');
    return;
  }

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  };

  fs.unlinkSync(filepath);
  res.statusCode = 200;
  res.end();
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      handleRequest(req, res, {pathname, filepath});
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
