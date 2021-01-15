var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) { 
      models.messages.get((err, val) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.status(200).json(val);
        }
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body, (err, val) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.status(200).json(val);
        }
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get((err, val) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.status(200).json(val);
        }
      });
    },
    post: function (req, res) { 
      models.users.post(req.body.username, (err, val) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.status(200).json(val);
        }
      });
    }
  }
};