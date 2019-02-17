import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Segment, Header, Sidebar, Button, Accordion, Menu, Icon, Dropdown, Sticky, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import styles from '../styles/styles.scss';
import appStyle from '../styles/app.scss';
import timeStyle from '../styles/timeCreate.scss';

export default class CreateTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeId: 1,
      time: [],
      dragMode: 'on',
      drag: false,
      dragStart: [],
      dragStop: [],
      preDragTime: [],
    }

    this.stopDrag = this.stopDrag.bind(this);
    this.changeDragMode = this.changeDragMode.bind(this);
    this.saveTime = this.saveTime.bind(this);
  }

  componentWillMount() {
    let timeState = [];
    if (this.state.timeId === null) {
      for (let i = 0; i < 24; i+= 1) {
        timeState[i] = [];
        for(let j = 0; j < 4; j += 1) {
          timeState[i][j] = 'off';
        }
      }
      this.state.time = timeState;
      this.setState({
        time: this.state.time,
      });
    } else {
      fetch(`/time?id=${this.state.timeId}`).then(res => res.json()).then(res => {
        console.log(res);
        const obj = res[0];
        for (let i = 0; i < 24; i+= 1) {
          timeState[i] = [];
          for(let j = 0; j < 4; j += 1) {
            timeState[i][j] = obj[`time${i < 10 ? '0' + i : i}${j}`];
          }
        }
        this.state.time = timeState;
        this.setState({
          time: this.state.time,
        });
      });
    }
  }

  saveTime() {
    if (this.state.timeId === null) {
      fetch('/time/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: this.state.time,
          id: 1 
        })
      }).then(data => data.json()).then(data => {
        this.state.timeId = data.insertId;
      });
    } else {
      fetch('/time', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: this.state.time,
          timeId: this.state.timeId,
        })
      }).then(data => data.json()).then(data => {
        console.log(data);
      });
    }
  }

  changeDragMode() {
    this.setState({
      dragMode: this.state.dragMode === 'on' ? 'off' : this.state.dragMode === 'off' ? 'break' : 'on',
    });
  }

  startDrag(hour, quarter) {
    const time = this.state.time;
    const preDragTime = time.map(t => t.slice());
    time[hour][quarter] = this.state.dragMode;
    this.setState({
      drag: true,
      time,
      dragStart: [hour, quarter],
      dragStop: [hour, quarter],
      preDragTime,
    });
  }

  stopDrag() {
    let { time, drag, dragStart, dragStop, dragMode, preDragTime } = this.state;
    if (this.state.drag) {
      this.updateTime();
    }
    this.setState({
      drag: false,
    });
  }

  drag(hour, quarter) {
    if (this.state.drag) {
      this.setState({
        dragStop: [hour, quarter],
      }, this.updateTime);
    }
  }

  updateTime() {
    let { time, dragStart, dragStop, dragMode, preDragTime } = this.state;
    time = preDragTime.map(t => t.slice());
    if (dragStart[0] < dragStop[0]) {
      for (let j = dragStart[1]; j < 4; j += 1) {
        time[dragStart[0]][j] = dragMode;
      }
      for (let i = dragStart[0] + 1; i < dragStop[0]; i += 1) {
        for (let j = 0; j < 4; j += 1) {
          time[i][j] = dragMode;
        }
      }
      for (let j = 0; j < dragStop[1] + 1; j += 1) {
        time[dragStop[0]][j] = dragMode;
      }
    } else if (dragStart[0] === dragStop[0]) {
      if (dragStart[1] < dragStop[1]) {
        for (let j = dragStart[1];  j < dragStop[1] + 1; j += 1) {
          time[dragStart[0]][j] = dragMode;
        }
      } else {
        for (let j = dragStop[1];  j < dragStart[1] + 1; j += 1) {
          time[dragStop[0]][j] = dragMode;
        }
      }
    } else {
      for (let j = dragStop[1]; j < 4; j += 1) {
        time[dragStop[0]][j] = dragMode;
      }
      for (let i = dragStop[0] + 1; i < dragStart[0]; i += 1) {
        for (let j = 0; j < 4; j += 1) {
          time[i][j] = dragMode;
        }
      }
      for (let j = 0; j < dragStart[1] + 1; j += 1) {
        time[dragStart[0]][j] = dragMode;
      }
      
    }
    this.setState({
      time,
    });
  }

  render() {
    const timeClass = {
      'off': timeStyle.off,
      'on': timeStyle.on,
      'break': timeStyle.break,
    };
    return (
      <div className={appStyle.topContainer} onMouseUp={this.stopDrag}>
        <button onClick={this.changeDragMode}>Change Drag Mode</button>
        <button onClick={this.saveTime}>Save</button>
        <div className={timeStyle.timeBlockContainer} onMouseLeave={this.stopDrag}>
          {this.state.time.map((t, i) => {
            return (
              <div className={timeStyle.timeBlock}>
                {t.map((t, j) => (<div className={[timeStyle.quarterTime, timeClass[t]].join(' ')}
                  onMouseOver={() => this.drag(i, j)}
                  onMouseDown={() => this.startDrag(i, j)}
                >

              </div>))}
            </div>
            )
          })}
        </div>
      </div>
    );
  }
}
