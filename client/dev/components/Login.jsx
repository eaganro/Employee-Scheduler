import React from 'react';
import axios from 'axios';
import { Input, Button, Segment, Grid, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import styles from '../styles/styles.scss';

import App from './App';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      signup: false,
      loggedIn: false,
    };
    this.nameChange = this.nameChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.signUp = this.signUp.bind(this);
    this.toSignUp = this.toSignUp.bind(this);
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

  adminLogin() {
    axios.post('/login/admin', {
      username: this.state.username,
      password: this.state.password,
    }).then((data) => {
      console.log(data.data);
      if (data.data.length > 0) {
        this.props.setUserId(data.data[0].id);
        this.setState({
          loggedIn: true,
        });
      }
    });
  }

  signUp() {
    axios.post('/signup', {
      username: this.state.username,
      password: this.state.password,
    }).then((data) => {
      console.log(data);
      this.props.setUserId(data.id);
      this.setState({
        loggedIn: true,
      });
    });
  }

  toSignUp(e) {
    console.log(e.target);
    this.setState({
      signup: e.target.name === 'login',
      username: '',
      password: '',
    });
  }

  render() {
    if (this.state.loggedIn) {
      return <Redirect push to="/create/time" />; 
    }
    return (
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
                placeholder="Username..."
              />
              <Input
                value={this.state.password}
                onChange={this.passChange}
                icon="protect"
                iconPosition="left"
                type="password"
                placeholder="Password..."
              />
              <Button
                primary
                onClick={this.state.signup ? this.signUp : this.adminLogin}
              >
                {this.state.signup ? 'Sign Up' : 'Login'}
              </Button>
            </Segment>
            <Segment compact>
              <Button onClick={this.toSignUp} name={this.state.signup ? 'signup' : 'login'}>
                {this.state.signup ? 'To Login' : 'To Sign Up'}
              </Button>
            </Segment>
          </Segment.Group>
        </Grid.Row>
        <Grid.Row />
      </Grid>
    );
  }
}
