import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import * as Api from '../utils/Api';
import * as Cookies from '../utils/Cookies';

export default class Login extends Component {

  constructor (props) {
    super(props) 
    this.state = {
      email : '',
      password : ''
    }
  }

  login = () => {
    
    Api.login(this.state.email, this.state.password)
      .then(res => {
        if (res.ok === 0) {
          alert('Login errado')
        } else {
          Cookies.setItem('access_token', res.token, Infinity)
          this.props.setLoggedInState(true)
        }
      })
  }

  handleKeyUp = (e) => { if (e.keyCode === 13) { this.login() } }

  handleEmailChange = (e) => { this.setState({ email: e.target.value }) }

  handlePasswordChange = (e) => { this.setState({ password: e.target.value }) }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to='/' />
    } else {
      return (
        <div>
          <h1>Sou um Login</h1>
          <p>Email</p>
          <input type='email' onChange={this.handleEmailChange} onKeyUp={this.handleKeyUp} />
          <p>Password</p>
          <input type='password' onChange={this.handlePasswordChange} onKeyUp={this.handleKeyUp} />
          <button onClick={this.login}>Login</button>
        </div>
      );
    }
  }
}