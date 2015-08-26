/* eslint new-cap: 0 */
'use strict';
var path = require('path');
var tar = require('tar');
var zlib = require('zlib');
var fs = require('fs');

var logger = require('./logger');

function unzipAndExtract(config, callback) {
  var id = config.id;
  var ip = config.ip;
  var innerCallback = function(err) {
    callback(err, id, ip);
  };
  var archivePath = path.join(__dirname, '..', ip);
  logger('Starting unzip and extract of', archivePath);
  var p = path.join(archivePath, 'dump.tar.gz');
  var exx = tar.Extract({path: archivePath})
  .on('error', innerCallback)
  .on('end', innerCallback);
  var gunz = zlib.createGunzip();
  fs.createReadStream(p)
  .on('error', innerCallback)
  .pipe(gunz)
  .pipe(exx);
}

module.exports = unzipAndExtract;
