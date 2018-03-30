import React from 'react';
import PropTypes from 'prop-types';

import Time from './Time';

export default class TimeList extends React.Component {
  constructor(props) {
    super(props);
    TimeList.propTypes = {
      times: PropTypes.object.isRequired,
      removeTime: PropTypes.func.isRequired,
      addTime: PropTypes.func.isRequired,
    };
    this.state = {
      start: 8,
      end: 8,
      bStart: 8,
      bEnd: 8,
      bStart2: 8,
      bEnd2: 8,
    };
    this.startChange = this.startChange.bind(this);
    this.endChange = this.endChange.bind(this);
    this.bStartChange = this.bStartChange.bind(this);
    this.bEndChange = this.bEndChange.bind(this);
    this.bStart2Change = this.bStart2Change.bind(this);
    this.bEnd2Change = this.bEnd2Change.bind(this);
  }

  startChange(e) {
    this.setState({
      start: e.target.value,
    });
  }

  endChange(e) {
    this.setState({
      end: e.target.value,
    });
  }

  bStartChange(e) {
    this.setState({
      bStart: e.target.value,
    });
  }

  bEndChange(e) {
    this.setState({
      bEnd: e.target.value,
    });
  }

  bStart2Change(e) {
    this.setState({
      bStart2: e.target.value,
    });
  }

  bEnd2Change(e) {
    this.setState({
      bEnd2: e.target.value,
    });
  }


  render() {
    const { times, removeTime, addTime } = this.props;
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
      timesArr.push(<Time
        id={Number(t)}
        data={times[t]}
        removeTime={removeTime}
      />);
    });

    return (
      <div>
        {timesArr}
        <div>
          <select onChange={this.startChange}>
            <option>Shift Start</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          <select onChange={this.endChange}>
            <option>Shift End</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>

          <select onChange={this.bStartChange}>
            <option>Break Start</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          <select onChange={this.bEndChange}>
            <option>Break End</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>

          <select onChange={this.bStart2Change}>
            <option>Break 2 Start</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          <select onChange={this.bEnd2Change}>
            <option>Break 2 End</option>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          <button
            onClick={() => addTime(this.state)}
          >
            Add Time
          </button>
        </div>
      </div>
    );
  }
}

