import React, { Component } from 'react';
import * as Api from '../utils/Api';
import mixpanel from 'mixpanel-browser';
/* Neste popup vamos ter dois dialogos, um para escolher
 * um meetup, outro para escolher uma chamada, podemos
 * juntar tudo neste.
 */
export default class MentorRequestPopup extends Component {

  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      message: '',
      time: '10:10',
      date: today.getFullYear() + '-01-01',
      name: '',
      email: '',
    }
  }

  handleMessageChange = (event) => {
    this.setState({
      message: event.target.value
    })
  }

  clickOutside = (e) => {
    e.stopPropagation()
    this.props.hideRequestPopup()
  }
  
  noPropagation = (e) => {
    e.stopPropagation()
  }

  handleDateChange = (e) => {
    this.setState({
      date: e.target.value
    })
  }

  handleTimeChange = (e) => {
    this.setState({
      time: e.target.value
    })
  }

  requestTimeSlot = () => {
    Api.requestTimeSlot(
      window.location.pathname.substring(1),
      this.state.date,
      this.state.time,
      this.state.message,
      this.state.name,
      this.state.email,
    ).then((res) => {
      if (res.ok === 1) {
        mixpanel.track('[Meetup Request] ' + this.state.mentorName)
        alert('Time slots requested. Now wait for mentor confirmation.')
        this.props.hideRequestPopup()
      } else {
        alert('Something failed! Contact our dev team!')
        this.props.hideRequestPopup()
      }
    })
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  render() {
    return (
      <div className='dim-background' onClick={this.clickOutside}>
        <div className='mentor-meetup-popup flex flex-column' onClick={this.noPropagation}>
          <div className='flex justify-center'>
            <h1 className='font-weight-normal text-center'>Request a new slot</h1>
            <span className='close' onClick={this.props.hideRequestPopup}>&#215;</span>
          </div>
          <span className='hr'></span>
          <div>
            <h1>What time are you free?</h1>
            <input type='time' id='time-request' name='time-request' value={this.state.time} onChange={this.handleTimeChange}/>
            <input type='date' id='time-request' name='time-request' value={this.state.date} onChange={this.handleDateChange}/>
            <div className='input-group'>
              <label for='message'>Message</label>
              <textarea id='message' cols='40' rows='3' maxLength='256' placeholder='I have challenge x and I was hoping you could help with y.' value={this.state.message} onChange={this.handleMessageChange}></textarea>
            </div>
            <div className='input-group'>
              <label for='email'>Your email</label>
              <input id='email' type='email' placeholder='Your email' onChange={this.handleEmailChange} />
            </div>
            <div className='input-group'>
              <label for='name'>Your name</label>
              <input id='name' type='text' placeholder='Your name' onChange={this.handleNameChange} />
            </div>
            <button className='btn btn-fill btn-primary right' onClick={this.requestTimeSlot}>Request</button>
          </div>
        </div>
      </div>
    )
  }
}