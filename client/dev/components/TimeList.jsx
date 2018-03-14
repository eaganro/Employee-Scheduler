import React from 'react';
import Time from './Time.jsx'

export default class TimeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 8,
      end: 8,
      bStart: 8,
      bEnd: 8,
    };
    this.startChange = this.startChange.bind(this);
    this.endChange = this.endChange.bind(this);
    this.bStartChange = this.bStartChange.bind(this);
    this.bEndChange = this.bEndChange.bind(this);
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


  render() {
    const { times } = this.props;
    const timesArr = [];
    Object.keys(times).forEach((t) => {
      timesArr.push(<Time
        id={t}
        data={times[t]}
        removeTime={this.props.removeTime}
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
          <button
            onClick={() => this.props.addTime(this.state)}
          >
            Add Time
          </button>
        </div>
      </div>
    );
  }
}
