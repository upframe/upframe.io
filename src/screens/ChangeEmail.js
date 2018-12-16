import React, { Component } from 'react';

import * as Api from '../utils/Api'

import { Redirect } from 'react-router-dom'

export default class ChangeEmail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      token : window.location.href.split('?token=')[1],
      email : ''
    }
  }

  handleEmailChange = (event) => {
    this.setState({
      email : event.target.value
    })
  }

  changeEmail = () => {
    Api.changeEmailWithToken(this.state.token, this.state.email).then((res) => {
      if (res.ok === 1) {
        return <Redirect to='/login' />
      } else {
        alert('Something went wrong')
      }
    })
  }

  render() {
    return (
      <div>
        Welcome to the email change!
        <input type='email' onChange={this.handleEmailChange}/>
        <button onClick={this.changeEmail}>Change Email</button>
      </div>
    );
  }
}