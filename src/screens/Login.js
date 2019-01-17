import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import * as Api from '../utils/Api';

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
      .then((res) => {
        if (res.ok === 0) {
          alert('Login errado')
        } else {
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
        <main id='login'>
          <div className='container flex justify-center'>
            <div className='flex flex-column'>
              <div className='field-group'>
                <label htmlFor='email' className='light-gray'>Email</label>
                <input type='email' name='email' onChange={this.handleEmailChange} onKeyUp={this.handleKeyUp} className='light-gray'/>
              </div>
              <div className='field-group'>
                <label htmlFor='password' className='light-gray'>Password</label>
                <input type='password' onChange={this.handlePasswordChange} onKeyUp={this.handleKeyUp} className='light-gray'/>
              </div>
              <button type='submit' className='btn btn-primary center' onClick={this.login}>Login</button>
            </div>
          </div>
        </main>
      );
    }
  }
}