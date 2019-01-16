import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import * as Api from '../utils/Api'

export default class Navbar extends Component {

  logout = () => {
    Api.logout()
    this.props.setLoggedInState(false)
  }

  render() {
    return (
      <nav>
        <div className="wrapper flex justify-center items-center">
          <Link to="/" id="logo">
            <img src="/logo.svg" alt="" className="logo"></img>
          </Link>
          {this.props.loggedIn ?
            <ul>
              <li><Link to='/settings'>Settings</Link></li>
              <li><button onClick={this.logout}>Logout</button></li>
            </ul>
          :
            // <ul>
            //   {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
            // </ul>
            null
          }
        </div>
      </nav>
    )
  }
}