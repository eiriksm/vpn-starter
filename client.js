/* eslint new-cap: 0 */
'use strict';
var https = require('https');
var fs = require('fs');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var util = require('util');

function logger() {
  var args = Array.prototype.slice.call(arguments);
  var str = util.format.apply(util, args);
  var date = ('[' + new Date().toString() + ']');
  console.log.apply(console, [date, str]);
}

var options = {
  key: fs.readFileSync('./key.key'),
  cert: fs.readFileSync('./cert.cert')
};

// Controlling server.
https.createServer(options, function (req, res) {
  if (req.method === 'GET') {
    var url = require('url').parse(req.url, true);
    logger('ip %s connected on URL %s',
           req.connection.remoteAddress,
           url.pathname);
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
        type: 'Directory'
      })
      .pipe(tar.Pack())
      .pipe(zlib.Gzip())
      .pipe(res);
    }
  }
  res.writeHead(404);
  return res.end();
}).listen(8889, function() {
  logger('Server started');
});
