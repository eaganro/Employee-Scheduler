import React from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';

import App from './App'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      empname: '',
      emppass: '',
      empLogin: false,
      signup: false,
      loggedIn: false,
      id: 1,
      admin: false,
      date: null,
      calID: null,
    };
    this.nameChange = this.nameChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.empNameChange = this.empNameChange.bind(this);
    this.empPassChange = this.empPassChange.bind(this);
    this.employeeLogin = this.employeeLogin.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  nameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  passChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  empNameChange(e) {
    this.setState({
      empname: e.target.value,
    });
  }

  empPassChange(e) {
    this.setState({
      emppass: e.target.value,
    });
  }

  employeeLogin() {
    axios.post('/login/employee', {
      username: this.state.username,
      password: this.state.password,
    }).then((data) => {
      if (data.data.length > 0) {
        this.setState({
          loggedIn: true,
          id: data.data[0].id,
          admin: false,
          date: data.data[0].createdate,
        });
      }
    });
  }

  adminLogin() {
    axios.post('/login/admin', {
      username: this.state.username,
      password: this.state.password,
    }).then((data) => {
      console.log(data.data);
      if (data.data.length > 0) {
        this.setState({
          loggedIn: true,
          id: data.data[0].id,
          admin: true,
          date: data.data[0].createdate,
        });
      }
    });
  }

  signUp() {
    axios.post('/signup', {
      username: this.state.username,
      password: this.state.password,
      empname: this.state.empname,
      emppass: this.state.emppass,
    }).then((data) => {
      console.log(data);
      this.setState({
        loggedIn: true,
        id: data.data[0].id,
        admin: true,
        date: data.data[0].createdate,
        calID: data.data[0].calID,
      });
    });
  }

  render() {
    let login;
    if (this.state.empLogin && this.state.signup === false) {
      login = (
        <div>
          Viewer Login: <br />
          Username: <input value={this.state.username} onChange={this.nameChange} type="text" /> <br />
          Password: <input value={this.state.password} onChange={this.passChange} type="password" /> <br />
          <button onClick={this.employeeLogin}>Login</button> <br />
          <button
            onClick={() => this.setState({ empLogin: false, username: '', password: '' })}
          >
            To Admin Login
          </button>
          <br />
          <button
            onClick={() => this.setState({ signup: true, username: '', password: '' })}
          >
            To Admin Signup
          </button>
        </div>
      );
    } else if (this.state.signup === false) {
      login = (
        <div>
          Admin Login: <br />
          <Input
            value={this.state.username}
            onChange={this.nameChange}
            icon="user"
            iconPosition="left"
            placeholder="Admin Username..."
          />
          <Input
            value={this.state.password}
            onChange={this.passChange}
            icon="protect"
            iconPosition="left"
            placeholder="Admin Password..."
          />
          <button onClick={this.adminLogin}>Login</button> <br />
          <button
            onClick={() => this.setState({ empLogin: true, username: '', password: '' })}
          >
            To Viewer Login
          </button>
          <br />
          <button onClick={() => this.setState({ signup: true, username: '', password: '' })}>To Admin Signup</button>
        </div>
      );
    } else {
      login = (
        <div>
          Admin Login: <br />
          Admin Username: <input value={this.state.username} onChange={this.nameChange} type="text" /> <br />
          Admin Password: <input value={this.state.password} onChange={this.passChange} type="password" /> <br />
          Employee Username: <input value={this.state.empname} onChange={this.empNameChange} type="text" /> <br />
          Employee Password: <input value={this.state.emppass} onChange={this.empPassChange} type="password" /> <br />
          <button onClick={this.signUp}>Sign Up</button> <br />
          <button
            onClick={() => this.setState({
              signup: false, empLogin: true, username: '', password: '',
            })}
          >
            To Login
          </button>
        </div>
      );
    }

    return (
      <div>
        {this.state.loggedIn ?
          <App admin={this.state.admin} id={this.state.id} date={this.state.date} cal={this.state.calID} /> :
          login}
      </div>
    );
  }
}
