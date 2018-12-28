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

  login = (event) => {
    event.preventDefault()
    Api.login(this.state.email, this.state.password)
      .then((res) => {
        console.log(res)
        if (res.ok === 0) {
          alert('Login errado')
        } else {
          Cookies.setItem('access_token', res.token, Infinity, '/', '.upframe.io', true)
          this.props.setLoggedInState(true)
          console.log(Cookies.getItem('access_token'))
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
        <main>
          <div className='container flex justify-center'>
            <form className='flex flex-column'>
              <div className='field-group'>
                <label htmlFor='email' className='light-gray'>Email</label>
                <input type='email' name='email' onChange={this.handleEmailChange} onKeyUp={this.handleKeyUp} className='light-gray'/>
              </div>
              <div className='field-group'>
                <label htmlFor='password' className='light-gray'>Password</label>
                <input type='password' onChange={this.handlePasswordChange} onKeyUp={this.handleKeyUp} className='light-gray'/>
              </div>
              <button type='submit' className='btn btn-primary center' onClick={this.login}>Login</button>
            </form>
          </div>
        </main>
      );
    }
  }
}