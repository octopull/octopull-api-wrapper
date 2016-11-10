var Octopull = require('../src/index');

var it       = require('mocha').it;
var describe = require('mocha').describe;
var expect   = require('mocha').expect;
var chai     = require('chai');
var helpers  = require('./helper');

chai.use(require('chai-as-promised'));

var assert = chai.assert;

var client;
var token = 'abc123';

beforeEach(function(){
  client = new Octopull({
    token: token
  });

  helpers.setup();
});

describe('Users', function(){
  describe('#user', function(){
    it('should return the current user data', function(){
      return assert.eventually.deepEqual(client.user(), {
        id: 1,
        first_name: 'Test',
        last_name: 'User'
      });
    });
  });
});

describe('Messages', function(){
  describe('#postMessage', function(){
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
});

describe('Promises', function(){
  describe('#createPromise', function(){
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

    });
  });

  describe('#getPromise', function(){
    it('should return a promise by id', function(done){
      client.getPromise(1)
        .then(function(promise){
          assert.equal(promise.id, 1);
          assert.equal(promise.type, 'Promise');
          done();
        })
        .catch(function(err){
          done(err);
        });
    });

    it('should fail if no promise_id is given', function(done){
      client.getPromise()
        .catch(function(err){
          assert.instanceOf(err, Error);
          assert.equal(err.message, 'You must specify a promise_id');
          done();
        });
    });
  });

  describe('#updatePromise', function(){
    it('should update promise assigned', function(done){
      client.updatePromise(1, { assigned_id: 2 })
        .then(function(promise){
          assert.equal(promise.assigned_id, 2);
          done();
        })
        .catch(function(err){
          done(err);
        });
    });

    it('should fail if no promise_id is given', function(done){
      client.updatePromise()
        .catch(function(err){
          assert.instanceOf(err, Error);
          done();
        })
    })
  });

});

describe('Channels', function(){
  describe('#getChannel', function(){
    it('should return a 404 error', function(done){
      client.getChannel('notexistent')
        .catch(function(err){
          assert.match(err, /404/);
          done();
        })
    });
  });
})