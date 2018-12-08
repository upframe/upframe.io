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
        <nav>
          <div className="wrapper flex justify-center items-center">
            <img className="logo" src="/logo.svg" alt=""></img>
            <ul>
              <li><Link to='/settings'>Settings</Link></li>
              <li><button onClick={this.logout}></button></li>
            </ul>
          </div>
        </nav>
      )
    } else {
      return (
        <nav>
          <div className="wrapper flex justify-center items-center">
            <img className="logo" src="/logo.svg" alt=""></img>
            <ul>
              {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
            </ul>
          </div>
        </nav>
      )
    }
  }
}