'use strict';

var https = require('https');
var fs = require('fs');
var os = require('os');
var path = require('path');
var options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.cert'))
};
var should = require('should');

var dd = require('../src/downloadDump');

var config = {
  ip: 'localhost'
};
var server;

function responseToRequests(req, res) {
  res.end(responseString);
}
var responseString = 'this is the tar file for ' + Math.random().toString(36).slice(2);

describe('downloadDump module', function() {
  it('Should export the expected type', function() {
    dd.should.be.instanceOf(Function);
  });
  it('Should fail when trying to write the wrong place', function(done) {
    server = https.createServer(options, responseToRequests).listen(8889, function() {
      config.downloadDir = '/root';
      dd(config, function(err) {
        err.should.not.equal(null);
        done();
      });
    });
  });
  it('Should download the expected thing', function(done) {
    config.downloadDir = os.tmpDir();

    dd(config, function(err) {
      server.close();
      fs.readFileSync(path.join(config.downloadDir, 'dump.tar.gz'), 'utf8').should.equal(responseString);
      done(err);
    });
  });
});
