'use strict';
var http = require('http');
var AWS = require('aws-sdk');
// @todo. Expose as config.
AWS.config.update({region: 'us-east-1'});
var ec2 = new AWS.EC2({apiVersion: '2015-04-15'});
var shuttingDown, id;
var logger = require('./src/logger');
require('./index')(function(err, ider, ip) {
  id = ider;
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
