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
  const {
    times, breaks, id,
  } = state;
  const starts = times.map((x, i) => 'tStart' + (i+1)).join(', ');
  const ends = times.map((x, i) => 'tEnd' + (i+1)).join(', ');
  const bStarts = breaks.map((x, i) => 'bStart' + (i+1)).join(', ');
  const bEnds = breaks.map((x, i) => 'bEnd' + (i+1)).join(', ');

  const startsV = times.map((x) => x.start).join(', ');
  const endsV = times.map((x) => x.end).join(', ');
  const bStartsV = breaks.map((x) => x.start).join(', ');
  const bEndsV = breaks.map((x) => x.end).join(', ');

  connection.query(`INSERT INTO times (${starts}, ${ends}, ${bStarts}, ${bEnds}, user_id)
    VALUES (${startsV}, ${endsV}, ${bStartsV}, ${bEndsV}, ${id})`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeTime = (state, callback) => {
  const { id, timeId } = state;
  connection.query(`DELETE FROM times WHERE id=${timeId} AND user_id=${id}`, (err, result) => {
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
  const {
    week, day, employeeId, timeId, userId, calId,
  } = state;
  connection.query(`INSERT INTO shifts (week, day, employee_id, time_id, calendar_id, user_id)
    VALUES (${week}, ${day}, ${employeeId}, ${timeId}, ${calId}, ${userId})
    ON DUPLICATE KEY UPDATE time_id=${timeId};`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeShift = (state, callback) => {
  const {
    userId, week, day, employeeId, calId,
  } = state;
  connection.query(`DELETE FROM shifts
  WHERE employee_id=${employeeId} AND user_id=${userId} AND calendar_id=${calId}
  AND week=${week} AND day=${day}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const getShifts = (data, callback) => {
  const { userId, calId } = data;
  connection.query(`SELECT * FROM shifts WHERE user_id=${userId} AND calendar_id=${calId}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const signUp = (data, callback) => {
  const {
    username,
    password,
    empname,
    emppass,
  } = data;
  let date = new Date();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate();
  let year = date.getUTCFullYear();
  connection.query(`INSERT INTO users (username, password, empname, emppassword, createdate)
  VALUES ('${username}', '${password}', '${empname}', '${emppass}', '${year}-${month}-${day}');`, (err, ins) => {
    if (err) {
      callback(false, err);
    } else {
      connection.query(`SELECT * FROM users
      WHERE username='${username}' AND password='${password}';`, (err2, result) => {
        if (err2) {
          callback(false, err2);
        } else {
          connection.query(`INSERT INTO calendars (name, user_id)
          VALUES ('default', ${result[0].id});`, (calInsErr, insRes) => {
            if (calInsErr) {
              callback(false, calInsErr);
            } else {
              console.log(insRes);
              callback(true, result, insRes.insertId);
            }
          });
        }
      });
    }
  });
};

const adminLogin = (data, callback) => {
  const {
    username,
    password,
  } = data;
  connection.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}';`, (err, result) => {
    console.log('db', err, result);
    if (err || result.length === 0) {
      callback(false, err);
      return;
    }
    callback(true, result);
  });
};

const employeeLogin = (data, callback) => {
  const {
    username,
    password,
  } = data;
  connection.query(`SELECT * FROM users WHERE empname='${username}' AND emppassword='${password}';`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const addCalendar = (data, callback) => {
  const { name, userID } = data;
  connection.query(`INSERT INTO calendars (name, user_id) VALUES ('${name}', ${userID})`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const removeCalendar = (data, callback) => {
  const { name, userID } = data;
  connection.query(`DELETE FROM calendars WHERE name='${name}' AND user_id=${userID}`, (err, result) => {
    if (err) {
      callback(false, err);
    }
    callback(true, result);
  });
};

const getCalendars = (userID, callback) => {
  connection.query(`SELECT * FROM calendars WHERE user_id=${userID}`, (err, result) => {
    if (err) {
      console.log(err);
      callback(false, err);
    }
    callback(true, result);
  });
};

const changeEmployeeColor = (employeeId, color, callback) => {
  connection.query(`UPDATE employees SET color='${color}' WHERE id=${employeeId}`, (err, result) => {
    if (err) {
      console.log(err);
      callback(false, err);
    } else {
      callback(true, result);
    }
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
  signUp,
  adminLogin,
  employeeLogin,
  addCalendar,
  removeCalendar,
  getCalendars,
  changeEmployeeColor,
};
