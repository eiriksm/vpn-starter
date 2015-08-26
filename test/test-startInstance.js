'use strict';
var should = require('should');

var si = require('../src/startInstance');
var randomId = Math.random().toString(36).slice(2);

var mockEc2 = {
  runInstances: function(d, cb) {
    cb(new Error('error'));
  }
};

var config = {
  subnet: 'abc'
};

describe('startInstance module', function() {
  it('Should export the expected type', function() {
    si.should.be.instanceOf(Function);
  });
  it('Should return error if error is found in ec2', function(done) {
    config.ec2 = mockEc2;
    si(config, function(err) {
      should(err).not.equal(undefined);
      done();
    });
  });

  it('Should return an ID if we mock the ec2 API response', function() {
    mockEc2.runInstances = function(d, callback) {
      callback(null, {
        Instances: [
          {
            InstanceId: randomId
          }
        ]
      });
    };
    // Just add the keyName for coverage.
    config.keyName = 'test';
    si(config, function(err, c) {
      should(err).equal(undefined);
      c.id.should.equal(randomId);
    });
  });
});
