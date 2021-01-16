const connection = require('../db');
var sqlDatabase = require('../db');
var Sequelize = require('sequelize');
var db = new Sequelize('chat', 'root', '');

db
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var Users = db.define('users', {
  username: { type: Sequelize.STRING, unique: true }
});

var Rooms = db.define('rooms', {
  roomname: { type: Sequelize.STRING, unique: true }
});

var Messages = db.define('messages', {
  message: Sequelize.STRING,
  username: Sequelize.INTEGER,
  roomname: Sequelize.INTEGER
});

Users.hasMany(Messages, { foreignKey: 'username', sourceKey: 'id' });
Messages.belongsTo(Users, { foreignKey: 'username', targetKey: 'id' });
Rooms.hasMany(Messages, { foreignKey: 'roomname', sourceKey: 'id' });
Messages.belongsTo(Rooms, { foreignKey: 'roomname', targetKey: 'id' });

module.exports = {
  messages: {
    get: function (callback) {
      // let sql = `SELECT m.message, r.roomname, u.username FROM messages m
      //   LEFT OUTER JOIN rooms r ON r.id = m.roomname
      //   LEFT OUTER JOIN users u ON u.id = m.username`;

      // connection.query(sql, (err, results, fields) => {
      //   if (err) {
      //     console.error(err.message);
      //     callback(err);
      //     return;
      //   }
      //   callback(null, results);
      // });
      Messages.sync()
        .then(() => {
          return Messages.findAll();
        })
        .then((fulfilled) => { callback(null, fulfilled); });
    }, // a function which produces all the messages
    post: function (message, callback) {
      // Query to insert the new room
      // let sqlRoom = `INSERT rooms (roomname) VALUES ('${message.roomname}')`;
      // connection.query(sqlRoom, (err, results, fields) => {
      //   if (err) { 
      //     console.error(err.message);
      //     callback(err);
      //     return;
      //   }
      //   console.log(`New room added: ${results.affectedRows}`);
      //   let sqlMessage = `
      //   INSERT messages (message, roomname, username)
      //   VALUES (?, (SELECT id FROM rooms WHERE roomname = ?), (SELECT id FROM users WHERE username = ?))
      //   `;
      //   let sqlVals = [message.message,message.roomname, message.username];

      //   connection.query(sqlMessage, sqlVals, (err, results, fields) => {
      //     if (err) {
      //       console.error(err.message);
      //       callback(err);
      //       return;
      //     }
      //     console.log('New message added: ', results.affectedRows);
      //     callback(null, results);
      //   });
      // });
      Promise.all([Users.sync(), Rooms.sync(), Messages.sync()])
        .then(() => {
          return Rooms.create({roomname: message.roomname});
        })
        .then(() => {
          let userId = Users.findAll({attributes: ['id'], where: {username: message.username}});
          let roomId = Rooms.findAll({attributes: ['id'], where: {roomname: message.roomname}});
          return Promise.all([userId, roomId]);
        })
        .then((ids) => {
          return Messages.create({message: message.message, username: ids[0], roomname: ids[1]});
        })
        .then((fulfilled) => { callback(null, fulfilled); });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      // let sql = `SELECT username FROM users`;

      // connection.query(sql, (err, results, fields) => {
      //   if (err) {
      //     console.error(err.message);
      //     callback(err);
      //     return;
      //   }
      //   callback(null, results);
      // });
      Users.sync()
        .then(() => {
          return Users.findAll();
        })
        .then((fulfilled) => { callback(null, fulfilled); });
    },
    post: function (username, callback) {
      // let sql = `INSERT users (username) VALUES ('${username}')`;

      // connection.query(sql, (err, results, fields) => {
      //   if (err) {
      //     console.error(err.message); 
      //     callback(err);
      //     return;
      //   }
      //   callback(null, username);
      // });
      Users.sync()
        .then(() => {
          return Users.create({username: username});
        })
        .then((fulfilled) => { callback(null, fulfilled); });
    }
  }
};

