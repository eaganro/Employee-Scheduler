import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import styles from '../styles/styles.scss';

import App from './App';
import Login from './Login';
import CreateTime from './CreateTime';

export default class Routing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
    this.setUserId = this.setUserId.bind(this);
    console.log(window.location);
  }

  setUserId(id) {
    console.log(id)
    this.setState({
      userId: id,
    });
  }

  render() {
    return (
      <Router>
        <div className={styles.topDiv}>
          <Route exact path="/"
            render={() => <CreateTime id={this.state.userId} />}
          />
          <Route path="/home"
            render={() => <App id={this.state.userId} />}
          />
          <Route exact path="/create/time"
            render={() => <Login setUserId={this.setUserId} />}
          />
        </div>
      </Router>
    );
  }
}
