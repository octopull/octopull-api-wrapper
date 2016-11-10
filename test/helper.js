var nock = require('nock');
nock.disableNetConnect();
// nock.recorder.rec();

var setup = function(){
  var apiHost = 'https://octopull.us/api';
  var queryString = { apiver: 'v2' };

  nock(apiHost)
    .post('/messages', {
      channel_id: /a.+/,
      body: /a.+/
    })
    .query(queryString)
    .reply(201, { id: "abcd123" });

  nock(apiHost)
    .get('/user')
    .query(queryString)
    .reply(200, {
      id: 1,
      first_name: 'Test',
      last_name: 'User'
    });

  nock(apiHost)
    .get('/channels/notexistent')
    .query(queryString)
    .reply(404);

  nock(apiHost)
    .post('/promises')
    .query(queryString)
    .reply(201, {
      id: 1,
      type: 'Promise'
    })

  nock(apiHost)
    .get('/promises/1')
    .query(queryString)
    .reply(200, {
      id: 1,
      type: 'Promise'
    });

  nock(apiHost)
    .put('/promises/1')
    .query(queryString)
    .reply(202, {
      id: 1,
      type: 'Promise',
      assigned_id: 2
    });
};

module.exports = {
  setup: setup
};