import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


import EmployeeList from './EmployeeList';
import Calendar from './Calendar';
import TimeList from './TimeList';
import CalList from './CalList';
import styles from '../styles/styles.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    App.propTypes = {
      id: PropTypes.number.isRequired,
      admin: PropTypes.bool.isRequired,
      date: PropTypes.string.isRequired,
    };


    this.state = {
      user: {
        id: this.props.id,
        admin: this.props.admin,
      },
      calId: '',
      employees: {},
      times: {},
      calendars: {},
      schedule: [
        [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
        ],
      ],
      week: 0,
      savedDay: {},
      savedWeek: {},
      firstSun: '',
      showPanel: true,
    };
    this.addEmployee = this.addEmployee.bind(this);
    this.removeEmployee = this.removeEmployee.bind(this);
    this.addTime = this.addTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
    this.changeEmployeeTime = this.changeEmployeeTime.bind(this);
    this.addEmployeeShift = this.addEmployeeShift.bind(this);
    this.removeShift = this.removeShift.bind(this);
    this.addCalItem = this.addCalItem.bind(this);
    this.removeCalItem = this.removeCalItem.bind(this);


    this.nextWeek = this.nextWeek.bind(this);
    this.copyDay = this.copyDay.bind(this);
    this.pasteDay = this.pasteDay.bind(this);
    this.copyWeek = this.copyWeek.bind(this);
    this.pasteWeek = this.pasteWeek.bind(this);


    this.getEmployees = this.getEmployees.bind(this);
    this.getTimes = this.getTimes.bind(this);
    this.getShifts = this.getShifts.bind(this);
    this.getCalendars = this.getCalendars.bind(this);
  }

  componentWillMount() {
    let date = new Date(this.props.date);
    date.setDate(date.getDate() - date.getDay());
    this.setState({
      firstSun: date,
    });

    this.getCalendars();
  }

  getCalendars() {
    axios.post('/calendar', {
      id: this.state.user.id,
    }).then((response) => {
      const { data } = response;
      const calendars = {};
      let { calId } = this.state;
      data.forEach((c, i) => {
        if (!calId) {
          calId = c.id;
        }
        calendars[c.id] = {
          name: c.name,
        };
      });
      this.setState({
        calendars,
        calId,
      }, () => {
        this.getEmployees();
        this.getTimes();
        this.getShifts();
      });
    });
  }

  getEmployees() {
    axios.post('/employee', {
      id: this.state.user.id,
    }).then((response) => {
      const { data } = response;
      const employees = {};
      data.forEach((e) => {
        employees[e.id] = {
          name: e.name,
          shifts: [[]],
        };
      });
      this.setState({
        employees,
      });
    });
  }

  getTimes() {
    axios.post('/time', {
      id: this.state.user.id,
    }).then((response) => {
      const { data } = response;
      const times = {};
      data.forEach((t) => {
        const {
          tStart, tEnd, bStart, bEnd, id,
        } = t;
        times[id] = {
          tStart,
          tEnd,
          bStart,
          bEnd,
        };
      });
      this.setState({
        times,
      });
    });
  }

  getShifts() {
    axios.post('/shift', {
      userId: this.state.user.id,
      calId: this.state.calId,
    }).then((response) => {
      console.log('shifts: ', response.data);
      const { data } = response;
      const { employees, times } = this.state;
      let { schedule } = this.state;
      const max = response.data.reduce((a, c) => {
        if (c.week > a) {
          return c.week;
        }
        return a;
      }, 0);
      schedule = [];
      for (let i = 0; i <= max; i += 1) {
        schedule[i] = [[], [], [], [], [], [], []];
        Object.keys(employees).forEach((e) => {
          employees[e].shifts.push([]);
        });
      }
      for (let i = 0; i < data.length; i += 1) {
        employees[data[i].employee_id].shifts[data[i].week][data[i].day] = data[i].time_id;
        if (!schedule[data[i].week][data[i].day].includes(data[i].employee_id)) {
          schedule[data[i].week][data[i].day].push(data[i].employee_id);
        }
      }
      console.log(employees);
      Object.keys(employees).forEach((e) => {
        employees[e].shifts.forEach((s, i) => {
          const sWeek = s.slice();
          sWeek[7] = sWeek.reduce((a, c, idx) => {
            if (c && idx < 7) {
              return a + (times[c].tEnd - times[c].tStart);
            }
            return a;
          }, 0);
          employees[e].shifts[i] = sWeek;
        });
      });

      this.setState({
        employees,
        schedule,
      });
    });
  }

  pasteWeek() {
    const { savedWeek } = this.state;
    if (savedWeek.week !== this.state.week) {
      for (let i = 0; i < savedWeek.emps.length; i += 1) {
        for (let j = 0; j < savedWeek.emps[i].length; j += 1) {
          this.changeEmployeeTime(savedWeek.emps[i][j], savedWeek.times[i][j], i, this.state.week);
        }
      }
    }
  }

  copyWeek() {
    const employeeIds = this.state.schedule[this.state.week];
    const timeIds = employeeIds.map((d, idx) => d.map(e => this.state.employees[e].shifts[this.state.week][idx]));
    const savedWeek = {
      week: this.state.week,
      emps: employeeIds,
      times: timeIds,
    };
    this.setState({
      savedWeek,
    });
  }

  pasteDay(week, day) {
    const { savedDay } = this.state;
    if (!(savedDay.week === week && savedDay.day === day)) {
      for (let i = 0; i < savedDay.emps.length; i += 1) {
        this.changeEmployeeTime(savedDay.emps[i], savedDay.times[i], day, week);
      }
    }
  }

  copyDay(week, day) {
    const employeeIds = this.state.schedule[week][day];
    const timeIds = employeeIds.map(e => this.state.employees[e].shifts[week][day]);
    const savedDay = {
      week,
      day,
      emps: employeeIds,
      times: timeIds,
    };
    this.setState({
      savedDay,
    });
  }

  addCalItem(name) {
    axios.post('/calendar/add', {
      userID: this.state.user.id,
      name,
    }).then(() => {
      this.getCalendars();
    }).catch((err) => {
      console.log('error', err);
    });
  }

  removeCalItem(id) {
    axios.post('/calendar/remove', {
      userID: this.state.user.id,
      name: this.state.calendars[id].name,
    }).then(() => {
      this.getCalendars();
    });
  }

  addEmployee(name) {
    axios.post('/employee/add', {
      id: this.state.user.id,
      name,
    }).then(() => {
      this.getEmployees();
      this.getShifts();
    }).catch((err) => {
      console.log('error', err);
    });
  }

  removeEmployee(id) {
    axios.post('/employee/remove', {
      id: this.state.user.id,
      name: this.state.employees[id].name,
    }).then(() => {
      this.getEmployees();
      this.getShifts();
    });
  }

  addTime(state) {
    const {
      start, end, bStart, bEnd, bStart2, bEnd2,
    } = state;
    axios.post('/time/add', {
      id: this.state.user.id,
      start,
      end,
      bStart,
      bEnd,
      bStart2,
      bEnd2,
    }).then(() => {
      this.getTimes();
    });
  }

  removeTime(id) {
    axios.post('/time/remove', {
      id: this.state.user.id,
      timeId: id,
    }).then(() => {
      this.getEmployees();
      this.getShifts();
      this.getTimes();
    });
  }

  changeEmployeeTime(empI, timeI, day, week) {
    if (timeI !== '') {
      axios.post('/shift/add', {
        userId: this.state.user.id,
        calId: this.state.calId,
        week,
        day,
        employeeId: empI,
        timeId: timeI,
      }).then(() => {
        this.getShifts();
      });
    }
  }

  addEmployeeShift(valS, day, week) {
    const i = Number(valS.slice(0, valS.indexOf('-')));
    const { schedule } = this.state;
    schedule[week][day].push(i);
    this.setState({
      schedule,
    });
  }

  removeShift(week, day, employeeId) {
    axios.post('/shift/remove', {
      userId: this.state.user.id,
      calId: this.state.calId,
      week,
      day,
      employeeId,
    }).then(() => {
      let emps = this.state.employees;
      emps[employeeId].shifts[week][day] = undefined;
      this.getTimes();
      this.getShifts();
    });
  }

  nextWeek() {
    const { schedule, employees } = this.state;
    let { week } = this.state;
    if (schedule.length <= week + 1) {
      schedule.push([[], [], [], [], [], [], []]);
      Object.keys(employees).forEach((e) => {
        employees[e].shifts.push([]);
      });
    }
    week += 1;
    this.setState({
      schedule,
      week,
      employees,
    });
  }

  render() {
    return (
      <div className={styles.inputPage}>
        <div className={styles.calendarArea}>
          {this.state.user.admin ?
            <span>
              <button onClick={this.copyWeek}>Copy Week</button>
              <button onClick={this.pasteWeek}>Paste Week</button>
            </span> :
            ''}
          <button
            onClick={() => this.setState({ week: this.state.week - 1 })}
            style={{
              visibility: this.state.week === 0 ? 'hidden' : 'visible',
            }}
          >
            Previous Week
          </button>
          <button onClick={this.nextWeek}>Next Week</button>
          <select
            onChange={(e) => {
              this.setState({
                calId: e.target.options[e.target.selectedIndex].value,
              }, () => {
                this.getEmployees();
                this.getShifts();
              });
            }}
          >
            {Object.keys(this.state.calendars).map(c => <option value={c}>{this.state.calendars[c].name}</option>)}
          </select>
          {[...Array(7)].map((c, i) => (
            <Calendar
              employees={this.state.employees}
              times={this.state.times}
              changeET={this.changeEmployeeTime}
              addES={this.addEmployeeShift}
              removeShift={this.removeShift}
              schedule={this.state.schedule}
              dayNum={i}
              weekNum={this.state.week}
              admin={this.state.user.admin}
              copyDay={this.copyDay}
              pasteDay={this.pasteDay}
              date={this.state.firstSun}
            />
          ))}
        </div>
        <div className={this.state.showPanel ? styles.controlPanel : styles.hidePanel}>
          <button
            style={{ width: '100%' }}
            onClick={() => this.setState({ showPanel: !this.state.showPanel })}
          >
            {this.state.showPanel ? 'Hide' : 'Show'} Control Panel
          </button>
          <div className={styles.empList}>
            {this.state.showPanel ?
              <div>
                <p>Manage Employees</p>
                <EmployeeList
                  addEmployee={this.addEmployee}
                  removeEmployee={this.removeEmployee}
                  employees={this.state.employees}
                />
              </div> :
            ''}
          </div>
          <div className={styles.timeList}>
            {this.state.showPanel ?
              <div>
                <p>Manage Times</p>
                <TimeList
                  addTime={this.addTime}
                  removeTime={this.removeTime}
                  times={this.state.times}
                />
              </div>:
            ''}
          </div>
          <div className={styles.calList}>
            {this.state.showPanel ?
              <div>
                <p>Manage Calendars</p>
                <CalList
                  addCalItem={this.addCalItem}
                  removeCalItem={this.removeCalItem}
                  calendars={this.state.calendars}
                />
              </div>:
            ''}
          </div>
        </div>
      </div>
    );
  }
}

