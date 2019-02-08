import React from 'react';
import axios from 'axios';
import { Input, Button, Segment, Grid, Header } from 'semantic-ui-react';
import styles from '../styles/styles.scss';

import App from './App';

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
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    axios.get('/check').then((data) => {
      console.log(data);
      const { admin, date, id } = data.data;
      this.setState({
        admin,
        id,
        date,
        loggedIn: true,
      });
    }).catch(err => console.log('not logged in'));
  }

  logout() {
    axios.post('/logout', {}).then((data) => {
      this.setState({
        loggedIn: false,
        username: '',
        password: '',
      });
    });
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
        <Grid centered>
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row>
            <Segment.Group raised compact >
              <Segment compact>
                <Input
                  value={this.state.username}
                  onChange={this.nameChange}
                  icon="user"
                  iconPosition="left"
                  placeholder="Employee Username..."
                />
                <Input
                  value={this.state.password}
                  onChange={this.passChange}
                  icon="protect"
                  iconPosition="left"
                  type="password"
                  placeholder="Employee Password..."
                />
                <Button
                  primary
                  onClick={this.employeeLogin}
                >
                  Login
                </Button>
              </Segment>
              <Segment compact>
                <Button.Group>
                  <Button
                    onClick={() => this.setState({ empLogin: false, username: '', password: '' })}
                  >
                    Admin Login
                  </Button>
                  <Button
                    onClick={() => this.setState({ signup: true, username: '', password: '' })}
                  >
                    Admin Signup
                  </Button>
                </Button.Group>
              </Segment>
            </Segment.Group>
          </Grid.Row>
          <Grid.Row />
        </Grid>
      );
    } else if (this.state.signup === false) {
      login = (
        <Grid centered>
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row>
            <Segment.Group raised compact >
              <Segment compact>
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
                  type="password"
                  placeholder="Admin Password..."
                />
                <Button
                  primary
                  onClick={this.adminLogin}
                >
                  Login
                </Button>
              </Segment>
              <Segment compact>
                <Button.Group>
                  <Button
                    onClick={() => this.setState({ empLogin: true, username: '', password: '' })}
                  >
                    Employee Login
                  </Button>
                  <Button
                    onClick={() => this.setState({ signup: true, username: '', password: '' })}
                  >
                    Admin Signup
                  </Button>
                </Button.Group>
              </Segment>
            </Segment.Group>
          </Grid.Row>
          <Grid.Row />
        </Grid>
      );
    } else {
      login = (
        <Grid centered>
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row>
            <Segment.Group raised compact >
              <Segment compact textAlign="left">
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
                  type="password"
                  placeholder="Admin Password..."
                />
                <br />
                <Input
                  value={this.state.empname}
                  onChange={this.empNameChange}
                  icon="user"
                  iconPosition="left"
                  placeholder="Employee Username..."
                />
                <Input
                  value={this.state.emppass}
                  onChange={this.empPassChange}
                  icon="protect"
                  iconPosition="left"
                  type="password"
                  placeholder="Employee Password..."
                />
                <Button
                  primary
                  onClick={this.signUp}
                >
                  Sign Up
                </Button>
              </Segment>
              <Segment compact>
                <Button.Group>
                  <Button
                    onClick={() => this.setState({ signup: false, empLogin: false, username: '', password: '' })}
                  >
                    Admin Login
                  </Button>
                  <Button
                    onClick={() => this.setState({ signup: false, empLogin: true, username: '', password: '' })}
                  >
                    Employee Login
                  </Button>
                </Button.Group>
              </Segment>
            </Segment.Group>
          </Grid.Row>
          <Grid.Row />
        </Grid>
      );
    }

    return (
      <div className={styles.topDiv}>
        {this.state.loggedIn ?
          <App admin={this.state.admin} id={this.state.id} date={this.state.date} cal={this.state.calID} logout={this.logout} /> :
          login}
      </div>
    );
  }
}
