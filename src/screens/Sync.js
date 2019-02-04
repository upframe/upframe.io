import React, { Component } from 'react';

import AppContext from '../components/AppContext'
import * as Api from '../utils/Api'

export default class Sync extends Component {

  static contextType = AppContext

  constructor (props) {
    super(props)
    this.state = {
      code: window.location.search.split('?code=')[1],
    }
  }

  componentDidMount() {
    Api.getTokens(this.state.code).then((response1) => {
      if (response1.ok === 1) {
        this.addUpframeCalendar(response1.token).then((response2) => {
          //TODO - Check if add Upframe Calendar was successful
          //if it was save to state
          Api.updateUserInfo({
            googleAccessToken: response1.token,
            googleRefreshToken: response1.refreshToken,
            upframeCalendarId: response2.id
          }).then((res) => {
            if (res.ok === 1) {
              let newUser = this.context.user
              newUser.googleAccessToken = response1.token
              newUser.googleRefreshToken = response1.refreshToken
              newUser.upframeCalendarId = response2.id
              this.context.saveUserInfo(newUser)
              this.props.history.push('/settings/sync')
            } else {
              alert('An error has ocurred')
            }
          })
        })
      }
    })
  }

  addUpframeCalendar = (token) => { //TODO - Move to API
    let body = {
      'summary': 'Upframe Calendar'
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }
    return fetch('https://www.googleapis.com/calendar/v3/calendars', fetchData).then((res) => res.json())
  }

  render() {
    return (
      <React.Fragment>
        <h1>Syncing... You will be redirected shortly</h1>
        <div className="center-container">
          <div className="loader"></div>
        </div>
      </React.Fragment>
    )
  }
}