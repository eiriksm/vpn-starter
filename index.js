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

var shuttingDown, id;
var config = require('./config');
config.ec2 = ec2;
config.timeout = 60000;

async.waterfall([
  startInstance.bind(null, config),
  findPublicIp,
  connectToInstance,
  makeDownloadDirectory,
  downloadDump,
  unzipAndExtract
], function(err, ider, ip) {
  id = ider;
  console.log(err, id, ip);
  logger('done!');
});

process.on('SIGINT', function() {
  logger('Will try to shut down servers.');
  if (!shuttingDown) {
    ec2.terminateInstances({
      InstanceIds: [
        id
      ]
    }, function(err) {
      if (err) {
        logger('Problem shutting down instance', 'error');
        throw err;
      }
      else {
        logger('Instance shut down');
      }
    });
  }
  else {
    logger('Multiple SIGINT detected. Will hard shutdown in 10 seconds.', 'error');
    setTimeout(function() {
      throw new Error('Force quitting after waiting to quit.');
    }, 10000);
  }
  shuttingDown = true;

});

http.createServer(function(req, res) {
  // @todo. Do something sensible here.
  res.end(JSON.stringify({
    id: id
  }));
}).listen(9999, function(err) {
  if (err) {
    throw err;
  }
  logger('Started webserver on port 9999');
});
