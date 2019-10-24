import React, { Component } from 'react'
import Api from '../utils/Api'
import mixpanel from 'mixpanel-browser'

import AppContext from '../components/AppContext'

export default class MeetupConfirm extends Component {
  static contextType = AppContext

  componentDidMount() {
    Api.confirmMeetup(this.props.match.params.meetupid).then(res => {
      console.log(res)
      if (res.ok === 0) {
        alert('Could not confirm your meetup, make sure you are logged in')
      } else {
        if (this.props.match.params.meetupid.charAt(0) === 't') {
          mixpanel.track('[' + this.context.user.name + '] - Confirmed talk')
        } else {
          mixpanel.track('[' + this.context.user.name + '] - Confirmed meetup')
        }
        alert('Meetup confirmed!')
        window.location = '/settings'
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Confirming...</h1>
      </div>
    )
  }
}
