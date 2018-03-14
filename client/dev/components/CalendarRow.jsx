import React from 'react';
import styles from '../styles/styles.css';

export default class CalenderRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 'full',
    };
  }


  render() {
    const { shifts, name } = this.props.data;
    const { times, dayNum, weekNum, admin } = this.props;

    const timesArr = [];
    Object.keys(times).forEach((t) => {
      timesArr.push(<option value={t}>{`${times[t].tStart}-${times[t].tEnd}`}</option>);
    });

    return (
      <div>
        <div className={styles.firstCol}>
          {name}
          <br />
          {admin ?
            <select defaultValue={shifts[weekNum][dayNum]} onChange={e => this.props.changeTime(this.props.id, e.target.options[e.target.selectedIndex].value, dayNum, weekNum)}>
              <option />
              {timesArr}
            </select> :
            ''}
            <span style={{ fontSize: '10px' }}>-Hrs:{shifts[weekNum][7]}</span>
        </div>

        {[...Array(24)].map((h, i) => (
          <div className={shifts[weekNum][dayNum] >= 0 && (i / 2) + 8 >= times[shifts[weekNum][dayNum]].tStart && (i / 2) + 8 < times[shifts[weekNum][dayNum]].tEnd ? styles.calRow : styles.calRowOff}>
            {shifts[weekNum][dayNum] >= 0 && (i / 2) + 8 >= times[shifts[weekNum][dayNum]].bStart && (i / 2) + 8 < times[shifts[weekNum][dayNum]].bEnd ? 'B' : ' '}
          </div>
        ))}
        {admin ?
          <button
            className={styles.removeButton}
            onClick={() => this.props.removeShift(weekNum, dayNum, this.props.id)}
          >
            x
          </button> :
          ''}
      </div>
    );
  }
}
