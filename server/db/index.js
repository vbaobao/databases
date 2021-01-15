var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'chat',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) { return console.log(`Unable to connect to database. Error: ${err}`); }
  console.log(`Connection success: ${connection.threadId}`);
});

module.exports = connection;