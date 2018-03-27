import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/styles.css';

const CalenderRow = ({
  times, dayNum, weekNum, admin, data, changeTime, removeShift, id,
}) => {
  CalenderRow.propTypes = {
    times: PropTypes.array.isRequired,
    dayNum: PropTypes.number.isRequired,
    weekNum: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    changeTime: PropTypes.func.isRequired,
    removeShift: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
  };
  const { shifts, name } = data;
  const timesArr = [];
  Object.keys(times).forEach((t) => {
    timesArr.push(<option value={t}>{`${times[t].tStart}-${times[t].tEnd}`}</option>);
  });
  console.log(shifts);
  return (
    <div>
      <div className={styles.firstCol}>
        {name}
        <br />
        {admin ?
          <select
            defaultValue={shifts[weekNum][dayNum]}
            onChange={e => (
              changeTime(id, e.target.options[e.target.selectedIndex].value, dayNum, weekNum)
            )}
          >
            <option />
            {timesArr}
          </select> :
        ''}
        <span style={{ fontSize: '10px' }}>-Hrs:{shifts[weekNum][7]}</span>
      </div>
      {[...Array(24)].map((h, i) => (
        <div
          className={shifts[weekNum][dayNum] >= 0 &&
            (i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart &&
            (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd ?
            styles.calRow :
            styles.calRowOff}
        >
          <span className={styles.cellText}>
            {shifts[weekNum][dayNum] >= 0 &&
              (i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart &&
              (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd ?
              'B' :
            ' '}
          </span>
        </div>
      ))}
      {admin ?
        <button
          className={styles.removeButton}
          onClick={() => removeShift(weekNum, dayNum, id)}
        >
          x
        </button> :
        ''}
    </div>
  );
};

export default CalenderRow;
