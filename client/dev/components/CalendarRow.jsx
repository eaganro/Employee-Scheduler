import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/styles.scss';

const CalenderRow = ({
  times, dayNum, weekNum, admin, data, changeTime, removeShift, id, employeePage,
}) => {
  CalenderRow.propTypes = {
    times: PropTypes.object.isRequired,
    dayNum: PropTypes.number.isRequired,
    weekNum: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    changeTime: PropTypes.func.isRequired,
    removeShift: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    employeePage: PropTypes.bool,
  };
  CalenderRow.defaultProps = {
    employeePage: null,
  };
  const DAYS = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday',
  };

  const COLORS= {
    red: 'rgba(255, 0, 0, 1)',
    yellow: 'rgba(255, 255, 0, 1)',
    green: 'rgba(51, 204, 51, 1)',
    orange: 'rgba(255, 153, 0, 1)',
    blue: 'rgba(0, 0, 255, 1)',
    redb: 'rgba(255, 0, 0, 0.3)',
    yellowb: 'rgba(255, 255, 0, 0.3)',
    greenb: 'rgba(51, 204, 51, 0.3)',
    orangeb: 'rgba(255, 153, 0, 0.3)',
    blueb: 'rgba(0, 0, 255, 0.3)',
  };

  const { shifts, name, color } = data;
  const timesArr = [];
  Object.keys(times).sort((a, b) => {
    if (times[a].tStart < times[b].tStart) {
      return -1;
    } else if (times[a].tStart > times[b].tStart) {
      return 1;
    } else if (times[a].tEnd < times[b].tEnd) {
      return -1;
    } else if (times[a].tEnd > times[b].tEnd) {
      return 1;
    } else if (times[a].bStart < times[b].bStart) {
      return -1;
    } else if (times[a].bStart > times[b].bStart) {
      return 1;
    } else if (times[a].bEnd < times[b].bEnd) {
      return -1;
    } else if (times[a].bEnd > times[b].bEnd) {
      return 1;
    } else if (times[a].bStart2 < times[b].bStart2) {
      return -1;
    } else if (times[a].bStart2 > times[b].bStart2) {
      return 1;
    } else if (times[a].bEnd2 < times[b].bEnd2) {
      return -1;
    } else if (times[a].bEnd2 > times[b].bEnd2) {
      return 1;
    }
    return 0;
  }).forEach((t) => {
    timesArr.push(<option value={t}>S: {`${times[t].tStart}-${times[t].tEnd}`} B1: {`${times[t].bStart}-${times[t].bEnd}`} {times[t].bEnd2 === 8 ? '' : `B2: ${times[t].bStart2}-${times[t].bEnd2}`}</option>);
  });
  return (
    <div>
      <div className={styles.firstCol}>
        {employeePage ? DAYS[dayNum] : name}
        <br />
        {admin ?
          <select
            style={{ maxWidth: '80px' }}
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
      {[...Array(26)].map((h, i) => (
        <div
          className={shifts[weekNum][dayNum] >= 0 &&
            (i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart &&
            (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd ?
            styles.calRow :
            styles.calRowOff}
          style={{
            backgroundColor: shifts[weekNum][dayNum] >= 0 &&
            (i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart &&
            (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd ? 
            (((i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart &&
            (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd) ||
            ((i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart2 &&
            (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd2)) ? COLORS[color + 'b'] : COLORS[color] : '',
          }}
        >
          <span className={styles.cellText}>
            {(shifts[weekNum][dayNum] >= 0) &&
              ((i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart &&
              (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd) &&
              (((i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart &&
              (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd) ||
              ((i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart2 &&
              (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd2)) ?
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
