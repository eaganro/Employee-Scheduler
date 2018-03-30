const express = require('express');
const parser = require('body-parser');
const session = require('express-session');
const path = require('path');

const db = require('../database/');

const app = express();

app.use(parser.json());

app.use(express.static(path.join(__dirname, '/../client/dist')));

app.post('/employee/add', (req, res) => {
  db.addEmployee(req.body.name, req.body.id, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(422).send(result);
    }
  });
});

app.post('/employee/remove', (req, res) => {
  db.removeEmployee(req.body.name, req.body.id, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/employee', (req, res) => {
  db.getEmployees(req.body.id, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/time/add', (req, res) => {
  db.addTime(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/time/remove', (req, res) => {
  db.removeTime(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/time', (req, res) => {
  db.getTimes(req.body.id, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/calendar/add', (req, res) => {
  db.addCalendar(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(422).send(result);
    }
  });
});

app.post('/calendar/remove', (req, res) => {
  db.removeCalendar(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(422).send(result);
    }
  });
});

app.post('/calendar', (req, res) => {
  db.getCalendars(req.body.userId, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/shift', (req, res) => {
  db.getShifts(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
  });
});

app.post('/shift/add', (req, res) => {
  console.log(req.body);
  db.addShift(req.body, (stat, result) => {
    if (stat) {
      res.status(200).send(result);
    } else {
      console.log(result);
      res.status(400).send(result);
    }
  });
});

app.post('/shift/remove', (req, res) => {
  console.log(req.body);
  db.removeShift(req.body, (stat, result) => {
    if (stat) {
      console.log(result);
      res.status(200).send(result);
    } else {
      console.log(result);
      res.status(400).send(result);
    }
  });
});

app.post('/signup', (req, res) => {
  db.signUp(req.body, (stat, result, calID) => {
    if (stat) {
      console.log(result);
      res.status(200).send(result);
    } else {
      let newRes = result;
      console.log(result);
      newRes[0].calID = calID;
      res.status(400).send(newRes);
    }
  });
});

app.post('/login/admin', (req, res) => {
  db.adminLogin(req.body, (stat, result) => {
    if (stat) {
      console.log(result);
      res.status(200).send(result);
    } else {
      console.log(result);
      res.status(400).send(result);
    }
  });
});

app.post('/login/employee', (req, res) => {
  db.employeeLogin(req.body, (stat, result) => {
    if (stat) {
      console.log(result);
      res.status(200).send(result);
    } else {
      console.log(result);
      res.status(400).send(result);
    }
  });
});

app.post('/data', (req, res) => {
  const { userId } = req.body;
  console.log(req.body);
  db.getEmployees(userId, (statEmp, resultEmp) => {
    if (statEmp) {
      console.log(resultEmp);
      db.getTimes(userId, (statTime, resultTime) => {
        if (statTime) {
          console.log(resultTime);
          db.getShifts(req.body, (statShift, resultShift) => {
            if (statShift) {
              console.log(resultShift);
              res.status(200).send({
                resultEmp, resultTime, resultShift,
              });
            } else {
              res.status(400).send(resultShift);
            }
          });
        } else {
          res.status(400).send(resultTime);
        }
      });
    } else {
      res.status(400).send(resultEmp);
    }
  });
});

app.listen(3333, () => {
  console.log('listening on port 3333');
});
