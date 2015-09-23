'use strict';
var http = require('http');

var async = require('async');
var AWS = require('aws-sdk');
// @todo. Expose as config.
AWS.config.update({region: 'us-east-1'});
var ec2 = new AWS.EC2({apiVersion: '2015-04-15'});

var startInstance = require('./src/startInstance');
var connectToInstance = require('./src/connectToInstance');
var findPublicIp = require('./src/findPublicIp');
var makeDownloadDirectory = require('./src/makeDownloadDirectory');
var downloadDump = require('./src/downloadDump');
var unzipAndExtract = require('./src/unzipAndExtract');
var logger = require('./src/logger');

var config = require('./config');
config.ec2 = ec2;
config.timeout = 60000;
module.exports = function(callback) {
  logger('Initializing');
  async.waterfall([
    startInstance.bind(null, config),
    findPublicIp,
    connectToInstance,
    makeDownloadDirectory,
    downloadDump,
    unzipAndExtract
  ], function(err, id, ip) {
    logger('done!');
    callback(err, id, ip);
  });
}

