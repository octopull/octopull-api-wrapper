"use strict";

var _       = require('lodash');
var request = require('request');

var Octopull = function(options){
  var self = this;
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

  this._request = function(method, options){
    return new Promise(function(resolve, reject){
      options = _.assign({}, options, { method: method });

      self.req(options, function(err, res, data){
        if( err ) return reject(err);

        if( ~~(res.statusCode / 100) !== 2 ){
          return reject(
            new Error('The API returned a ' + res.statusCode + ' status: ' + JSON.stringify(res))
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
    return this._request('GET', { uri: '/user' });
  };

  this.devices = function() {
    return this._request('GET', { uri: '/user/devices' });
  };

  this.channels = function() {
    return this._request('GET', { uri: '/channels' });
  };

  this.channelIds = function() {
    return this._request('GET', { uri: '/user/channels' });
  };

  this.channelTokens = function(channel_id) {
    return this._request('GET', { uri: '/channels/' + channel_id + '/apn_tokens' });
  };

  this.getChannel = function(channel_id){
    return this._request('GET', { uri: '/channels/' + channel_id });
  };

  /* Messages */

  this.postMessage = function(data){
    return this._request('POST', { uri: '/messages', body: data });
  };

  this.getMessage = function(message_id){
    return this._request('GET', {
      uri: '/messages/' + message_id
    });
  };

  this.getMessages = function(channel_id, filters){
    if( !channel_id ){
      return Promise.reject(
        new Error('You must specify a channel_id')
      );
    }

    filters = _.merge({}, (filters || {}), {
      channel_id: channel_id
    });

    return this._request('GET', {
      uri: '/messages',
      qs: filters
    });
  };

  /* Promises */

  this.createPromise = function(data){
    return this._request('POST', { uri: '/promises', body: data });
  };

  this.updatePromise = function(promise_id, data){
    if( !promise_id ){
      return Promise.reject(
        new Error('You must specify a promise_id')
      );
    }

    return this._request('PUT', {
      uri: '/promises/' + promise_id,
      body: (data || {})
    });
  };

  this.destroyPromise = function(promise_id){
    if( !promise_id ){
      return Promise.reject(
        new Error('You must specify a promise_id')
      );
    }

    return this._request('DELETE', { uri: '/promises/' + promise_id });
  };

  this.getPromise = function(promise_id){
    if( !promise_id ){
      return Promise.reject(
        new Error('You must specify a promise_id')
      );
    }

    return this._request('GET', {
      uri: '/promises/' + promise_id
    });
  };

  this.getPromises = function(filters){
    filters = filters || {};

    return this._request('GET', {
      uri: '/promises',
      qs: filters
    });
  };

}).call(Octopull.prototype);

module.exports = Octopull;