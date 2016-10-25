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

            if( ~~(res.statusCode / 100) !== 2 ){
              return reject(
                new Error( 'The API returned a ' + res.statusCode + ' status')
              );
            }

            return resolve(data);
          });
    });
  };

  return this;
};

(function(){

  this.user = function() {
    return this._get({ uri: '/user' });
  };

  this.devices = function() {
    return this._get({ uri: '/user/devices' });
  };

  this.channels = function() {
    return this._get({ uri: '/channels' });
  };

  this.channelIds = function() {
    return this._get({ uri: '/user/channels' });
  };

  this.channelTokens = function(channel_id, ) {
    return this._get({ uri: '/channels/' + channel_id + '/apn_tokens' });
  };

}).call(Octopull.prototype);

module.exports = Octopull;