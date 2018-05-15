import React from 'react';
import PropTypes from 'prop-types';

import CalenderRow from './CalendarRow';
import styles from '../styles/styles.css';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'Alphabetically',
    };

    this.changeSort = this.changeSort.bind(this);
  }

  changeSort() {
    this.setState({
      sort: this.state.sort === 'Alphabetically' ? 'Color' : 'Alphabetically',
    });
  }

  render() {
    let {
      schedule, employees, dayNum, weekNum, admin, copyDay, pasteDay, date, times, changeET, removeShift, addES,
    } = this.props;
    const empOpts = [];
    Object.keys(employees).sort((a, b) => {
      const nameA = employees[a].name.toLowerCase().split(' ')[1];
      const nameB = employees[b].name.toLowerCase().split(' ')[1];
      if (nameA > nameB) {
        return 1;
      } else if (nameA < nameB) {
        return -1;
      }
      return 0;
    }).forEach((e) => {
      if (!schedule[weekNum][dayNum].includes(Number(e))) {
        empOpts.push(<option data-id={e}>{`${employees[e].name}`}</option>);
      }
    });
    let thisDate = new Date(date.getTime());
    thisDate.setDate(thisDate.getDate() + dayNum + (weekNum*7));

    const topRow = [...Array(14)].map((x, i) => {
      let text = '';
      text = `${8 + i}:00`;
      // if ((i - 1) % 2 === 0) {
      //   text = `${8 + ((i - 1) / 2)}:00`;
      // } else {
      //   text = `${7.5 + ((i - 1) / 2)}:30`;
      // }
      if (i === 0) {
        text = '';
      }
      return (
        <div className={i === 0 ? styles.firstCol : styles.topRow}>
          <span>
            {i === 0 ?
              <button
                onClick={this.changeSort}
              >
                {this.state.sort === 'Alphabetically' ? 'Sort Color' : 'Sort Alpha'}
              </button>
              : text
            }
          </span>
        </div>
      );
    });

    let employeeRows = schedule[weekNum][dayNum].slice();
    if (this.state.sort === 'Alphabetically') {
      employeeRows.sort((a, b) => {
        const nameA = employees[a].name.toLowerCase().split(' ')[1];
        const nameB = employees[b].name.toLowerCase().split(' ')[1];
        if (nameA > nameB) {
          return 1;
        } else if (nameA < nameB) {
          return -1;
        }
        return 0;
      });
    } else {
      employeeRows.sort((a, b) => {
        const nameA = employees[a].name.toLowerCase().split(' ')[1];
        const nameB = employees[b].name.toLowerCase().split(' ')[1];
        const colorA = employees[a].color;
        const colorB = employees[b].color;

        if (colorA > colorB) {
          return 1;
        } else if (colorB > colorA) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else if (nameA < nameB) {
          return -1;
        }
        return 0;
      });
    }

    let totalWorkers = [...Array(26)].map(x => 0);
    employeeRows.forEach((e) => {
      let { shifts } = employees[e];
      for (let i = 0; i < 26; i += 1) {
        if ((i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart &&
        (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd) {
          if ((((i / 2) + 8 < times[shifts[weekNum][dayNum]].bStart ||
          (i / 2) + 8 >= times[shifts[weekNum][dayNum]].bEnd))) {
            if ((((i / 2) + 8 < times[shifts[weekNum][dayNum]].bStart2 ||
            (i / 2) + 8 >= times[shifts[weekNum][dayNum]].bEnd2))) {
              totalWorkers[i] += 1;
            }
          }
        }
      }
    });
    const botRow = [...Array(27)].map((x, i) => {
      let text = '';
      text = totalWorkers[i - 1];
      if (i === 0) {
        text = 'People Working: ';
      }
      return (
        <div className={i === 0 ? styles.firstCol : styles.botRow}>
          <span>{text}</span>
        </div>
      );
    });

    return (
      <div className={styles.calendar}>
        <h3>{thisDate.toDateString()}</h3>
        {topRow}
        {employeeRows.map(e => (
          <CalenderRow
            key={e}
            id={e}
            data={employees[e]}
            times={times}
            changeTime={changeET}
            dayNum={dayNum}
            weekNum={weekNum}
            removeShift={removeShift}
            admin={admin}
          />
        ))}
        {botRow}
        {admin ?
          <div>
            Add Employee: <br />
            <select onChange={(e) => {
              if (e.target.selectedIndex !== 0) {
                addES(e.target.options[e.target.selectedIndex].getAttribute('data-id'), e.target.value, dayNum, weekNum);
                e.target.selectedIndex = 0;
              }
            }}
            >
              <option />
              {empOpts}
            </select>
            <button onClick={() => copyDay(weekNum, dayNum)}>Copy</button>
            <button onClick={() => pasteDay(weekNum, dayNum)}>Paste</button>
          </div> :
        ''}
      </div>
    );
  }
}

Calendar.propTypes = {
  schedule: PropTypes.array.isRequired,
  employees: PropTypes.object.isRequired,
  dayNum: PropTypes.number.isRequired,
  weekNum: PropTypes.number.isRequired,
  admin: PropTypes.bool.isRequired,
  copyDay: PropTypes.func.isRequired,
  pasteDay: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  times: PropTypes.object.isRequired,
  changeET: PropTypes.func.isRequired,
  removeShift: PropTypes.func.isRequired,
  addES: PropTypes.func.isRequired,
};

// export default Calendar;
