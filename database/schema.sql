DROP DATABASE IF EXISTS pha;

CREATE DATABASE pha;

USE pha;

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  empname VARCHAR(255) NOT NULL,
  emppassword VARCHAR(255) NOT NULL,
  createdate DATE NOT NULL,
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

CREATE TABLE calendars (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY name (name, user_id)
);

CREATE TABLE times (
  id INTEGER NOT NULL AUTO_INCREMENT,
  tStart1 decimal(3, 1) NOT NULL,
  tEnd1 decimal(3, 1) NOT NULL,
  tStart2 decimal(3, 1),
  tEnd2 decimal(3, 1),
  tStart3 decimal(3, 1),
  tEnd3 decimal(3, 1),
  tStart4 decimal(3, 1),
  tEnd4 decimal(3, 1),
  tStart5 decimal(3, 1),
  tEnd5 decimal(3, 1),
  tStart6 decimal(3, 1),
  tEnd6 decimal(3, 1),
  tStart7 decimal(3, 1),
  tEnd7 decimal(3, 1),
  tStart8 decimal(3, 1),
  tEnd8 decimal(3, 1),
  tStart9 decimal(3, 1),
  tEnd9 decimal(3, 1),
  tStart10 decimal(3, 1),
  tEnd10 decimal(3, 1),
  bStart1 decimal(3, 1) NOT NULL,
  bEnd1 decimal(3, 1) NOT NULL,
  bStart2 decimal(3, 1),
  bEnd2 decimal(3, 1),
  bStart3 decimal(3, 1),
  bEnd3 decimal(3, 1),
  bStart4 decimal(3, 1),
  bEnd4 decimal(3, 1),
  bStart5 decimal(3, 1),
  bEnd5 decimal(3, 1),
  bStart6 decimal(3, 1),
  bEnd6 decimal(3, 1),
  bStart7 decimal(3, 1),
  bEnd7 decimal(3, 1),
  bStart8 decimal(3, 1),
  bEnd8 decimal(3, 1),
  bStart9 decimal(3, 1),
  bEnd9 decimal(3, 1),
  bStart10 decimal(3, 1),
  bEnd10 decimal(3, 1),
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
  calendar_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE,
  FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY week (week, day, employee_id, user_id, calendar_id)
);

INSERT INTO users (username, password, empname, emppassword) VALUES ('rory', 'eagan', 'dude', 'word');
