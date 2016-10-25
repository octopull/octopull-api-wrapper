var Octopull = require('../src/index');

var it       = require('mocha').it;
var describe = require('mocha').describe;
var expect   = require('mocha').expect;
var chai     = require('chai');

chai.use(require('chai-as-promised'));

var assert = chai.assert;

var nock = require('nock');
nock.disableNetConnect();

nock('https://octopull.us')
  .post('/api/messages?apiver=v2', {
    channel_id: /a.+/,
    body: /a.+/
  })
  .reply(201, { id: "abcd123" });

nock('https://octopull.us')
  .get('/api/user?apiver=v2')
  .reply(200, {
    id: 1,
    first_name: 'Test',
    last_name: 'User'
  })


var client;
var token = 'abc123';

beforeEach(function(){
  client = new Octopull({
    token: token
  });
});

describe('octopull#user', function(){
  it('should return the current user data', function(){
    return assert.eventually.deepEqual(client.user(), {
      id: 1,
      first_name: 'Test',
      last_name: 'User'
    });
  });
});

describe('octopull#postMessage', function(){
  it('should create a new message', function(){
    var message = client.postMessage({
      body: 'test message',
      channel_id: 'abcdefg'
    });

    return assert.eventually.deepEqual(message, {
      id: 'abcd123'
    })
  })
});

