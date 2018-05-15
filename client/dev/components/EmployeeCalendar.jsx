import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import CalenderRow from './CalendarRow';
import styles from '../styles/styles.css';

const EmployeeCalendar = ({
  employeeId, employeeData, times, changeET, removeShift, weekNum, admin, changeEmployeeColor,
}) => {
  EmployeeCalendar.propTypes = {
    employeeId: PropTypes.number.isRequired,
    employeeData: PropTypes.object.isRequired,
    times: PropTypes.object.isRequired,
    changeET: PropTypes.func.isRequired,
    removeShift: PropTypes.func.isRequired,
    weekNum: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    changeEmployeeColor: PropTypes.func.isRequired,
  };

  const topRow = [...Array(27)].map((x, i) => {
    let text = '';
    if ((i - 1) % 2 === 0) {
      text = `${8 + ((i - 1) / 2)}:00`;
    } else {
      text = `${7.5 + ((i - 1) / 2)}:30`;
    }
    if (i === 0) {
      text = '';
    }
    return (
      <div className={i === 0 ? styles.firstCol : styles.topRow}>
        <span>
          {text}
        </span>
      </div>
    );
  });

  let colors = ['blue', 'red', 'green', 'yellow', 'orange'];

  colors = colors.map(x => <option>{x}</option>);

  return (
    <div style={{ height: '80vh', margin: '20px' }}>
      <Header as="h3">
        {employeeData.name}
      </Header>
      <select
        defaultValue={employeeData.color}
        onChange={e => (
          changeEmployeeColor(employeeId, e.target.options[e.target.selectedIndex].value)
        )}
      >
        {colors}
      </select>
      <br />
      {topRow}
      {[...Array(7)].map((e, i) => (
        <CalenderRow
          key={i}
          id={employeeId}
          data={employeeData}
          times={times}
          changeTime={changeET}
          dayNum={i}
          weekNum={weekNum}
          removeShift={removeShift}
          admin={admin}
          employeePage
        />
      ))}
    </div>
  );
};

export default EmployeeCalendar;
