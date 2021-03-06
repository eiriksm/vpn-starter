'use strict';

var https = require('https');
var fs = require('fs');
var path = require('path');
var options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.cert'))
};

var cti = require('../src/connectToInstance');

var config = {
  timeout: 100,
  ip: 'localhost'
};

var server;

describe('connectToInstance module', function() {
  it('Should export the expected function', function() {
    cti.should.be.instanceOf(Function);
  });
  it('Should retry if not succeeding', function(done) {
    this.timeout(5000);
    var count = 0;
    function responseToRequests(req, res) {
      count++;
      switch (count) {
        case 2:
          res.writeHead(404);
          res.end();
          break;

        case 3:
          res.end('cool');
          break;

      }
    }

    server = https.createServer(options, responseToRequests).listen(8889);
    cti(config, function(e) {
      server.close();
      config.should.not.equal(undefined);
      done(e);
    });
  });
});
