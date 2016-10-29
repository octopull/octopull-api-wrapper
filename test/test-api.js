var Octopull = require('../src/index');

var it       = require('mocha').it;
var describe = require('mocha').describe;
var expect   = require('mocha').expect;
var chai     = require('chai');

chai.use(require('chai-as-promised'));

var assert = chai.assert;

var nock = require('nock');
nock.disableNetConnect();

var setupNock = function(){
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
    });

  nock('https://octopull.us')
    .get('/api/channels/notexistent?apiver=v2')
    .reply(404);

  nock('https://octopull.us')
    .post('/api/promises?apiver=v2')
    .reply(201, {
      id: 1,
      type: 'Promise'
    })
};

var client;
var token = 'abc123';

beforeEach(function(){
  client = new Octopull({
    token: token
  });

  setupNock();
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

describe('octopull#createPromise', function(){
  it('should convert a message into promise', function(done){

    var promise_data = {
      assigned_id: 24,
      duedate: '2017-10-31'
    }

    client.postMessage({
      body: 'test message',
      channel_id: 'abcdefg'
    })
    .then(function(message){

      client.createPromise(Object.assign({},
        promise_data, {
          message_id: message.id
        })
      )
      .then(function(task){
        assert.equal(task.type, 'Promise');
        done();
      })
      .catch(function(err){
        done(err);
      });

    })
    .catch(function(err){
      done(err);
    });

  })
});


describe('octopull#channel', function(){
  it('should return a 404 error', function(done){
    client.getChannel('notexistent')
      .catch(function(err){
        assert.match(err, /404/);
        done();
      })
  });
});

