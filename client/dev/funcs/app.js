import axios from 'axios';

export default class AppFunctions {
  logout() {
    axios.post('/logout', {}).then((data) => {
      this.setState({
        logout: true,
      });
    });
  }

  getCalendars() {
    axios.post('/calendar', {
      userId: this.state.user.id,
    }).then((calResponse) => {
      const { data } = calResponse;
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
      this.state.calId = calId;
      this.state.calendars = calendars;
      this.getData(calId);
    });
  }

  getData(calId) {
    axios.post('/data', {
      userId: this.state.user.id,
      calId,
    }).then((dataResponse) => {
      const { resultEmp, resultTime, resultShift } = dataResponse.data;
      this.processEmployees(resultEmp);
      const times = this.processTimes(resultTime);
      const { schedule, employees } = this.processShifts(resultShift);
      this.setState({
        calId,
        times,
        employees,
        schedule,
      });
    });
  }

  processEmployees(data) {
    const employees = {};
    data.forEach((e) => {
      employees[e.id] = {
        name: e.name,
        shifts: [[]],
        color: e.color,
      };
    });
    this.state.employees = employees;
    return employees;
  }

  processTimes(data) {
    const times = {};
    data.forEach((t) => {
      const {
        tStart, tEnd, bStart, bEnd, bStart2, bEnd2, id,
      } = t;
      times[id] = {
        tStart,
        tEnd,
        bStart,
        bEnd,
        bStart2,
        bEnd2,
      };
    });
    this.state.times = times;
    return times;
  }

  processShifts(data) {
    const { employees, times } = this.state;
    let { schedule } = this.state;
    const max = data.reduce((a, c) => {
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
    this.state.employees = employees;
    this.state.schedule = schedule;
    return { schedule, employees };
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
      this.getData(this.state.calId);
    }).catch((err) => {
      console.log('error', err);
    });
  }

  removeEmployee(id) {
    axios.post('/employee/remove', {
      id: this.state.user.id,
      name: this.state.employees[id].name,
    }).then(() => {
      this.getData(this.state.calId);
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
      this.getData(this.state.calId);
    });
  }

  removeTime(id) {
    delete this.state.times[id];
    axios.post('/time/remove', {
      id: this.state.user.id,
      timeId: id,
    }).then(() => {
      this.getData(this.state.calId);
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
        this.getData(this.state.calId);
      });
    }
  }

  addEmployeeShift(id, valS, day, week) {
    // const i = Number(valS.slice(0, valS.indexOf('-')));
    const { schedule } = this.state;
    schedule[week][day].push(id);
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
      this.getData(this.state.calId);
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

  toEmployeeCalendar(employeePage) {
    this.setState({
      employeePage,
    });
  }

  toCalendar(calId) {
    this.setState({
      calId,
      employeePage: 0,
    }, () => this.getCalendars());
  }

  accordionClick(e, title) {
    const { index } = title;
    const { accordionIndexs } = this.state;
    if (accordionIndexs.includes(index)) {
      accordionIndexs.splice(accordionIndexs.indexOf(index), 1);
    } else {
      accordionIndexs.push(index);
    }
    this.setState({ accordionIndexs });
  }

  changeEmployeeColor(employeeId, color) {
    axios.post('/employee/color', {
      employeeId,
      color,
    }).then((resp) => {
      this.getData(this.state.calId);
    });
  }

  changeCalendar(e, data) {
    this.setState({
      calId: data.value,
    }, () => {
      this.getCalendars();
    });
  }

  backWeek() {
    this.setState({
      week: this.state.week - 1
    });
  }
}
