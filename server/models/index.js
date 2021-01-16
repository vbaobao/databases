const connection = require('../db');
var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      let sql = `SELECT m.message, r.roomname, u.username FROM messages m
        LEFT OUTER JOIN rooms r ON r.id = m.roomname
        LEFT OUTER JOIN users u ON u.id = m.username`;

      connection.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          callback(err);
          return;
        }
        callback(null, results);
      });
    }, // a function which produces all the messages
    post: function (message, callback) {
      // Query to insert the new room
      let sqlRoom = `INSERT rooms (roomname) VALUES ('${message.roomname}')`;
      connection.query(sqlRoom, (err, results, fields) => {
        if (err) { 
          console.error(err.message);
          callback(err);
          return;
        }
        console.log(`New room added: ${results.affectedRows}`);
        let sqlMessage = `
        INSERT messages (message, roomname, username)
        VALUES (?, (SELECT id FROM rooms WHERE roomname = ?), (SELECT id FROM users WHERE username = ?))
        `;
        let sqlVals = [message.message,message.roomname, message.username];

        connection.query(sqlMessage, sqlVals, (err, results, fields) => {
          if (err) {
            console.error(err.message);
            callback(err);
            return;
          }
          console.log('New message added: ', results.affectedRows);
          callback(null, results);
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      let sql = `SELECT username FROM users`;

      connection.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          callback(err);
          return;
        }
        callback(null, results);
      });
    },
    post: function (username, callback) {
      let sql = `INSERT users (username) VALUES ('${username}')`;

      connection.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message); 
          callback(err);
          return;
        }
        callback(null, username);
      });
    }
  }
};

