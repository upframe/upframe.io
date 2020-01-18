import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Api from '../utils/Api'

import AppContext from '../components/AppContext'

export default class ChangeEmail extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      token: this.props.match.params.token,
      email: '',
    }
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value,
    })
  }

  changeEmail = () => {
    Api.changeEmailWithToken(this.state.token, this.state.email).then(res => {
      if (res.ok === 1) {
        alert('Email changed')
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
          <title>Change your email | Upframe</title>
          <meta
            property="og:title"
            content="Change your email | Upframe"
          ></meta>
          <meta
            property="og:description"
            content="Change your account email and keep connecting..."
          ></meta>
          <meta property="og:image" content="/media/logo-app-192.png"></meta>
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Helmet>

        <div className="screen">
          Welcome to the email change!
          <input type="email" onChange={this.handleEmailChange} />
          <button className="btn btn-primary" onClick={this.changeEmail}>
            Change Email
          </button>
        </div>
      </React.Fragment>
    )
  }
}
