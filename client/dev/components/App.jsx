import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Segment, Header, Sidebar, Button, Accordion, Menu, Icon, Dropdown, Sticky, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import AppFunctions from '../funcs/app.js'

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
    };
    const appFunctions = new AppFunctions();


    console.log(props);
    this.state = {
      user: {
        id: props.id,
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
      logout: false,
      loading: true,
      toCreateTime: false,
    };
    this.addEmployee = appFunctions.addEmployee.bind(this);
    this.removeEmployee = appFunctions.removeEmployee.bind(this);
    this.addTime = appFunctions.addTime.bind(this);
    this.removeTime = appFunctions.removeTime.bind(this);
    this.changeEmployeeTime = appFunctions.changeEmployeeTime.bind(this);
    this.addEmployeeShift = appFunctions.addEmployeeShift.bind(this);
    this.removeShift = appFunctions.removeShift.bind(this);
    this.addCalItem = appFunctions.addCalItem.bind(this);
    this.removeCalItem = appFunctions.removeCalItem.bind(this);
    this.toEmployeeCalendar = appFunctions.toEmployeeCalendar.bind(this);
    this.toCalendar = appFunctions.toCalendar.bind(this);
    this.accordionClick = appFunctions.accordionClick.bind(this);


    this.nextWeek = appFunctions.nextWeek.bind(this);
    this.copyDay = appFunctions.copyDay.bind(this);
    this.pasteDay = appFunctions.pasteDay.bind(this);
    this.copyWeek = appFunctions.copyWeek.bind(this);
    this.pasteWeek = appFunctions.pasteWeek.bind(this);


    // this.getEmployees = this.getEmployees.bind(this);
    // this.getTimes = this.getTimes.bind(this);
    // this.getShifts = this.getShifts.bind(this);
    this.getCalendars = appFunctions.getCalendars.bind(this);
    this.getData = appFunctions.getData.bind(this);

    this.changeEmployeeColor = appFunctions.changeEmployeeColor.bind(this);
    this.changeCalendar = appFunctions.changeCalendar.bind(this);
    this.backWeek = appFunctions.backWeek.bind(this);
    this.logout = appFunctions.logout.bind(this);

    this.processEmployees = appFunctions.processEmployees.bind(this);
    this.processTimes = appFunctions.processTimes.bind(this);
    this.processShifts = appFunctions.processShifts.bind(this);
  }

  componentWillMount() {
    fetch('/check').then(res => res.json()).then(res => {
      console.log(res);
      let date = new Date(res.date);
      date.setDate((date.getDate() - date.getDay()) + 1);
      this.setState({
        firstMon: date,
        loading: false,
      }, this.getCalendars);
    });
  }

  render() {
    if (this.state.logout) {
      return <Redirect push to="/" />; 
    } else if (this.state.toCreateTime) {
      return <Redirect push to="/create/time" />; 
    }
    else if (this.state.loading) {
      return (
        <div>Loading</div>
      );
    }
    console.log(this.state.firstMon);
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
          <button onClick={this.logout} className={[appStyle.logout, appStyle.simpleButton].join(' ')}>Logout</button>
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
          <div className={appStyle.copyPaste}>
            <button onClick={this.copyWeek} className={appStyle.simpleButton}>Copy Week</button>
            <button onClick={this.pasteWeek} className={appStyle.simpleButton}>Paste Week</button>
          </div>
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
                <button onClick={() => this.setState({ toCreateTime: true })}>
                  To Create Time
                </button>
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

