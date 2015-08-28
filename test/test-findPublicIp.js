'use strict';
var should = require('should');

var fp = require('../src/findPublicIp');
var randomId = Math.random().toString(36).slice(2);

var mockEc2 = {
  describeInstances: function(d, cb) {
    cb(new Error('error'));
  }
};

var config = {
  id: randomId
};

describe('findPublicIp module', function() {
  it('Should export the expected type', function() {
    fp.should.be.instanceOf(Function);
  });
  it('Should return error if error is found in ec2', function(done) {
    config.ec2 = mockEc2;
    fp(config, function(err) {
      err.should.not.equal(undefined);
      done();
    });
  });
  it('Should retry if we sent it some empty data, and return expected on good data', function(done) {
    this.timeout(5000);
    var count = 0;
    mockEc2.describeInstances = function(d, cb) {
      count++;
      var dataObj = {
        Reservations: [
          {
            Instances: [
              {
                PublicDnsName: randomId
              }
            ]
          }
        ]
      };
      switch (count) {
        case 1:
          dataObj = null;
          break;

        case 2:
          dataObj.Reservations[0].Instances = [];
          break;

      }
      cb(null, dataObj);
    };
    fp(config, function(err, d) {
      should(err).equal(null);
      count.should.equal(3);
      d.ip.should.equal(randomId);
      done(err);
    });
  });
});
