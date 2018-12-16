import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';

import * as Api from '../utils/Api'

export default class SettingsSyncTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleAccessToken: '',
      googleRefreshToken: ''
    }
  }
  
  componentDidMount() {
    Api.getUserInfo().then((res) => {
      let newState = {
        googleAccessToken : res.user.googleAccessToken,
        googleRefreshToken : res.user.googleRefreshToken
      }
      this.setState(newState)
    })
  }

  googleResponse = (e) => {
    if (e.error) {
      alert('Looks like the platform you are using is blocking trackers. Can you add an exception so that we can log you in using Google?')
    } else {
      //Temos em e.accessToken o token de acesso à api da google
      //Agora vamos buscar eventos e display calendar
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.googleAccessToken}</h1>
        <h1> {this.state.googleRefreshToken}</h1>
        <GoogleLogin
          clientId="821697749752-k7h981c73hrji0k96235q2cblsjpkm7t.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.googleResponse}
          onFailure={this.googleResponse}
        />
      </div>
    );
  }
}