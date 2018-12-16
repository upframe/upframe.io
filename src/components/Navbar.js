import React, { Component } from 'react';

import { Link } from 'react-router-dom'

import * as Cookies from '../utils/Cookies';

export default class Navbar extends Component {

  logout = () => {
    Cookies.removeItem('access_token', '/', '.upframe.io')
    this.props.setLoggedInState(false)
  }

  render() {
    return (
      <nav>
        <div className="wrapper flex justify-center items-center">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt=""></img>
          </Link>
          {this.props.loggedIn ?
            <ul>
              <li><Link to='/settings'>Settings</Link></li>
              <li><button onClick={this.logout}></button></li>
            </ul>
          :
            <ul>
              {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
            </ul>
          }
        </div>
      </nav>
    )
  }
}