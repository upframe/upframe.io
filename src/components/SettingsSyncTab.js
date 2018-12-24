import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import '../calendar.css';

import * as Api from '../utils/Api'
import * as Calendar from '../utils/Calendar'

const localizer = BigCalendar.momentLocalizer(moment) 

export default class SettingsSyncTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleAccessToken: '',
      calendars: [],
      events: []
    }
    console.log(this.state.events)
  }

  googleSyncSuccess = (e) => {
    //e.accessToken
    this.getCalendarList(e.accessToken).then((res) => {
      //temos em res.item
      //Queremos em cada res.item ir buscar os eventos de cada calendario
      let newCalendarsList = res.items.map((element) => {
        return {
          id: element.id,
          summary: element.summary,
          checked: false
        } 
      })
      this.setState({
        googleAccessToken: e.accessToken,
        calendars: newCalendarsList
      })
    })
  }

  googleSyncFailure = (e) => {
    alert('Looks like the platform you are using is blocking trackers. Can you add an exception so that we can log you in using Google?')
  }

  renderCalendarCheckboxes = (calendars) => {
    calendars.map((element) => {
      return (
        <div>
          <p>{element.id}</p>
          <p>{element.summary}</p>
        </div>
      )
    })
  }

  calendarVisibilityChange = (event) => {
    let newCalendars = this.state.calendars

    newCalendars = this.state.calendars.map((element) => {
      return {
        id: element.id,
        summary: element.summary,
        checked: event.target.id === element.id ? event.target.checked : element.checked
      }
    })

    this.getCalendarEvents(newCalendars).then(data => {
      console.log(data)
      this.setState({
        calendars: newCalendars,
        events: data
      })
    })
  }

  deleteFreeSlot = (event) => {

  }

  addFreeSlot = (event) => {

  }

  getCalendarList (token) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }
    return fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', fetchData).then((res) => res.json())
  }

  async getCalendarEvents (calendarList) {
    let checkedCalendars = calendarList.filter((calendar) => calendar.checked ? calendar : null)
    let calendarIds = checkedCalendars.map((calendar) => calendar.id)
    let calendarPromises = calendarIds.map((calendarId) => this.calendarEvents(calendarId))
    let eventsPromise = Promise.all(calendarPromises).then((done) => {
      let allEvents = []
      done.map((eachRequest) => {
        allEvents = allEvents.concat(eachRequest.items)
        return 0
      })
      return allEvents
    }).then((final) => {
      console.log('antes de converter')
      console.log(final)
      return final.map((element) => this.convertEvents(element))
    })
    return eventsPromise
  }

  calendarEvents = (calendarId) => {
    let customHeaders = new Headers()
    let data = new Date()
    customHeaders.append('Authorization', 'Bearer ' + this.state.googleAccessToken)
    return fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?maxResults=2500&timeMin=' + data.toISOString() + '&singleEvents=true',
      {
        method: 'GET',
        mode: 'cors',
        headers: customHeaders
      }).then((response) => response.json())
      .then((data) => {
        return data
      })
  }

  convertEvents = (element) => {
    if (element.start.dateTime) {
      return {
        id: element.id,
        start: new Date(element.start.dateTime),
        end: new Date(element.end.dateTime),
        title: element.summary
      }
    } else {
      return {
        id: element.id,
        start: moment(element.start.date, 'YYYY-MM-DD').toDate(),
        end: moment(element.end.date, 'YYYY-MM-DD').toDate(),
        title: element.summary
      }
    }
  }

  render() {
    //Ou temos token para ir buscar calendários ou nao temos
    if (this.state.googleAccessToken === '') {
      //Nao temos token, queremos ir busca lo
      return (
        <div>
          <h1>Syncronize your google account here</h1>
          <GoogleLogin
            clientId="821697749752-k7h981c73hrji0k96235q2cblsjpkm7t.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.googleSyncSuccess}
            onFailure={this.googleSyncFailure}
            scope="profile email https://www.googleapis.com/auth/calendar"
          />
        </div>
      )       
    } else {
      //Temos access token! Vamos pegar nos calendários e dar display dos mesmos
      // console.log(this.state.calendars)
      return (
        <div>
          {this.state.calendars.map(element => {
            return (
              <div>
                <label>{element.summary}</label>
                <input type='checkbox' id={element.id} onChange={this.calendarVisibilityChange} defaultChecked={element.checked}/>
              </div>
            )
          })}
          <BigCalendar
            localizer={localizer}
            showMultiDayTimes={true}
            selectable
            defaultDate={new Date()}
            defaultView='week'
            events={this.state.events}
            // onSelectEvent={event => this.deleteFreeSlot(event)}
            // onSelectSlot={slot => this.addFreeSlot(slot)}
          />
        </div>
      )
    }
  }
}