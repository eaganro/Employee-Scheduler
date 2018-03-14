import React from 'react';
import CalenderRow from './CalendarRow.jsx';
import styles from '../styles/styles.css';

export default class Calender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 'full',
    };
  }


  render() {
    const { schedule, employees, dayNum, weekNum, admin, copyDay, pasteDay, date } = this.props;
    const empOpts = [];
    Object.keys(employees).forEach((e) => {
      if (!schedule[weekNum][dayNum].includes(Number(e))) {
        empOpts.push(<option>{`${e}-${employees[e].name}`}</option>);
      }
    });
    let thisDate = new Date(date.getTime());
    thisDate.setDate(thisDate.getDate() + dayNum + weekNum*7);

    return (
      <div className={styles.calendar}>
        <h3>{thisDate.toDateString()}</h3>
        {[...Array(25)].map((x, i) => (
          <div className={i === 0 ? styles.firstCol : styles.topRow}>
            {i === 0 ? ' ' : (i-1)%2=== 0 ? 8+((i - 1) / 2) + ':00' : 8+((i - 1) / 2)-0.5 + ':30'}
          </div>
        ))}
        {schedule[weekNum][dayNum].map(e => (
          <CalenderRow
            id={e}
            data={employees[e]}
            times={this.props.times}
            changeTime={this.props.changeET}
            dayNum={dayNum}
            weekNum={this.props.weekNum}
            removeShift={this.props.removeShift}
            admin={admin}
          />
        ))}
        {admin ?
           <div>
            Add Employee: <br />
            <select onChange={(e) => {
              if (e.target.selectedIndex !== 0) {
                this.props.addES(e.target.value, dayNum, weekNum);
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
