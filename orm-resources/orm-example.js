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
  username: { type: Sequelize.STRING, unique: true }
});

var Room = db.define('rooms', {
  roomname: { type: Sequelize.STRING, unique: true }
});

var Message = db.define('messages', {
  message: Sequelize.STRING,
  username: Sequelize.INTEGER,
  roomname: Sequelize.INTEGER
});

User.hasMany(Message, { foreignKey: 'username', sourceKey: 'id' });
Message.belongsTo(User, { foreignKey: 'username', targetKey: 'id' });
Room.hasMany(Message, { foreignKey: 'roomname', sourceKey: 'id' });
Message.belongsTo(Room, { foreignKey: 'roomname', targetKey: 'id' });

// 

/* Sequelize comes with built in support for promises
 * making it easy to chain asynchronous operations together */
Promise.all([User.sync(), Room.sync(), Message.sync()])
  .then(() => {
    //return Promise.all([User.create({username: 'Jean Valjean'}), Room.create({roomname: 'Swordsmen'})]);
  })
  .then(() => {
    let userId = User.findAll({attributes: ['id'], where: {username: 'Jean Valjean'}});
    let roomId = Room.findAll({attributes: ['id'], where: {roomname: 'Swordsmen'}});
    return Promise.all([userId, roomId]);
  })
  .then((ids) => {
    console.log('--------------', ids, '----------------');
    return Message.create({message: 'My sword is missing', username: ids[0].dataValues.id, roomname: ids[1].dataValues.id});
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
    console.error('THERE WAS AN ERROR: ', err.message, ' -- ERROR END');
    db.close();
  });
