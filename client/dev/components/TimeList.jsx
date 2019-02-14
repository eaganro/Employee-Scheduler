import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Container, Input, Segment, Dropdown, Grid } from 'semantic-ui-react';

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

  startChange(e, data) {
    this.setState({
      start: data.value,
    });
  }

  endChange(e, data) {
    this.setState({
      end: data.value,
    });
  }

  bStartChange(e, data) {
    this.setState({
      bStart: data.value,
    });
  }

  bEndChange(e, data) {
    this.setState({
      bEnd: data.value,
    });
  }

  bStart2Change(e, data) {
    this.setState({
      bStart2: data.value,
    });
  }

  bEnd2Change(e, data) {
    this.setState({
      bEnd2: data.value,
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
        key={t}
      />);
    });

    return (
      <Container>
        {timesArr}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr' }}>
          <div>
            <Dropdown
              text={`Shift Start :  ${this.state.start}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.startChange}
              inline
              scrolling
            />
            <Dropdown
              text={`Shift End :  ${this.state.end}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.endChange}
              inline
              scrolling
            />
            <Dropdown
              text={`Break Start: ${this.state.bStart}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.bStartChange}
              inline
              scrolling
            />
            <Dropdown
              text={`Break End: ${this.state.bEnd}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.bEndChange}
              inline
              scrolling
            />
            <Dropdown
              text={`Break Start: ${this.state.bStart2}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.bStart2Change}
              inline
              scrolling
            />
            <Dropdown
              text={`Break End: ${this.state.bEnd2}`}
              style={{ width: '50%' }}
              options={[...Array(27)].map((x, i) => ({ text: 8 + (i / 2), value: 8 + (i / 2) }))}
              onChange={this.bEnd2Change}
              inline
              scrolling
            />
          </div>
          <Button
            content="Add"
            fluid
            color="green"
            onClick={() => addTime(this.state)}
          />
        </div>
      </Container>
    );
  }
}

