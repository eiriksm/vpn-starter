'use strict';
var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');

var logger = require('./logger');

function connectToInstance(config, callback) {
  var ip = config.ip;
  logger('Trying to communicate with server at', ip);
  request({
    url: 'http://' + ip + ':8889'
  }, function (error, response) {
    if (!error && response.statusCode === 200) {
      logger('Received a 200 from instance... Trying to download keys.');
      // Download the keys.
      var dir = './' + ip;
      mkdirp(dir, function(e) {
        if (e) {
          callback(e);
          return;
        }
        var s = fs.createWriteStream(dir + '/dump.tar.gz');
        request('http://' + ip + ':8889/dump')
        .pipe(s);
        s.on('finish', function() {
          logger('Dump available at', dir);
          s.end();
          callback(null, config);
        });
        // @todo. Catch errors.
      });
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
