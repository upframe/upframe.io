import React, { Component } from 'react'

import mixpanel from 'mixpanel-browser'

import Api from '../utils/Api'
/* Neste popup vamos ter dois dialogos, um para escolher
 * um meetup, outro para escolher uma chamada, podemos
 * juntar tudo neste.
 */
export default class MentorMeetupPopup extends Component {
  //Props>
  //show -> 0 or 1
  //hidePopup -> func to hide me
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 1,
      message: '',

      mentorName: this.props.name,
      slotID: this.props.sid,
      location: this.props.locations[0],

      email: '',
      name: '',

      timeoffset: new Date().getTimezoneOffset(),
    }
  }

  handleLocationChange = event => {
    this.setState({ location: event.target.value })
  }
  handleMessageChange = event => {
    this.setState({ message: event.target.value })
  }
  handleEmailChange = event => {
    this.setState({ email: event.target.value })
  }
  handleNameChange = event => {
    this.setState({ name: event.target.value })
  }

  createMeetup = () => {
    let { message, email, name, timeoffset } = this.state
    let slotId = this.props.sid

    //Fazemos call, location is not important
    let talkRoom =
      'https://talky.io/' +
      this.state.mentorName
        .split(' ')
        .join('')
        .toLowerCase()
    Api.createMeetup(slotId, talkRoom, message, email, name, timeoffset).then(
      res => {
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
          // window.location = '/'
          mixpanel.track('[Meetup] Talk w/ ' + this.state.mentorName)
          this.props.hidePopup()
        } else {
          alert('Error creating meetup')
          this.props.hidePopup()
          // window.location = '/'
        }
      }
    )
  }

  clickOutside = e => {
    e.stopPropagation()
    this.props.hidePopup()
  }

  noPropagation = e => {
    e.stopPropagation()
  }

  render() {
    return (
      <div className="dim-background" onClick={this.clickOutside}>
        <div
          id="call"
          className="mentor-meetup-popup flex flex-column"
          onClick={this.noPropagation}
        >
          <div className="flex justifycontent-center">
            <h1 className="fontweight-normal text-center">
              Make a call with {this.state.mentorName.split(' ')[0]}
            </h1>
            <span className="close" onClick={this.props.hidePopup}>
              &#215;
            </span>
          </div>
          <span className="hr"></span>
          <div id="meetup-form" className="flex flex-column">
            <div className="input-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                cols="40"
                rows="3"
                maxLength="256"
                placeholder="I have challenge x and I was hoping you could help with y."
                value={this.state.message}
                onChange={this.handleMessageChange}
              ></textarea>
            </div>
            <div className="input-group">
              <label for="email">Your email</label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                onChange={this.handleEmailChange}
              />
            </div>
            <div className="input-group">
              <label for="name">Your name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                onChange={this.handleNameChange}
              />
            </div>
            <button
              className="btn btn-fill btn-primary right"
              onClick={this.createMeetup}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}
