import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from './App';
import Login from './Login';

export default class Routing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
    this.setUserId = this.setUserId.bind(this);
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
        <div>
          <Route exact path="/"
            render={() => <Login setUserId={this.setUserId} />}
          />
          <Route path="/home"
            render={() => <App id={this.state.userId} />}
          />
        </div>
      </Router>
    );
  }
}
