"use strict";

var _       = require('lodash');
var request = require('request');

var Octopull = function(options){
  this.options = options;

  this.req = request.defaults({
    baseUrl: options.baseUrl || process.env.OCTOPULL_BASE_URL || 'https://octopull.us/api',
    json: true,
    headers: {
      'Authorization': 'token ' + options.token
    },
    qs:{
      apiver: options.apiver || process.env.OCTOPULL_API_VERSION || 'v2'
    },
    qsStringifyOptions: {
      arrayFormat: 'brackets'
    }
  });

  this._get = function(options, callback){
    this.req
        .get(options, function(err, req, data){
          if( err ){
            callback(err, null);
          }else if(data.error){
            callback(data.error, null);
          }else{
            callback(null, data);
          }
        });
  };

  return this;
};


Octopull.prototype.user = function(callback) {
  this._get({ uri: '/user' }, callback);
};

Octopull.prototype.devices = function(callback) {
  this._get({ uri: '/user/devices' }, callback);
};

Octopull.prototype.channels = function(callback) {
  this._get({ uri: '/channels' }, callback);
};

Octopull.prototype.channelIds = function(callback) {
  this._get({ uri: '/user/channels' }, callback);
};

Octopull.prototype.channelTokens = function(channel_id, callback) {
  this._get({ uri: '/channels/' + channel_id + '/apn_tokens' }, callback);
};

module.exports = Octopull;