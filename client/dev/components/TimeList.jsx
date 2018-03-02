import React from 'react';
import Time from './Time.jsx'

export default class TimeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: 0,
      bStart: 0,
      bEnd: 0,
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
          Shift Start:
          <select onChange={this.startChange}>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          Shift End:
          <select onChange={this.endChange}>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>

          Break Start:
          <select onChange={this.bStartChange}>
            {[...Array(25)].map((x, i) => (
              <option>{8 + (i / 2)}</option>
            ))}
          </select>
          Break End:
          <select onChange={this.bEndChange}>
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
