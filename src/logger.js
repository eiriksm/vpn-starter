'use strict';

var util = require('util');
require('colors');

function logger() {
  var args = Array.prototype.slice.call(arguments);
  var color = 'green';
  var severity = '[DEBUG]';
  if (args[args.length - 1] === 'error') {
    args.splice(args.length - 1);
    color = 'red';
    severity = '[ERROR]'.yellow;
  }
  var str = util.format.apply(util, args)[color];
  var date = ('[' + new Date().toString() + ']').blue;
  console.log.apply(console, [date, severity, str]);
}

module.exports = logger;
