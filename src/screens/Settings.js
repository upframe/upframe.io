import React, { Component } from 'react';

import { Redirect } from 'react-router-dom'

export default class Settings extends Component {
  render() {
    if (this.props.loggedIn) {
      return (
        <h1>Sou Settings</h1>
      );
    } else {
      return <Redirect to='/login' />
    }
  }
}