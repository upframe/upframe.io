import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';

export default class SettingsSyncTab extends Component {

  googleResponse = (e) => {
    console.log(e)
  }

  render() {
    return (
      <div>
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