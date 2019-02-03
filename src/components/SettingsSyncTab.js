import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';

// React big calendar CSS
import 'react-big-calendar/lib/css/react-big-calendar.css'
// Our custom Calendar CSS
import '../calendar.css';

import * as Api from '../utils/Api';
import AppContext from './AppContext'

const localizer = BigCalendar.momentLocalizer(moment) 

export default class SettingsSyncTab extends Component {

  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      googleAccessToken: '',
      calendars: [{
        summary: '',
        id: '',
        checked: false
      }],
      events: [],
      freeSlotsUnsaved: [],
      freeSlotsSaved: [],
      freeSlotsToDelete: [],
      currId: 0,
      upframeCalendarId: ''
    }
  }

  //TODO - delete automatically calendar
  unlinkGoogle = () => {
    Api.updateUserInfo({
      googleAccessToken: '',
      googleRefreshToken: '',
      upframeCalendarId: ''
    }).then(() => {
      this.setState({
        googleAccessToken: '',
        calendars: [{
          summary: '',
          id: '',
          checked: false
        }],
        upframeCalendarId: ''
      })
    })
  }

  //Are we not synced at all
  //Have we synced and we need to fetch access token
  //Or have we already synced in the past
  componentDidMount() { 
    Api.getUserInfo().then((res) => {
      if (res.user.googleAccessToken !== '') {
        console.log('Tem access token')
        //We have synced in the past
        //DONE - Here we need to fetch the previous known free slots from our DB
        //DONE - After we get them we need to convert them and display them.
        //DONE - At the same time we need to fetch the users calendar list and display that too
        //DONE - save upframe calendar in state
        let googleAccessToken = res.user.googleAccessToken
        this.getCalendarList(res.user.googleAccessToken).then((res) => {
          console.log('Recebemos calendar list')
          let newCalendarsList = res.items.filter((element) => {
            return !element.id.includes('#holiday@group.v.calendar.google.com') && !element.id.includes('#contacts@group.v.calendar.google.com')
          }).map((element) => {
            return {
              id: element.id,
              summary: element.summary,
              checked: false
            }
          })
          this.setState({
            calendars: newCalendarsList
          })
        })

        let nowDate = new Date()
        let limitDate = moment().add(30, 'days')
        Api.getFreeSlots(nowDate, limitDate).then((res) => {
          console.log('Recebemos free slots')
          if (res.ok === 1) {
            this.setState({
              freeSlotsSaved: res.slots.map((unconvertedSlot) => {
                return {
                  mentorUID: unconvertedSlot.mentorUID,
                  recurrency: unconvertedSlot.recurrency,
                  id: unconvertedSlot.sid,
                  start: new Date(unconvertedSlot.start),
                  end: new Date(unconvertedSlot.end),
                  isMine: true
                }
              }),
              googleAccessToken: googleAccessToken
            })
          }
        })
      }
    })
  }

  googleSync = () => {
    Api.getGoogleSyncUrl().then((res) => {
      window.location = res.url
    })
  }

  calendarVisibilityChange = (event) => { //After displaying the calendars we want to show their visibility according to checks
    let newCalendars = this.state.calendars
    newCalendars = this.state.calendars.map((element) => { //Here we find which calendar got checked
      return {
        id: element.id,
        summary: element.summary,
        checked: event.target.id === element.id ? event.target.checked : element.checked
      }
    })
    this.getCalendarEvents(newCalendars).then(data => { //Here we fetch the events for all the checked calendars
      this.setState({
        calendars: newCalendars,
        events: data
      })
    })
  }

  /* Whenever someone clicks on an event in the calendar we will get this function.
   * People can only delete events that are from Upframe. If the event was added 
   * and it wasn't saved then all we have to do is remove it from freeSlotsUnsaved.
   * If the event was added on a previous session then we need to ask our DB to
   * delete it.
   */
  deleteFreeSlot = (event) => {
    let isUnsavedFreeSlot = this.state.freeSlotsUnsaved.some(slot => slot.id === event.id)
    if (isUnsavedFreeSlot) {
      //Simple, we just remove it from the array
      this.setState({
        freeSlotsUnsaved: this.state.freeSlotsUnsaved.filter(slot => slot.id !== event.id)
      })
    } else {
      //This free slots is saved on our DB. We gotta send a delete request.
      //Lets add it to the delete pile.
      //We want to remove it from the freeSlotsSaved and add it to freeSlotsToDelete
      //queremos remover event.id

      let newFreeSlotsSaved = []
      let newFreeSlotsToDelete = this.state.freeSlotsToDelete
      this.state.freeSlotsSaved.forEach(slot => {
        if (slot.id === event.id) { //evento para remover adicionamos ao delete
          newFreeSlotsToDelete.push(slot)
        } else { //outro evento, deixamos estar
          newFreeSlotsSaved.push(slot)
        }
      })

      this.setState({
        freeSlotsSaved: newFreeSlotsSaved,
        freeSlotsToDelete: newFreeSlotsToDelete
      })
    }
  }

  addFreeSlot = (slot) => {
    //We need to check if there are no overlaps and if we are not adding a slot to the past.
    let today = new Date()
    let stop = false
    if (slot.start < today) { //Cant add slots in the past
      stop = true
    }

    if (!stop) {
      //Extra tests of overlap
      let allFreeSlots = [...this.state.freeSlotsUnsaved, ...this.state.freeSlotsSaved]
      let leng = allFreeSlots.length
      for (let x = 0; x < leng && !stop; x++) {
        if ((slot.end > allFreeSlots[x].start) && (slot.end < allFreeSlots[x].end)) {
          stop = true
        } else if ((slot.start > allFreeSlots[x].start) && (slot.start < allFreeSlots[x].end)) {
          stop = true
        }
      }
    }

    if (stop) {
      alert('You can\'t add a free there!')
    } else {
      let currentId = this.state.currId
      let newFreeSlots = this.state.freeSlotsUnsaved
      newFreeSlots.push({
        id: currentId + 1,
        start: slot.start,
        end: slot.end,
        title: 'Upframe Free Slot',
        tag: 'upframe-free-slot',
        isMine: true,
      })
      this.setState({
        currId: currentId + 1,
        freeSlotsUnsaved: newFreeSlots
      }) 
    }
  }

  getCalendarList = (token) => {
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

  getCalendarEvents = (calendarList) => {
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
      return final.map((element) => this.convertEvents(element))
    })
    return eventsPromise
  }

  calendarEvents = (calendarId) => { //TODO - Move to API
    let customHeaders = new Headers()
    let data = new Date()
    let dataLimite = moment().add(30, 'days')
    customHeaders.append('Authorization', 'Bearer ' + this.state.googleAccessToken)
    return fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?maxResults=2500&timeMin=' + data.toISOString() + '&timeMax=' + dataLimite.toISOString() + '&singleEvents=true',
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

  /* There is a lot of stuff to do here. First we want to delete the slots
   * that were saved in our DB and the user deleted now (they are in
   * freeSlotsToDelete). We also want to save the freeSlotsUnsaved. So 
   * we need to call our API request.
   * After this is done we want to clear the delete list because and
   * we want to merge our unsaved slots into the saved pile since
   * we already sent that to our backend.
   */
  saveFreeSlots = () => { 
    //1. Delete toDelete + Save unsaved
    //2. clear to Delete
    //3. merge unsaved into saved
    Api.addFreeSlots(this.state.freeSlotsUnsaved, this.state.freeSlotsToDelete).then((res) => {
      console.log(res)
      if (res.ok === 1) { //We have added new slots and deleted the ones that were saved (not created in this session)
        //Wrong! Because the new saved slots are in incorrect form
        //We need to fetch slots again
        let nowDate = new Date()
        let limitDate = moment().add(30, 'days')
        Api.getFreeSlots(nowDate, limitDate).then((res) => {
          console.log(res)
          if (res.ok === 1) {
            this.setState({
              freeSlotsSaved: res.slots.map((unconvertedSlot) => {
                return {
                  mentorUID: unconvertedSlot.mentorUID,
                  recurrency: unconvertedSlot.recurrency,
                  id: unconvertedSlot.sid,
                  start: new Date(unconvertedSlot.start),
                  end: new Date(unconvertedSlot.end),
                  isMine: true,
                }
              }),
              freeSlotsToDelete: [],
              freeSlotsUnsaved: []
            })
          } else {
            //Free slots saved but we couldnt fetch them all again
            if (res.ok === 0 && res.code === 404) {
              //All slots deleted
              this.setState({
                freeSlotsSaved: [],
                freeSlotsToDelete: [],
                freeSlotsUnsaved: []
              })
            }
          }
        }, () => {
          alert('Free slots saved')
        })
      } else {
        //An eror ocurred
        alert('We could not save the changes... Try again in a few minutes')
      }
    })
  }

  render() {
    //Ou temos token para ir buscar calendários ou nao temos
    if (this.state.googleAccessToken === '') {
      //Nao temos token, queremos ir busca lo
      return (
        <div id='settings-synctab' className='tab center'>
          <div id='controls'>
            <h1>Syncronize your google account here</h1>
            <button className='btn btn-secondary' onClick={this.googleSync}>Google Sync</button>
            <button className='btn btn-fill btn-primary' onClick={this.saveFreeSlots}>Save slots</button>
          </div>
          <BigCalendar
            localizer={localizer}
            showMultiDayTimes={true}
            selectable
            defaultDate={new Date()}
            defaultView='week'
            events={[...this.state.events, ...this.state.freeSlotsSaved, ...this.state.freeSlotsUnsaved]}
            onSelectEvent={event => this.deleteFreeSlot(event)}
            onSelectSlot={slot => this.addFreeSlot(slot)}
          />
        </div>
      )       
    } else {
      return (
        <div id='settings-synctab' className='tab center'>
          {this.state.calendars ?
            <div id='calendar-list' className='grid'>
              {this.state.calendars.map(element => {
                return (
                  <div id='calendar-item'>
                    <label for={element.id}><input type='checkbox' id={element.id} onChange={this.calendarVisibilityChange} defaultChecked={element.checked} />{element.summary}</label>
                  </div>
                )
              })}
            </div>
          :
            null
          }
          <div id='controls'>
            <button className='btn btn-secondary' onClick={this.unlinkGoogle}>Unlink Google</button>
            <button className='btn btn-fill btn-primary' onClick={this.saveFreeSlots}>Save slots</button>
          </div>
          <BigCalendar
            localizer={localizer}
            showMultiDayTimes={true}
            selectable
            defaultDate={new Date()}
            defaultView='week'
            events={[...this.state.events, ...this.state.freeSlotsSaved, ...this.state.freeSlotsUnsaved]}
            onSelectEvent={event => this.deleteFreeSlot(event)}
            onSelectSlot={slot => this.addFreeSlot(slot)}
            eventPropGetter={(event, start, end, isSelected) => {
              let newStyle = {
                backgroundColor: '#2b3778',
                borderColor: '#2b3778',
                color: 'white',
              };

              if (event.isMine) {
                newStyle.backgroundColor = '#ff004b'
                newStyle.borderColor = '#ff004b'
              }

              return {
                className: "",
                style: newStyle
              };
            }}
          />
        </div>
      )
    }
  }
}