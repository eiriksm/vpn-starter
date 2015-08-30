'use strict';
var os = require('os');
var path = require('path');

var should = require('should');

var mdd = require('../src/makeDownloadDirectory');
var randomId = Math.random().toString(36).slice(2);

var config = {
  ip: randomId
};

describe('makeDownloadDirectory module', function() {
  it('Should export the expected type', function() {
    mdd.should.be.instanceOf(Function);
  });
  it('Should return error if it is not succeeding', function(done) {
    // Yeah, this probably does not work.
    config.tmpDir = '/root';
    mdd(config, function(err) {
      err.should.not.equal(undefined);
      done();
    });
  });
  it('Should return the expected path if things goes alright', function(done) {
    delete config.tmpDir;
    mdd(config, function(err, d) {
      d.downloadDir.should.equal(path.join(os.tmpdir(), randomId));
      done(err);
    });
  });
});
