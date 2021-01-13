CREATE DATABASE chat;

USE chat;

CREATE TABLE rooms (
  /* Describe your table here.*/
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
  /* Describe your table here.*/
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE messages (
  /* Describe your table here.*/
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_value TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  room INT NOT NULL,
  user INT NOT NULL,
  FOREIGN KEY(room) REFERENCES rooms(id),
  FOREIGN KEY(user) REFERENCES users(id)
);

/* Create other tables and define schemas for them here! */

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

