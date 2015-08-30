'use strict';
var fs = require('fs');
var request = require('request');

var logger = require('./logger');

function connectToInstance(config, callback) {
  var ip = config.ip;
  logger('Trying to communicate with server at', ip);
  request({
    url: 'http://' + ip + ':8889',
    timeout: config.timeout
  }, function (error, response) {
    if (!error && response.statusCode === 200) {
      logger('Received a 200 from instance... Trying to download keys.');
      // Pass on the good news.
      callback(null, config);
    }
    else {
      if (!error) {
        logger('code', response.statusCode, 'from instance');
      }
      setTimeout(connectToInstance.bind(null, config, callback), 2000);
    }
  });

}

module.exports = connectToInstance;
