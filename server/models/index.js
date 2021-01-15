const connection = require('../db');
var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      let sql = `SELECT message FROM messages`;

      connection.query(sql, (err, results, fields) => {
        if (err) { return console.error(err.message); }
        console.log(`RESULT OF GET MESSAGES: ${results}`);
      });
    }, // a function which produces all the messages
    post: function (message) {
      // Query to insert the new room
      let sqlRoom = `INSERT rooms (roomname) VALUES ('${message.roomname}')`;
      connection.query(sqlRoom, (err, results, fields) => {
        if (err) { return console.error(err.message); }
        console.log(`Rows affected: ${results.affectedRows}`);
      });

      // Query to insert new message
      let sqlMessage = `
        SET @roomname = (SELECT id FROM rooms WHERE roomname = '${message.roomname}');
        SET @username = (SELECT id FROM users WHERE username = '${message.username}');
        INSERT messages (message, roomname, username) VALUES
        (SELECT ${message.message}, @roomname, @username)
      `;

      connection.query(sqlMessage, (err, results, fields) => {
        if (err) { return console.error(err.message); }
        console.log(`Rows affected: ${results.affectedRows}`);
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      let sql = `SELECT username FROM users`;

      connection.query(sql, (err, results, fields) => {
        if (err) { return console.error(err.message); }
        console.log(`RESULT OF GET USERS: ${results}`);
      });
    },
    post: function (username) {
      let sql = `INSERT users (username) VALUES ('${username}')`;

      connection.query(sql, (err, results, fields) => {
        if (err) { return console.error(err.message); }
        console.log(`Rows affected in users table: ${results.affectedRows}`);
      });
    }
  }
};

