import React, { Component } from 'react';

import * as Api from '../utils/Api'

import { Redirect } from 'react-router-dom'

import AppContext from '../components/AppContext'

export default class ResetPassword extends Component {

  static contextType = AppContext

  constructor (props) {
    super(props)
    this.state = {
      token: this.props.match.params.token,
      password : ''
    }
  }

  handlePasswordChange = (event) => {
    this.setState({
      password : event.target.value
    })
  }

  changePassword = () => {
    Api.resetPasswordWithToken(this.state.token, this.state.password).then((res) => {
      if (res.ok === 1) {
        alert('Password changed')
        this.context.logout()
        this.props.history.push('/login')
      } else {
        alert('Something went wrong')
      }
    })
  }

  render() {
    return (
      <div className="screen">
        Welcome to the password change!
        <input type='password' onChange={this.handlePasswordChange}/>
        <button className="btn btn-primary" onClick={this.changePassword}>Change Password</button>
      </div>
    );
  }
}