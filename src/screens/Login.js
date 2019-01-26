import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import AppContext from '../components/AppContext'

export default class Login extends Component {

  static contextType = AppContext

  state = {
    email : '',
    password : ''
  }

  handleKeyUp = (e) => { if (e.keyCode === 13) { this.context.login(this.state.email, this.state.password) } }

  handleEmailChange = (e) => { this.setState({ email: e.target.value }) }

  handlePasswordChange = (e) => { this.setState({ password: e.target.value }) }

  login = () => {
    this.context.login(this.state.email, this.state.password)
  }

  render() {
    if (this.context.loggedIn) {
      return <Redirect to='/' />
    } else {
      return (
        <main id='login'>
          <div className='container flex justify-center'>
            <div className='flex flex-column'>
              <div className='field-group'>
                <label for='email'>Email</label>
                <input id='email' type='email' name='email' placeholder='codemonkey@startup.com' onChange={this.handleEmailChange} onKeyUp={this.handleKeyUp}/>
              </div>
              <div className='field-group'>
                <label for='password'>Password</label>
                <input id='password' type='password' placeholder='Nuclear code' onChange={this.handlePasswordChange} onKeyUp={this.handleKeyUp} />
              </div>
              <button type='submit' className='btn btn-primary center' onClick={this.login}>Login</button>
            </div>
          </div>
        </main>
      );
    }
  }
}