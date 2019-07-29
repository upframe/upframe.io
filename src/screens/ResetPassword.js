import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Api from '../utils/Api'

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
      <React.Fragment>
        <Helmet>
          <title>Reset your password | Upframe</title>
          <meta property="og:title" content="Reset your password | Upframe"></meta>
          <meta property="og:description" content="Reset your password and keep using Connect by Upframe"></meta>
          <meta property="og:image" content="/android-chrome-192x192.png"></meta>
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Helmet>

        <div className="screen">
          <div>
            <h1 className="font-150 fontweight-medium">Welcome to the password change!</h1>

            <input type='password' placehodler="New password" onChange={this.handlePasswordChange}/>
            <button className="btn btn-primary" onClick={this.changePassword}>Change Password</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}