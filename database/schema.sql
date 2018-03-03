DROP DATABASE IF EXISTS pha;

CREATE DATABASE pha;

USE pha;

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  empname VARCHAR(255) NOT NULL,
  emppassword VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY name (name, user_id)
);

CREATE TABLE times (
  id INTEGER NOT NULL AUTO_INCREMENT,
  tStart decimal(3, 1) NOT NULL,
  tEnd decimal(3, 1) NOT NULL,
  bStart decimal(3, 1) NOT NULL,
  bEnd decimal(3, 1) NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY tStart (tStart, tEnd, bStart, bEnd, user_id)
);

CREATE TABLE shifts (
  id INTEGER NOT NULL AUTO_INCREMENT,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  time_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY week (week, day, employee_id, user_id)
);

INSERT INTO users (username, password, empname, emppassword) VALUES ('rory', 'eagan', 'dude', 'word');