/* eslint new-cap: 0 */
'use strict';
var http = require('http');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');

// Controlling server.
http.createServer(function (req, res) {
  if (req.method === 'GET') {
    var url = require('url').parse(req.url, true);

    if (url.pathname === '/') {
      // Return stats on '/'
      return res.end(JSON.stringify({
        'ip': 'something',
        'status': 'OK'
      }));
    }
    else if (url.pathname === '/dump') {
      return fstream.Reader({
        path: '/home/ubuntu/certs/',
        'type': 'Directory'
      })
      .pipe(tar.Pack())
      .pipe(zlib.Gzip())
      .pipe(res);
    }
  }
  res.writeHead(404);
  return res.end();
}).listen(8889);
