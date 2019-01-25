import React, { Component } from 'react';
import * as Api from '../utils/Api';

export default class MeetupConfirm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      meetupId: this.props.match.params.meetupid
    }
  }

  confirmMeetup = () => {
    Api.confirmMeetup(this.state.meetupId).then((res) => {
      if (res.ok === 0) {
        alert('Could not confirm your meetup, make sure you are logged in')
      } else {
        alert('Meetup confirmed!')
        window.location = '/settings'
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Click here to confirm the meetup</h1>
        <button onClick={this.confirmMeetup}>Confirm</button>
      </div>
    );
  }
} 