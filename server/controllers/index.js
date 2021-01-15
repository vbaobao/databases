var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) { 
      console.log(`controllers/messages/GET status code: ${res.statusCode}`);
      models.messages.get();
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log(`controllers/messages/POST status code: ${res.statusCode}`);
      console.log('MESSAGES CONTROLLER Req:', req.body.message);
      // create vars for req json values
      // pass vals to proper models/index function
      models.messages.post(req.body);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      console.log(`controllers/users/GET status code: ${res.statusCode}`);
      models.users.get();
    },
    post: function (req, res) { 
      console.log(`controllers/users/POST status code: ${res.statusCode}`);
      models.users.post(req.body.username);
    }
  }
};