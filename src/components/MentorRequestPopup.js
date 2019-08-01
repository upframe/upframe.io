import React, { Component } from 'react';
import Api from '../utils/Api';
import mixpanel from 'mixpanel-browser';
/* Neste popup vamos ter dois dialogos, um para escolher
 * um meetup, outro para escolher uma chamada, podemos
 * juntar tudo neste.
 */
export default class MentorRequestPopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      name: '',
      email: '',
      timeoffset: new Date().getTimezoneOffset()
    }
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

  requestTimeSlot = () => {
    Api.requestTimeSlot(
      window.location.pathname.substring(1),
      this.state.email,
      this.state.name,
      this.state.message,
      this.state.timeoffset
    ).then((res) => {
      if (res.ok === 1) {
        mixpanel.track('[Meetup Request] ' + this.state.name + ' w/ ' + this.state.email)
        alert('Time slots requested. Now wait for mentor confirmation.')
        this.props.hideRequestPopup()
      } else {
        alert('Something failed! Contact our dev team!')
        this.props.hideRequestPopup()
      }
    })
  }

  render() {
    return (
      <div className='dim-background' onClick={this.clickOutside}>
        <div className='mentor-meetup-popup flex flex-column' onClick={this.noPropagation}>
          <div className='flex justifycontent-center'>
            <h1 className='fontweight-normal text-center'>Request a new slot</h1>
            <span className='close' onClick={this.props.hideRequestPopup}>&#215;</span>
          </div>
          <span className='hr'></span>
          <div id='meetup-form' className='flex flex-column'>
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
            </div><br />
            <button className='btn btn-fill btn-primary right' onClick={this.requestTimeSlot}>Request</button>
          </div>
        </div>
      </div>
    )
  }
}
