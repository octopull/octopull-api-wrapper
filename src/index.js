"use strict";

var _       = require('lodash');
var request = require('request');

var Octopull = function(options){
  this.options = options || {};

  this.req = request.defaults({
    baseUrl: this.options.baseUrl
             || process.env.OCTOPULL_BASE_URL
             || 'https://octopull.us/api',

    json: true,
    headers: {
      'Authorization': 'token ' + this.options.token
    },
    qs:{
      apiver: this.options.apiver
              || process.env.OCTOPULL_API_VERSION
              || 'v2'
    },
    qsStringifyOptions: {
      arrayFormat: 'brackets'
    }
  });

  this._get = function(options){
    var self = this;

    return new Promise(function(resolve, reject){
      self.req
          .get(options, function(err, res, data){
            if( err ) return reject(err);

            // if( ~~(res.statusCode / 100) !== 2 ){
            //   return reject(new Error(err))
            // }

            return resolve(data);
          });
    });
  };

  return this;
};

Octopull.prototype.user = function() {
  return this._get({ uri: '/user' });
};

Octopull.prototype.devices = function(callback) {
  return this._get({ uri: '/user/devices' }, callback);
};

Octopull.prototype.channels = function(callback) {
  return this._get({ uri: '/channels' }, callback);
};

Octopull.prototype.channelIds = function(callback) {
  return this._get({ uri: '/user/channels' }, callback);
};

Octopull.prototype.channelTokens = function(channel_id, callback) {
  return this._get({ uri: '/channels/' + channel_id + '/apn_tokens' }, callback);
};

module.exports = Octopull;