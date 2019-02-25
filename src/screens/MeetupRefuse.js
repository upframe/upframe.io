import React, { Component } from 'react';
import * as Api from '../utils/Api';

export default class MeetupRefuse extends Component {

  constructor(props) {
    super(props)
    Api.refuseMeetup(this.props.match.params.meetupid).then((res) => {
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
        <h1>Refusing...</h1>
      </div>
    );
  }
} 