'use strict';

var os = require('os');
var path = require('path');

var mkdirp = require('mkdirp');

var logger = require('./logger');

function makeDownloadDirectory(config, callback) {
  var dir = path.join((config.tmpDir || os.tmpdir()), config.ip);
  mkdirp(dir, function(e) {
    if (e) {
      callback(e);
      return;
    }
    // If all went A-ok. Add path to config and call callback.
    config.downloadDir = dir;
    logger('Created download directory at', dir);
    callback(null, config);
  });
}

module.exports = makeDownloadDirectory;
