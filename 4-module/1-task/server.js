const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (isPathNested(pathname)) {
        res.statusCode = 400;
        res.end();
        return;
      }

      if (fs.existsSync(filepath)) {
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function isPathNested(pathname) {
  return pathname.includes('/');
}

module.exports = server;
