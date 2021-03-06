var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;

var Octopull = require('../src/index');

describe('octopull.new', function(){
  it('should create a new Octopull instance', function(done){
    var client = new Octopull();

    if(client){
      assert.instanceOf(client, Octopull, 'client is an instance of Octopull');
      done();
    }
  })
});

describe('octopull#options', function(){
  it('should return new octopull instance with the given options', function(done){
    var client = new Octopull({
      baseUrl: 'http://octopull.me',
      acces_token: 'abc123'
    });

    if(client){
      assert.equal('http://octopull.me', client.options.baseUrl);
      assert.equal('abc123', client.options.acces_token);
      done();
    }
  })
});

describe('octopull#user', function(){
  it('should return a promise', function(done){
    var client = new Octopull();
    var user = client.user();

    assert.instanceOf(user, Promise, 'we have a Promise');
    done();
  });
});

