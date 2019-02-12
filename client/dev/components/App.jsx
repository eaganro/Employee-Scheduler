import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Segment, Header, Sidebar, Button, Accordion, Menu, Icon, Dropdown, Sticky, Message } from 'semantic-ui-react';


import EmployeeList from './EmployeeList';
import Calendar from './Calendar';
import TimeList from './TimeList';
import CalList from './CalList';
import EmployeeCalendar from './EmployeeCalendar';
import styles from '../styles/styles.scss';
import appStyle from '../styles/app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    App.propTypes = {
      id: PropTypes.number.isRequired,
      admin: PropTypes.bool.isRequired,
      date: PropTypes.string.isRequired,
      logout: PropTypes.func.isRequired,
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
      firstMon: '',
      showPanel: true,
      employeePage: null,
      accordionIndexs: [],
      initial: true,
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
    this.toEmployeeCalendar = this.toEmployeeCalendar.bind(this);
    this.toCalendar = this.toCalendar.bind(this);
    this.accordionClick = this.accordionClick.bind(this);


    this.nextWeek = this.nextWeek.bind(this);
    this.copyDay = this.copyDay.bind(this);
    this.pasteDay = this.pasteDay.bind(this);
    this.copyWeek = this.copyWeek.bind(this);
    this.pasteWeek = this.pasteWeek.bind(this);


    // this.getEmployees = this.getEmployees.bind(this);
    // this.getTimes = this.getTimes.bind(this);
    // this.getShifts = this.getShifts.bind(this);
    this.getCalendars = this.getCalendars.bind(this);
    this.getData = this.getData.bind(this);

    this.changeEmployeeColor = this.changeEmployeeColor.bind(this);
    this.changeCalendar = this.changeCalendar.bind(this);
    this.backWeek = this.backWeek.bind(this);
  }

  componentWillMount() {
    let date = new Date(this.props.date);
    date.setDate((date.getDate() - date.getDay()) + 1);
    // this.setState({
    //   firstSun: date,
    // });
    this.state.firstMon = date;
    this.getCalendars();
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

  render() {
    return (
      <Container className={appStyle.topContainer}>
        <div className={appStyle.topBar}>
          <Header as="h2" textAlign="center" className={appStyle.mainHeader}>
            <Dropdown
              className={appStyle.headerDropdown}
              value={String(this.state.calId)}
              options={Object.keys(this.state.calendars).map(c => ({ text: this.state.calendars[c].name, value: c }))}
              onChange={this.changeCalendar}
            />
            <Header.Subheader className={appStyle.subheader}>
              {`${new Date(this.state.firstMon.getTime() + (this.state.week*7*1000*60*60*24)).toDateString()} -
              ${new Date(this.state.firstMon.getTime() + (this.state.week*7*1000*60*60*24) + (6*1000*60*60*24)).toDateString()}`}
            </Header.Subheader>
          </Header>
          <Button onClick={this.backWeek} icon
            className={[appStyle.dateButton, this.state.week ? '' : appStyle.show, appStyle.left].join(' ')} >
            <Icon size="big" name="arrow circle left" />
          </Button>
          <Button circular onClick={this.nextWeek} className={[appStyle.dateButton, appStyle.right].join(' ')} icon>
            <Icon size="big" name="arrow circle right" />
          </Button>
          <button onClick={this.props.logout} className={[appStyle.logout, appStyle.simpleButton].join(' ')}>Logout</button>
          {this.state.showPanel ?
          <Button
            onClick={() => this.setState({ showPanel: !this.state.showPanel, initial: false })}
            floated="right"
            className={[appStyle.showHide, this.state.initial ? '' : appStyle.show].join(' ')}
            key="show"
          >
            <Icon size="big" name={this.state.showPanel ? 'angle right' : 'angle left'} />
          </Button> :
          <Button
            onClick={() => this.setState({ showPanel: !this.state.showPanel })}
            floated="right"
            className={[appStyle.showHide, appStyle.hide].join(' ')}
            key="hide"
          >
            <Icon size="big" name={this.state.showPanel ? 'angle right' : 'angle left'} />
          </Button>
          }
          {this.state.user.admin ?
          <div className={appStyle.copyPaste}>
            <button onClick={this.copyWeek} className={appStyle.simpleButton}>Copy Week</button>
            <button onClick={this.pasteWeek} className={appStyle.simpleButton}>Paste Week</button>
          </div> :
          ''}
        </div>
        <Sidebar.Pushable as={Container} fluid>
          <Sidebar
            animation="overlay"
            width="wide"
            direction="right"
            visible={this.state.showPanel}
            className={appStyle.sidebar}
          >
            <Accordion as={Menu} vertical fluid exclusive={false} className={appStyle.accordion}>
              <Menu.Item name="caldendars">
                <Accordion.Title
                  active={this.state.accordionIndexs.includes(0)}
                  index={0}
                  content={<Header><Icon name="calendar" />Manage Calendars</Header>}
                  onClick={this.accordionClick}
                />
                <Accordion.Content
                  active={this.state.accordionIndexs.includes(0)}
                  content={<CalList
                    addCalItem={this.addCalItem}
                    removeCalItem={this.removeCalItem}
                    calendars={this.state.calendars}
                    toCalendar={this.toCalendar}
                  />}
                />
              </Menu.Item>
              <Menu.Item name="employees">
                <Accordion.Title
                  active={this.state.accordionIndexs.includes(1)}
                  index={1}
                  content={<Header><Icon name="users" />Manage Employees</Header>}
                  onClick={this.accordionClick}
                />
                <Accordion.Content
                  active={this.state.accordionIndexs.includes(1)}
                  content={<EmployeeList
                    addEmployee={this.addEmployee}
                    removeEmployee={this.removeEmployee}
                    employees={this.state.employees}
                    toEmployeeCalendar={this.toEmployeeCalendar}
                  />}
                />
              </Menu.Item>
              <Menu.Item name="times">
                <Accordion.Title
                  active={this.state.accordionIndexs.includes(2)}
                  index={2}
                  content={<Header><Icon name="time" />Manage Shifts</Header>}
                  onClick={this.accordionClick}
                />
                <Accordion.Content
                  active={this.state.accordionIndexs.includes(2)}
                  content={<TimeList
                    addTime={this.addTime}
                    removeTime={this.removeTime}
                    times={this.state.times}
                  />}
                />
              </Menu.Item>
            </Accordion>
          </Sidebar>
          <Sidebar.Pusher className={appStyle.pusher}>
            {this.state.employeePage ?
            <EmployeeCalendar
              employeeId={this.state.employeePage}
              employeeData={this.state.employees[this.state.employeePage]}
              times={this.state.times}
              changeET={this.changeEmployeeTime}
              removeShift={this.removeShift}
              weekNum={this.state.week}
              admin={this.state.user.admin}
              changeEmployeeColor={this.changeEmployeeColor}
            /> :
            [...Array(7)].map((c, i) => (
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
              date={this.state.firstMon}
              key={`${this.state.week} ${i}`}
            />
            ))
            }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Container>
      );
}
}

