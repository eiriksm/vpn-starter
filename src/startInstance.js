'use strict';
var fs = require('fs');
var path = require('path');

var logger = require('./logger');

function startInstance(config, callback) {
  var ec2 = config.ec2;
  // Prepare userdata and do a basic templating (replace <%=filename.ext%> to contents of filename.ext).
  var userdata = fs.readFileSync(path.join(__dirname, '..', 'userdata.sh'), 'utf8')
  .replace(/<%=(.*)%>/g, function(_, name) {
    return fs.readFileSync(name, 'utf8');
  });

  var params = {
    // @todo. Expose these as config options.
    InstanceType: 't2.micro',
    ImageId: 'ami-d05e75b8', // AMI for Ubuntu 14.04 in us-east-1
    MinCount: 1,
    MaxCount: 1,
    SubnetId: config.subnet,
    UserData: new Buffer(userdata).toString('base64')
  };
  if (config.keyName) {
    // To gain ssh access to instances, you should either upload a key to
    // all given EC2 regions and use it here, or use Cloud Init to write them manually.
    params.KeyName = config.keyName;
  }

  ec2.runInstances(params, function(err, data) {
    if (err) {
      logger('Could not create instance', err, 'error');
      callback(err);
      return;
    }

    var instanceId = data.Instances[0].InstanceId;
    logger('Created instance', instanceId);
    config.id = instanceId;
    callback(null, config);
  });
}

module.exports = startInstance;
