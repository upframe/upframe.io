import React, { Component } from 'react';
import Api from '../utils/Api';
import mixpanel from 'mixpanel-browser';
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

      timeoffset: new Date().getTimezoneOffset()
    }
  }

  grabCoffee = () => {this.setState({currentTab: 2})}
  makeCall = () => {this.setState({currentTab: 3})}
  handleLocationChange = (event) => {this.setState({location: event.target.value})}
  handleMessageChange = (event) => {this.setState({message: event.target.value})}
  handleEmailChange = (event) => {this.setState({email: event.target.value})}
  handleNameChange = (event) => {this.setState({name: event.target.value})}

  createMeetup = () => {
    let {
      location,
      message,
      email,
      name,
      timeoffset
    } = this.state
    let slotId = this.props.sid

    if (this.state.currentTab === 3) {
      //Fazemos call, location is not important
      let talkRoom = 'https://talky.io/' + this.state.mentorName.split(' ').join('').toLowerCase()
      Api.createMeetup(slotId, talkRoom, message, email, name, timeoffset).then((res) => {
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
      })
    } else {
      //É um meetup
      Api.createMeetup(slotId, location, message, email, name, timeoffset).then((res) => {
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
          // window.location = '/'
          mixpanel.track('[Meetup] Meetup w/ ' + this.state.mentorName)
          this.props.hidePopup()
        } else {
          alert('Error creating meetup')
          // window.location = '/'
          this.props.hidePopup()
        }
      })
    }
  }

  clickOutside = (e) => {
    e.stopPropagation()
    this.props.hidePopup()
  }
  
  noPropagation = (e) => {
    e.stopPropagation()
  }

  render() {
    if (this.state.currentTab === 1) {
      return (
        <div className='dim-background' onClick={this.clickOutside}>
          <div className='mentor-meetup-popup flex flex-column' onClick={this.noPropagation}>
            <div className='flex justifycontent-center'>
              <h1 className='fontweight-normal text-center'>Reach out to {this.state.mentorName.split(' ')[0]}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
            </div>
            <span className='hr'></span>
            <div className='meetup-options'>
              <div className='meetup-option' onClick={this.grabCoffee}>
                <img src='/media/coffee.svg' alt='Coffee cup'></img>
                <div>
                  <h1 className='meetup-option-title fontweight-normal'>Grab a coffee</h1>
                  <p>Pick from a selection of {this.state.mentorName}'s favourite cafés and local coworking spaces.</p>
                </div>
              </div>

              <div className='meetup-option' onClick={this.makeCall}>
                <img src='/media/call.svg' alt='Phone'></img>
                <div>
                  <h1 className='meetup-option-title fontweight-normal'>Make a call remotely</h1>
                  <p>Reach out to {this.state.mentorName} from anywhere in the world. A unique link will be generated and sent to your calendar privately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.currentTab === 2) { //Grab a coffe
      return (
        <div className='dim-background' onClick={this.clickOutside}>
          <div id='coffee' className='mentor-meetup-popup flex flex-column' onClick={this.noPropagation}>
            <div className='flex justifycontent-center'>
              <h1 className='fontweight-normal text-center'>Grab a coffee with {this.state.mentorName.split(' ')[0]}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
            </div>
            <span className="hr"></span>
            <div id='meetup-form' className='flex flex-column'>
              <div className='input-group'>
                <label for='location'>Pick a nearby place</label>
                <select id='location' onChange={this.handleLocationChange}>
                  {this.props.locations.map((location, i) => {
                    return (
                      <option key={i} value={location}>{location}</option>
                    )
                  })}
                </select>
              </div>
              <div className='input-group'>
                <label for='message'>Message</label>
                <textarea id='message' name='message' cols='40' rows='3' maxLength='256' placeholder='I have challenge x and I was hoping you could help with y.' value={this.state.message} onChange={this.handleMessageChange}></textarea>
              </div>
              <div className='input-group'>
                <label for='email'>Your email</label>
                <input id='email' type='email' placeholder='Your email' onChange={this.handleEmailChange} />
              </div>
              <div className='input-group'>
                <label for='name'>Your name</label>
                <input id='name' type='text' placeholder='Your name' onChange={this.handleNameChange} />
              </div>
              <button className='btn btn-fill btn-primary right' onClick={this.createMeetup}>Send</button>
            </div>
          </div>
        </div>
      )
    } else if (this.state.currentTab === 3) { //Make a call
      return (
        <div className='dim-background' onClick={this.clickOutside}>
          <div id='call' className='mentor-meetup-popup flex flex-column' onClick={this.noPropagation}>
            <div className='flex justifycontent-center'>
              <h1 className='fontweight-normal text-center'>Make a call with {this.state.mentorName.split(' ')[0]}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
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
              </div>
              <button className='btn btn-fill btn-primary right' onClick={this.createMeetup}>Send</button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}