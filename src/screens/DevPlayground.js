import React, { Component } from 'react';

import * as Api from '../utils/Api'

export default class DevPLayground extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: 'ulisses@upframe.io',
      input2: 'hello',
      input3: 'potato'
    }
  }

  login = () => {
    Api.login(this.state.input, this.state.input2).then(res => {
      console.log(res)
    })
  }

  register = () => {
    Api.register(this.state.input, this.state.input2, this.state.input2).then(res => {
      console.log(res)
    })
  }

  forgotPass = () => {
    Api.resetPassword(this.state.input).then(res => {
      console.log(res)
    })
  }

  changeEmail = () => {
    Api.changeEmail(this.state.input).then(res => {
      console.log(res)
    })
  }

  forgotPassTokenFinal = () => {
    Api.resetPasswordWithToken(this.state.input, this.state.input2).then(res => {
      console.log(res)
    })
  }

  changeEmailTokenFinal = () => {
    Api.changeEmailWithToken(this.state.input, this.state.input2).then(res => {
      console.log(res)
    })
  }

  mentorVerify = () => {
    Api.verifyKeycode(this.state.input).then(res => {
      console.log(res)
    })
  }

  mentorVerify2 = () => {
    Api.verifyUniqueId(this.state.input).then(res => {
      console.log(res)
    })
  }

  getRandomMentor = () => {
    Api.getRandomMentors().then(res => {
      console.log(res)
    })
  }

  getMentorKeycode = () => {
    Api.getMentorInfo(this.state.input).then(res => {
      console.log(res)
    })
  }

  postMeetup = () => {
    Api.createMeetup(this.state.input, this.state.input2, this.state.input3).then(res => {
      console.log(res)
    })
  }

  getMeetup = () => {
    Api.getMeetups().then(res => {
      console.log(res)
    })
  }

  getMeetupConfirm = () => {
    Api.confirmMeetup(this.state.input).then(res => {
      console.log(res)
    })
  }

  getMeProfile = () => {
    Api.getUserInfo().then(res => {
      console.log(res)
    })
  }

  patchMeProfile = () => {
    Api.updateUserInfo({
      name: 'Info to update'
    }).then(res => {
      console.log(res)
    })
  }

  // postMeProfile = () => {
  //   Api.confirmMeetup(this.state.input).then(res => {
  //     console.log(res)
  //   })
  // }

  getQuickSeach = () => {
    Api.searchQuick(this.state.input).then(res => {
      console.log(res)
    })
  }

  getFullSearch = () => {
    Api.searchFull(this.state.input).then(res => {
      console.log(res)
    })
  }

  getSearchTags = () => {
    Api.getSearchTags().then(res => {
      console.log(res)
    })
  }

  handleInputChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  handleInput2Change = (event) => {
    this.setState({
      input2: event.target.value
    })
  }

  handleInput3Change = (event) => {
    this.setState({
      input3: event.target.value
    })
  }

  render() {
    return (
      <div>
        Here we can test dev stuff
        <input type='text' onChange={this.handleInputChange} value={this.state.input} />
        <input type='text' onChange={this.handleInput2Change} value={this.state.input2} />
        <input type='text' onChange={this.handleInput3Change} value={this.state.input3} />
        <button onClick={this.login}>Login</button>
        <button onClick={this.register}>Register</button>
        <button onClick={this.forgotPass}>ForgotPass</button>
        <button onClick={this.changeEmail}>ChangeMyEmail</button>
        <button onClick={this.forgotPassTokenFinal}>ForgotPassTokenFinal</button>
        <button onClick={this.changeEmailTokenFinal}>ChangeMyEmailTokenFInal</button>
        <button onClick={this.mentorVerify}>MentorVerify</button>
        <button onClick={this.mentorVerify2}>MentorVerify2</button>
        <button onClick={this.getRandomMentor}>GetMentorRandom</button>
        <button onClick={this.getMentorKeycode}>GetMentorInfo by Keycode</button>
        <button onClick={this.postMeetup}>POST meetup</button>
        <button onClick={this.getMeetup}>GET meetup</button>
        <button onClick={this.getMeetupConfirm}>GET meetup confirm</button>
        <button onClick={this.getMeProfile}>GET profile me</button>
        <button onClick={this.patchMeProfile}>Patch profile me</button>
        <button onClick={this.postMeProfile}>Post profile image</button>
        <button onClick={this.getQuickSeach}>GET seach quick</button>
        <button onClick={this.getFullSearch}>GET seach full</button>
        <button onClick={this.getSearchTags}>GET seach tags</button>
      </div>
    );
  }
}