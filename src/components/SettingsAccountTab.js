import React, { Component } from 'react';

import * as Api from '../utils/Api'

export default class SettingsAccountTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email : ''
    }
  }

  componentDidMount() {
    Api.getUserInfo().then((res) => {
      if (res.ok === 1) {
        let newState = {
          email: res.user.email
        }
        this.setState(newState)
      } else {
        alert('An error ocurred')
      }
    })
  }

  changeEmail = () => {
    Api.changeEmail(this.state.email).then((res) => {
      if (res.ok === 1) {
        alert('An email has been sent to you')
      }
    })
  }

  changePassword = () => {
    Api.resetPassword(this.state.email).then((res) => {
      if (res.ok === 1) {
        alert('An email has been sent to you')
      }
    })
  }

  render() {
    return (
      <div className='tab-content'>
        <h1>Email</h1>
        <p>
          Your email address is <a href={'mailto:' + this.state.email}>{this.state.email}</a>. This information will not be publicly displayed
        </p>
        <button onClick={this.changeEmail}>Change Email</button>
        <h1>Password</h1>
        <p>Set a unique password to protect your account</p>
        <button onClick={this.changePassword}>Change Password</button>
      </div>
    );
  }
}