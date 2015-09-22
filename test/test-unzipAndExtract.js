'use strict';
var should = require('should');
var uAE = require('../src/unzipAndExtract');

var randomId = Math.random().toString(36).slice(2);

describe('unzipAndExtract module', function() {
  it('Should export the expected type', function() {
    uAE.should.be.instanceOf(Function);
  });
  it('Should do as expected when not finding an archive', function(done) {
    uAE({
      ip: randomId,
      downloadDir: '/etc'
    }, function(err) {
      should(err).not.equal(undefined);
      done();
    });
  });
});
