import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import styles from '../styles/styles.scss';

const CalenderRow = ({
  times, dayNum, weekNum, data, changeTime, removeShift, id, employeePage,
}) => {
  CalenderRow.propTypes = {
    times: PropTypes.object.isRequired,
    dayNum: PropTypes.number.isRequired,
    weekNum: PropTypes.number.isRequired,
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
    red: 'rgba(255, 69, 0, 1)',
    yellow: 'rgba(255, 215, 0, 1)',
    green: 'rgba(0, 100, 0, 1)',
    orange: 'rgba(255, 140, 0, 1)',
    blue: 'rgba(30, 144, 225, 1)',
    redb: 'rgba(255, 69, 0, 0.3)',
    yellowb: 'rgba(255, 215, 0, 0.3)',
    greenb: 'rgba(0, 100, 0, 0.3)',
    orangeb: 'rgba(255, 140, 0, 0.3)',
    blueb: 'rgba(30, 144, 225, 0.3)',
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
    timesArr.push(<option value={t} key={t}>S: {`${times[t].tStart}-${times[t].tEnd}`} B1: {`${times[t].bStart}-${times[t].bEnd}`} {times[t].bEnd2 === 8 ? '' : `B2: ${times[t].bStart2}-${times[t].bEnd2}`}</option>);
});
  return (
    <div className={styles.fullRow}>
      <div className={styles.firstCol}>
        <span className={styles.employeeName}>{employeePage ? DAYS[dayNum] : name}</span>
        <br />
        <span className={styles.timeSelect}>
          <select
            style={{ maxWidth: '80px' }}
            defaultValue={shifts[weekNum][dayNum]}
            onChange={e => (
            changeTime(id, e.target.options[e.target.selectedIndex].value, dayNum, weekNum)
            )}
          >
            <option />
            {timesArr}
          </select> 
          <Button onClick={() => removeShift(weekNum, dayNum, id)} icon className={styles.removeButton}>
            <Icon size="small" name="delete" color="red"/>
          </Button>
        </span>
        <div className={styles.hoursWorked}>Hrs: {shifts[weekNum][7]}</div>
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
        key={i + "segment" + weekNum + dayNum}
      >
        <span className={styles.cellText} key={i + "span"}>
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
    </div>
    );
};

export default CalenderRow;
