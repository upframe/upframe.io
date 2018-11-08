import React, { Component } from 'react';
// import { GoogleLogin } from 'react-google-login';

export default class SettingsSyncTab extends Component {

  googleResponse = (e) => {
    console.log(e)
  }

  render() {
    return (
      <div>
        <div class="g-signin2" data-onsuccess={this.googleResponse} data-theme="dark"></div>
        {/* <GoogleLogin
          clientId="821697749752-k7h981c73hrji0k96235q2cblsjpkm7t.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.googleResponse}
          onFailure={this.googleResponse}
        /> */}
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </div>
    );
  }
}