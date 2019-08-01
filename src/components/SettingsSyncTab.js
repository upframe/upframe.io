import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import mixpanel from 'mixpanel-browser';

import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../calendar.css';

import Api from '../utils/Api';
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
        //We have synced in the past
        //DONE - Here we need to fetch the previous known free slots from our DB
        //DONE - After we get them we need to convert them and display them.
        //DONE - At the same time we need to fetch the users calendar list and display that too
        //DONE - save upframe calendar in state
        let googleAccessToken = res.user.googleAccessToken
        this.getCalendarList(res.user.googleAccessToken).then((res) => {
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
            calendars: newCalendarsList,
            googleAccessToken
          })
        })

        let nowDate = new Date()
        let limitDate = moment().add(30, 'days')
        Api.getFreeSlots(nowDate, limitDate).then((res) => {
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
              })
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
      this.setState({
      freeSlotsUnsaved: this.state.freeSlotsUnsaved.filter(slot => slot.id !== event.id)
      })
    } else {

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
        if ((slot.end > allFreeSlots[x].start) && (slot.end < allFreeSlots[x].end)) { //The end in inside another slot
          stop = true
        } else if ((slot.start > allFreeSlots[x].start) && (slot.start < allFreeSlots[x].end)) { //The beginning is inside another slot
          stop = true
        } else if ((slot.end >= allFreeSlots[x].end) && (slot.start <= allFreeSlots[x].start)) { //THis slot contains another one
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
    document.getElementById('save-button').disabled = true
    document.getElementById('save-button').innerHTML = 'Saving...'
    Api.addFreeSlots(this.state.freeSlotsUnsaved, this.state.freeSlotsToDelete).then((res) => {
      if (res.ok === 1) { //We have added new slots and deleted the ones that were saved (not created in this session)
        //Wrong! Because the new saved slots are in incorrect form
        //We need to fetch slots again
        let nowDate = new Date()
        let limitDate = moment().add(30, 'days')
        this.context.showToast('Free slots saved')
        Api.getFreeSlots(nowDate, limitDate).then((res) => {
          document.getElementById('save-button').disabled = false
          document.getElementById('save-button').innerHTML = 'Save changes'
          if (res.ok === 1) {
            this.setState({
              freeSlotsSaved: res.slots.map((unconvertedSlot) => {
                return {
                  mentorUID: unconvertedSlot.mentorUID,
                  recurrency: unconvertedSlot.recurrency,
                  id: unconvertedSlot.sid,
                  start: moment(unconvertedSlot.start),
                  end: moment(unconvertedSlot.end),
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
          mixpanel.track('[Free Slots] ' + this.context.user.name + ' - created free slots')
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
        <div id='settings-synctab'>
          <div id='controls'>
            <h1>Syncronize your google account here</h1>
            <button className='btn btn-secondary' onClick={this.googleSync}>Google Sync</button>
          </div>
          <div id='calendar' className='grid'>
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
            {/* <div className='flex alignitems-center'>
              <button className='btn btn-fill btn-primary' onClick={this.saveFreeSlots}>Save slots</button>
            </div> */}
          </div>
          <div className='fixed-save-changes'>
            <button id='save-button' className='btn btn-fill btn-primary block save-changes' onClick={this.saveFreeSlots}>Save changes</button>
          </div>
        </div>
      )       
    } else {
      return (
        <React.Fragment>
          <div id='settings-synctab'>
            {this.state.calendars ?
              <div id='calendar-list' className='flex'>
                {this.state.calendars.map(element => {
                  return (
                    <div key={element.id} id='calendar-item'>
                      <label key={element.id} htmlFor={element.id}><input key={element.id} type='checkbox' id={element.id} onChange={this.calendarVisibilityChange} defaultChecked={element.checked} />{element.summary}</label>
                    </div>
                  )
                })}
              </div>
            :
              null
            }
            <div id='controls'>
              <button className='btn btn-secondary' onClick={this.unlinkGoogle}>Unlink Google</button>
            </div>
            <div id='calendar' className='grid'>
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
              {/* <div className='flex alignitems-center'>
                <button className='btn btn-fill btn-primary' onClick={this.saveFreeSlots}>Save slots</button>
              </div> */}
            </div>
          </div>
          <div className='fixed-save-changes'>
            <button id='save-button' className='btn btn-fill btn-primary block save-changes' onClick={this.saveFreeSlots}>Save changes</button>
          </div>
        </React.Fragment>
      )
    }
  }
}