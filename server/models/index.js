const connection = require('../db');
var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      let sql = `SELECT message FROM messages`;

      connection.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          callback(err);
          return;
        }
        console.log('RESULTS and FIELDS OF GET MESSAGES:', results, fields);
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
        console.log(`Rows affected in table 'rooms': ${results.affectedRows}`);
      });

      // let sqlMessage = `
      // SET @roomname_id = (SELECT id FROM rooms WHERE roomname = ?);
      // SET @username_id = (SELECT id FROM users WHERE username = ?);
      // INSERT messages (message, roomname, username)
      // VALUES (?, @roomname_id, @username_id)
      // `;

      let sqlMessage = `
      INSERT messages (message, roomname, username)
      VALUES (?, (SELECT id FROM rooms WHERE roomname = ?), (SELECT id FROM users WHERE username = ?))
      `;

      connection.query(sqlMessage, [message.message, message.roomname, message.username], (err, results, fields) => {
        if (err) {
          console.error(err.message);
          callback(err);
          return;
        }

        callback(null, message);
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
        console.log('RESULT and FIELDS OF GET USERS:' , results, fields);
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

