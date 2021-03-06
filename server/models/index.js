// const connection = require('../db');
var db = require('../db');
// console.log('DATABASE models:', db.models);
// console.log('DATABASE MESSAGES models:', db.models.messages);
// console.log('DATABASE ROOMS models:', db.models.rooms);
// console.log('DATABASE USERS models:', db.models.users);

module.exports = {
  messages: {
    get: function (callback) {
      const Messages = db.models.messages;
      const Users = db.models.users;
      const Rooms = db.models.rooms;
      Messages.findAll({include: [Users, Rooms]})
        .then((fulfilled) => {
          let results = [];

          fulfilled.forEach((model) => {
            let username = model.dataValues.user.dataValues.username;
            let roomname = model.dataValues.room.dataValues.roomname;
            let message = model.dataValues.message;
            results.push({'username': username, 'roomname': roomname, 'message': message});
          });
          
          callback(null, results);
        })
        .catch((err) => {
          console.log(err.name, ' | ', err.message);
          callback(err);
        });
    }, // a function which produces all the messages

    post: function (message, callback) {
      const Rooms = db.models.rooms;
      const Messages = db.models.messages;
      const Users = db.models.users;
      Rooms.create({roomname: message.roomname})
        .then(() => {
          let userId = Users.findAll({attributes: ['id'], where: {username: message.username}, raw: true});
          let roomId = Rooms.findAll({attributes: ['id'], where: {roomname: message.roomname}, raw: true});
          return Promise.all([userId, roomId]);
        })
        .then(([userId, roomId]) => {
          console.log('THIS IS PASSED USERID WITH PROMISE DOT ALL', userId[0]);
          return Messages.create({message: message.message, username: userId[0].id, roomname: roomId[0].id});
        })
        .then((fulfilled) => {
          console.log('POST MESSAGE (fulfilled):', fulfilled.dataValues);
          callback(null, fulfilled.dataValues);
        })
        .catch((err) => {
          console.log(err.name, ' | ', err.message);
          callback(err);
        });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      const Users = db.models.users;
      Users.findAll()
        .then((fulfilled) => {
          console.log('GET USER (fulfilled): ', fulfilled);
          let results = [];

          fulfilled.forEach((model) => {
            let username = model.dataValues.username;
            results.push({'username': username});
          });
          
          callback(null, results);
          // callback(null, fulfilled.dataValues);
        })
        .catch((err) => {
          console.log(err.name);
          callback(err);
        });
    },

    post: function (username, callback) {
      const Users = db.models.users;
      Users.create({username: username})
        .then((fulfilled) => {
          console.log('POST USER (fulfilled): ', fulfilled.dataValues);
          callback(null, fulfilled.dataValues);
        })
        .catch((err) => {
          console.log(err.name);
          callback(err);
        });
    }
  }
};

