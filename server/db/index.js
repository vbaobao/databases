// var mysql = require('mysql');
var Sequelize = require('sequelize');


// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

// var connection = mysql.createConnection({
//   user: 'root',
//   password: '',
//   database: 'chat',
//   multipleStatements: true
// });

// connection.connect((err) => {
//   if (err) { return console.log(`Unable to connect to database. Error: ${err}`); }
//   console.log(`Connection success: ${connection.threadId}`);
// });

// module.exports = connection;

var db = new Sequelize('chat', 'root', '');

db
  .authenticate()
  .then(function() {
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
  message: Sequelize.STRING
});

Users.hasMany(Messages, { foreignKey: 'username', targetKey: 'id' });
Messages.belongsTo(Users, { foreignKey: 'username', sourceKey: 'id' });
Rooms.hasMany(Messages, { foreignKey: 'roomname', targetKey: 'id' });
Messages.belongsTo(Rooms, { foreignKey: 'roomname', sourceKey: 'id' });

// Promise.all([Users.sync(), Rooms.sync(), Messages.sync()]);
Users.sync()
  .then(() => {
    return Rooms.sync();
  })
  .then(() => {
    return Messages.sync();
  })
  .then(() => {
    console.log('Done syncing table.');
  });

module.exports = db;