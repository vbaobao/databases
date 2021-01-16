/* You'll need to
 *   npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var Sequelize = require('sequelize');
var db = new Sequelize('chat', 'root', '');

/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = db.define('users', {
  username: Sequelize.STRING
});

var Message = db.define('messages', {
  username: Sequelize.INTEGER,
  message: Sequelize.STRING
});

User.hasMany(Message, { foreignKey: 'username', sourceKey: 'id' });
Message.belongsTo(User, { foreignKey: 'username', targetKey: 'id' });

// 

/* Sequelize comes with built in support for promises
 * making it easy to chain asynchronous operations together */
User.sync()
  .then(function() {
    // Now instantiate an object and save it:
    return User.create({username: 'Jean Valjean'});
  })
  .then(function() {
    // Retrieve objects from the database:
    return User.findAll({ where: {username: 'Jean Valjean'} });
  })
  .then(function(users) {
    users.forEach(function(user) {
      console.log(user.username + ' exists');
    });
  })
  .then(() => {
    Message.sync();
  })
  .then( () => {
    return User.findAll({where: {username: 'Jean Valjean'}});
  })
  .then(function(userId) {
    console.log('USER ID: ', userId);
    return Message.create({message: 'My sword is missing.', username: userId.id});
  })
  .then(function() {
    return Message.findAll({where: {username: '1'}});
  })
  .then(function(messages) {
    messages.forEach((message) => {
      console.log(message.message + ', but who cares.');
    });
    db.close();
  })
  .catch(function(err) {
    console.log(err);
    db.close();
  });
