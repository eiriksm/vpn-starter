'use strict';

var logger = require('./logger');

function findPublicIp(config, callback) {
  var ec2 = config.ec2;
  var id = config.id;
  logger('Looking for ip for id', id);
  var params = {
    InstanceIds: [
      id
    ]
  };
  ec2.describeInstances(params, function(err, data) {
    if (err) {
      callback(err);
      return;
    }
    if (data && data.Reservations && data.Reservations[0].Instances) {
      if (data.Reservations[0].Instances[0] && data.Reservations[0].Instances[0].PublicDnsName) {
        var ip = data.Reservations[0].Instances[0].PublicDnsName;
        logger('Found ip, it is', ip);
        config.ip = ip;
        callback(null, config);
        return;
      }
    }
    // Retry.
    setTimeout(findPublicIp.bind(null, config, callback), 2000);
  });
}

module.exports = findPublicIp;
