import React, { Component } from 'react';
import * as Api from '../utils/Api';

export default class Meetup extends Component {

  constructor(props) {
    super(props)

    let meetupId
    if (props.confirm === 0) {
      meetupId = window.location.href.split('/meetup/refuse?meetup=')[1]
    } else {
      meetupId = window.location.href.split('/meetup/confirm?meetup=')[1]
    }

    this.state = { meetupId }
  }

  confirmMeetup = () => {
    Api.confirmMeetup(this.state.meetupId).then((res) => {
      if (res.ok === 0) {
        alert('Could not confirm your meetup, make sure you are logged in')
      } else {
        alert('Meetup confirmed!')
      }
      console.log(res)
    })
  }

  refuseMeetup = () => {
    Api.refuseMeetup(this.state.meetupId).then((res) => {
      if (res.ok === 0) {
        alert('Could not refuse your meetup, make sure you are logged in')
      } else {
        alert('Meetup canceled successfuly!')
      }
      console.log(res)
    })
  }

  render() {
    if (this.props.confirm === 0) {
      return (
        <div>
          <h1>Click here to refuse the meetup</h1>
          <button onClick={this.refuseMeetup}>Refuse</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Click here to confirm the meetup</h1>
          <button onClick={this.confirmMeetup}>Confirm</button>
        </div>
      );
    }
  }
} 