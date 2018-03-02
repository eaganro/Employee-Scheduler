const express = require('express');
const parser = require('body-parser');
const db = require('../database/');

const app = express();

app.use(parser.json());
app.use(express.static(__dirname + '/../client/dist'));

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

app.post('/shift', (req, res) => {
  db.getShifts(req.body.id, (stat, result) => {
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

app.listen(3333, () => {
  console.log('listening on port 3333');
});
