import React from 'react';
import PropTypes from 'prop-types';

import CalenderRow from './CalendarRow';
import styles from '../styles/styles.css';

const Calendar = ({
  schedule, employees, dayNum, weekNum, admin, copyDay, pasteDay, date, times, changeET, removeShift,
}) => {
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
  };

  const empOpts = [];
  Object.keys(employees).forEach((e) => {
    if (!schedule[weekNum][dayNum].includes(Number(e))) {
      empOpts.push(<option>{`${e}-${employees[e].name}`}</option>);
    }
  });
  let thisDate = new Date(date.getTime());
  thisDate.setDate(thisDate.getDate() + dayNum + (weekNum*7));
  return (
    <div className={styles.calendar}>
      <h3>{thisDate.toDateString()}</h3>
      {[...Array(25)].map((x, i) => (
        <div className={i === 0 ? styles.firstCol : styles.topRow}>
          <span>
            {i === 0 ? ' ' : (i-1)%2=== 0 ? 8+((i - 1) / 2) + ':00' : 8+((i - 1) / 2)-0.5 + ':30'}
          </span>
        </div>
      ))}
      {schedule[weekNum][dayNum].map(e => (
        <CalenderRow
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
      {admin ?
        <div>
          Add Employee: <br />
          <select onChange={(e) => {
            if (e.target.selectedIndex !== 0) {
              addES(e.target.value, dayNum, weekNum);
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
};

export default Calendar;
