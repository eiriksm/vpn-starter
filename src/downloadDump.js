'use strict';
var fs = require('fs');
var request = require('request');
var request = require('request');

var logger = require('./logger');

function downloadDump(config, callback) {
  var dir = config.downloadDir;
  var ip = config.ip;
  var s = fs.createWriteStream(dir + '/dump.tar.gz');
  request('http://' + ip + ':8889/dump')
  .pipe(s);
  s.on('finish', function() {
    logger('Dump available at', dir);
    s.end();
    callback(null, config);
  });
  s.on('error', function(err) {
    callback(err);
  });
}

module.exports = downloadDump;
