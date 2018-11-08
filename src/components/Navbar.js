import React, { Component } from 'react';

import { Link } from 'react-router-dom'

import * as Cookies from '../utils/Cookies';

export default class Navbar extends Component {

  logout = () => {
    Cookies.removeItem('access_token', '/', '.upframe.io')
    this.props.setLoggedInState(false)
  }

  render() {
    console.log(window.location.pathname )
    if (this.props.loggedIn) {
      return (
        <div>
          <h1>Sou uma navbar</h1>
          <Link to='/settings'>Settings</Link>
          <button onClick={this.logout}>Logout</button>
        </div>
      )
    } else {
      return (
        <div>
          <h1>Sou uma navbar</h1>
          {window.location.pathname === '/login' ? null : <Link to='/login'>Login</Link>}
        </div>
      )
    }
  }
}