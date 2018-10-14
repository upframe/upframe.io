import React, { Component } from 'react';

import { Link } from 'react-router-dom'

export default class Navbar extends Component {

  logout = () => {
    this.props.setLoggedInState(false)
  }

  render() {
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
          <Link to='/login'>Login</Link>
        </div>
      )
    }
  }
}