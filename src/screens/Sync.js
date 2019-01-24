import React, { Component } from 'react';

import * as Api from '../utils/Api'

export default class Sync extends Component {
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
          console.log('Tried to add Upframe Calendar')
          console.log(response2)
          Api.updateUserInfo({
            googleAccessToken: response1.token,
            googleRefreshToken: response1.refreshToken,
            upframeCalendarId: response2.id
          }).then(() => {
            window.location = '/settings'
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

  //Api.getTokens(this.state.code).then((res) => {
    //     if (res.ok === 1) {
    //       //We just synced. 
    //       //DONE-Lets save the token here 
    //       //DONE-and add upframe calendar (we can do both at same time)
    //       //TODO-Add upframe calendar error handling
    //       //DONE-and fetch calendars
    //       window.location = '/settings'

    //       Api.updateUserInfo({
    //         googleAccessToken: res.token,
    //         googleRefreshToken: res.refreshToken,
    //       })

    //       // this.getCalendarList(res.token).then((res) => {
    //       //   let newCalendarsList = res.items.filter((element) => {
    //       //     return !element.id.includes('#holiday@group.v.calendar.google.com') && !element.id.includes('#contacts@group.v.calendar.google.com')
    //       //   }).map((element) => {
    //       //     return {
    //       //       id: element.id,
    //       //       summary: element.summary,
    //       //       checked: false
    //       //     }
    //       //   })
    //       //   this.setState({
    //       //     calendars: newCalendarsList
    //       //   })
    //       // })

    //       this.addUpframeCalendar(res.token).then((res) => {
    //         //TODO - Check if add Upframe Calendar was successful
    //         //if it was save to state
    //         console.log('Tried to add Upframe Calendar')
    //         console.log(res)
    //         window.location = '/settings'
    //       })
    //       // this.setState({
    //       //   code: '',
    //       //   googleAccessToken: res.token
    //       // })
    //     } else {
    //       alert('An error ocurred exchanging code for tokens')
    //     }
    //   })

  render() {
    return (
      <h1>Syncing... You will be redirected shortly</h1>
    )
  }
}