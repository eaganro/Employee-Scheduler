const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig);

const addEmployee = (name, userID, callback) => {
  connection.query(`INSERT INTO employees (name, user_id) VALUES ('${name}', ${userID})`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeEmployee = (name, userID, callback) => {
  connection.query(`DELETE FROM employees WHERE name='${name}' AND user_id=${userID}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const getEmployees = (userID, callback) => {
  connection.query(`SELECT * FROM employees WHERE user_id=${userID}`, (err, result) => {
    if (err) {
      console.log(err);
      callback(false, err);
    }
    callback(true, result);
  });
};

const addTime = (state, callback) => {
  const { start, end, bStart, bEnd, id } = state;
  connection.query(`INSERT INTO times (tStart, tEnd, bStart, bEnd, user_id) VALUES (${start}, ${end}, ${bStart}, ${bEnd}, ${id})`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeTime = (state, callback) => {
  const { id, time_id } = state;
  connection.query(`DELETE FROM times WHERE id=${time_id} AND user_id=${id}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const getTimes = (userID, callback) => {
  connection.query(`SELECT * FROM times WHERE user_id=${userID}`, (err, result) => {
    if (err) {
      console.log(err);
      callback(false, err);
    }
    callback(true, result);
  });
};

const addShift = (state, callback) => {
  const { week, day, employeeId, timeId, userId } = state;
  connection.query(`REPLACE INTO shifts (week, day, employee_id, time_id, user_id) VALUES (${week}, ${day}, ${employeeId}, ${timeId}, ${userId})`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeShift = (state, callback) => {
  const { userId, week, day, employeeId } = state;
  connection.query(`DELETE FROM shifts WHERE employee_id=${employeeId} AND user_id=${userId} AND week=${week} AND day=${day}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const getShifts = (userID, callback) => {
  connection.query(`SELECT * FROM shifts WHERE user_id=${userID}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

module.exports = {
  addEmployee,
  removeEmployee,
  getEmployees,
  addTime,
  removeTime,
  getTimes,
  addShift,
  removeShift,
  getShifts,
};
