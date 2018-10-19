import React, { Component } from 'react';

import * as Api from '../utils/Api'

export default class DevPLayground extends Component {

  login = () => {
    Api.login('hello@example.com', 'hello').then(res => {
      console.log(res)
      //Do stuff
    })
  }

  render() {
    return (
      <div>
        Here we can test dev stuff
        <button onClick={this.login}>Login</button>
        <button>Register</button>
        <button>ForgotPass</button>
        <button>ChangeMyEmail</button>
        <button>ForgotPassTokenFinal</button>
        <button>ChangeMyEmailTokenFInal</button>
        <button>MentorVerify</button>
        <button>MentorVerify2</button>
        <button>GetMentorRandom</button>
        <button>GetMentorKeycode</button>
        <button>POST meetup</button>
        <button>GET meetup</button>
        <button>GET meetup confirm</button>
        <button>GET profile me</button>
        <button>Patch profile me</button>
        <button>Post profile image</button>
        <button>GET seach quick</button>
        <button>GET seach full</button>
        <button>GET seach tags</button>
      </div>
    );
  }
}