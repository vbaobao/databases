var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log('MESSAGES CONTROLLER Req:', req.body.message);
      // create vars for req json values
      // pass vals to proper models/index function
      // models.messages.post(message);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      //console.log('USERS CONTROLLER Req:', req.body.username);
      // create vars for req json values
      // pass vals to proper models/index function
      models.users.post(req.body.username);
    }
  }
};

