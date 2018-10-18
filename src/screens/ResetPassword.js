import React, { Component } from 'react';

import * as Api from '../utils/Api'

export default class ResetPassword extends Component {

  constructor (props) {
    super(props)
    this.state = {
      token : window.location.href.split('?token=')[1],
      password : ''
    }
  }

  handlePasswordChange = (event) => {
    this.setState({
      password : event.target.value
    })
  }

  changePassword = () => {
    Api.resetPasswordWithToken(this.state.token, this.state.password).then(res => {
      if (res.ok === 1) {
        alert('Password changed')
      } else {
        alert('Something went wrong')
      }
    })
  }

  render() {
    return (
      <div>
        Welcome to the password change!
        <input type='password' onChange={this.handlePasswordChange}/>
        <button onClick={this.changePassword}>Change Password</button>
      </div>
    );
  }
}