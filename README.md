# vpn-starter

[![Build Status](https://travis-ci.org/eiriksm/vpn-starter.svg?branch=master)](https://travis-ci.org/eiriksm/vpn-starter)
[![Coverage Status](https://coveralls.io/repos/eiriksm/vpn-starter/badge.svg?branch=master)](https://coveralls.io/r/eiriksm/vpn-starter?branch=master)
[![Code Climate](https://codeclimate.com/github/eiriksm/vpn-starter/badges/gpa.svg)](https://codeclimate.com/github/eiriksm/vpn-starter)
[![Dependency Status](https://david-dm.org/eiriksm/vpn-starter.svg)](https://david-dm.org/eiriksm/vpn-starter)

Will start a VPN server for you in the AWS cloud.

## Why?
If you want the privacy of VPN, but do not want to pay for either keeping up an instance 24/7 or pay for a VPN subscription, this has got you covered. Most likely you use the internet in a regular fashion most of the time, but have some things you want to do with some added privacy.

## Prerequisites
- [An AWS account](http://aws.amazon.com/).
- Credentials that has access to creating EC2 instances saved in `~/.aws/credentials`, or specified as config options (see the "Configuration" section).
- Probably some idea on how you would use a ovpn file to open a new VPN connection.

## Configuration
Copy the `default.config.json` file to a file named `config.json`. In this file you will find the following options:

#### subnet (required for small instances)
An ID of a subnet to launch the instance in. If you are using small instances (for example the t2-micro) this is required.

#### keyName (optional)
A name of a key pair stored in AWS. Use this if you want to be able to connect to the instance to do some kind of debugging.

## Credits

[Digital Ocean userData script](https://github.com/digitalocean/do_user_scripts/blob/master/Ubuntu-14.04/network/open-vpn.yml) was very helpful in scripting the OpenVPN setup.

## Licence
MIT
