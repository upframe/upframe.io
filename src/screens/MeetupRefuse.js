import React, { Component } from 'react';
import * as Api from '../utils/Api';

export default class MeetupRefuse extends Component {

  constructor(props) {
    super(props)
    this.state = {
      meetupId: this.props.match.params.meetupid
    }
  }

  refuseMeetup = () => {
    Api.refuseMeetup(this.state.meetupId).then((res) => {
      if (res.ok === 0) {
        alert('Could not refuse your meetup, make sure you are logged in')
      } else {
        alert('Meetup canceled successfuly!')
        window.location = '/settings'
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Click here to refuse the meetup</h1>
        <button onClick={this.refuseMeetup}>Refuse</button>
      </div>
    );
  }
} 