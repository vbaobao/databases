/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'chat',
      multipleStatements: true
    });
    dbConnection.connect();

    var tablename = 'messages'; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          message: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].message).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    let Time = new Date();

    var queryString = 'INSERT messages (message, roomname, username, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?)';
    var queryArgs = ['Second message.', 1, 1, Time, Time];
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message).to.equal('Second message.');
        expect(messageLog[0].roomname).to.equal('Hello');
        done();
      });
    });
  });

  // Test the GET users request
  it('GET users should return all users in the table', function(done) {
    let Time = new Date();
    var queryString = `INSERT users (username, updatedAt, createdAt) VALUES (?,?,?);
    INSERT users (username, updatedAt, createdAt) VALUES (?,?,?);
    INSERT users (username, updatedAt, createdAt) VALUES (?,?,?);
    INSERT users (username, updatedAt, createdAt) VALUES (?,?,?);`;
    let queryArgs = ['Marlon', Time, Time, 'Virginia', Time, Time, 'Troy', Time, Time, 'Alex', Time, Time];

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Query node server to return all existing users
      request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
        var namesLog = JSON.parse(body);
        expect(namesLog.length).to.equal(5);
        expect(namesLog[4].username).to.equal('Alex');
        done();
      });
    });
  });

  it('Should output corrent number of affected rows', function(done) {
    let Time = new Date();

    // let queryString = `
    //   INSERT rooms (roomname, updatedAt, createdAt)VALUES (?, ?, ?);
    //   INSERT rooms (roomname, updatedAt, createdAt) VALUES (?, ?, ?);
    //   INSERT rooms (roomname, updatedAt, createdAt) VALUES (?, ?, ?);
    // `;
    let queryString = 'INSERT rooms (roomname, updatedAt, createdAt) VALUE (?, ?, ?), (?, ?, ?), (?, ?, ?)';

    let queryArgs = ['bighouse', Time, Time, 'hugehouse', Time, Time, 'enormouse house', Time, Time];

    dbConnection.query(queryString, queryArgs, function(err, results, fields) {
      if (err) {
        console.log('MARLON ERROR:', err);
      } else {
        console.log('MARLON RESULTS:', results, fields);
        // let count = 0;

        // results.forEach((q) => {
        //   count += q.affectedRows;
        // });

        expect(results.affectedRows).to.equal(3);
        done();
      }
    });
  });
});
