import React, { Component } from 'react';
import * as Api from '../utils/Api';
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
      message: 'Write a message',

      mentorName: this.props.name,
      slotID: this.props.sid,
      location: this.props.locations[0],
      
      email: '',
      name: ''
    }
  }

  grabCoffee = () => {this.setState({currentTab: 2})}
  makeCall = () => {this.setState({currentTab: 3})}
  handleLocationChange = (event) => {this.setState({location: event.target.value})}
  handleMessageChange = (event) => {this.setState({message: event.target.value})}
  handleEmailChange = (event) => {this.setState({email: event.target.value})}
  handleNameChange = (event) => {this.setState({name: event.target.value})}

  createMeetup = () => {
    // window.location = '/'
    //we need 
    //slot_id
    //keycode
    //location (optional)
    //message
    //email
    let slotId = this.props.sid
    let location = this.state.location
    let message = this.state.message
    let email = this.state.email
    let name = this.state.name
    // console.log('Create meetup')
    // console.log(slotId)
    // console.log(keycode)
    // console.log(location)
    // console.log(message)
    // console.log(email)
    if (this.state.currentTab === 3) {
      //Fazemos call, location is not important
      Api.createMeetup(slotId, '', message, email, name).then((res) => {
        console.log(res)
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
          // window.location = '/'
        } else {
          alert('Error creating meetup')
          // window.location = '/'
        }
      })
    } else {
      //É um meetup
      Api.createMeetup(slotId, location, message, email, name).then((res) => {
        console.log(res)
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
          // window.location = '/'
        } else {
          alert('Error creating meetup')
          // window.location = '/'
        }
      })
    }
    
  }

  render() {
    if (this.state.currentTab === 1) {
      return (
        <div className='dim-background'>
          <div className='mentor-meetup-popup flex flex-column'>
            <div className='flex justify-center'>
              <h1 className='font-weight-normal'>Reach out to {this.state.mentorName}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
            </div>
            <span className='hr'></span>
            <div className='meetup-options'>
              <div className='meetup-option' onClick={this.grabCoffee}>
                <img src='/media/coffee.svg' alt='Coffee cup'></img>
                <div>
                  <h1 className='meetup-option-title font-weight-normal'>Grab a coffe</h1>
                  <p>Pick from a selection of Malik's favourite cafés and local coworking spaces.</p>
                </div>
              </div>

              <div className='meetup-option' onClick={this.makeCall}>
                <img src='/media/call.svg' alt='Phone'></img>
                <div>
                  <h1 className='meetup-option-title font-weight-normal'>Make a call remotely</h1>
                  <p>Reach out to Malik from anywhere in the world. A unique link will be generated and sent to your calendar privately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.currentTab === 2) { //Grab a coffe
      return (
        <div className='dim-background'>
          <div id='coffee' className='mentor-meetup-popup flex flex-column'>
            <div className='flex justify-center'>
              <h1 className='font-weight-normal'>Grab a coffee with {this.state.mentorName}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
            </div>
            <span className="hr"></span>
            <div className="text-center">
              <p>Pick a nearby place</p>
            </div>
            <div id='meetup-form' className='flex flex-column'>
              <select onChange={this.handleLocationChange}>
                {this.props.locations.map((location, i) => {
                  return (
                    <option key={i} value={location}>{location}</option>
                  )
                })}
              </select>
              <textarea name='message' cols='40' rows='5' maxLength='256' value='Notes here' onChange={this.handleMessageChange}></textarea>
              <input type='email' placeholder='Your email' onChange={this.handleEmailChange} />
              <input type='text' placeholder='Your name' onChange={this.handleNameChange} />
              <button className='btn btn-primary center' onClick={this.createMeetup}>Send</button>
            </div>
          </div>
        </div>
      )
    } else if (this.state.currentTab === 3) { //Make a call
      return (
        <div className='dim-background'>
          <div id='call' className='mentor-meetup-popup flex flex-column'>
            <div className='flex justify-center'>
              <h1>Make a call with {this.state.mentorName}</h1>
              <span className='close' onClick={this.props.hidePopup}>&#215;</span>
            </div>
            <span className='hr'></span>
            <div id='meetup-form' className='flex flex-column'>
              <textarea name='message' cols='40' rows='5' maxLength='256' value='Notes here' onChange={this.handleMessageChange}></textarea>
              <input type='email' placeholder='Your email' onChange={this.handleEmailChange} />
              <input type='text' placeholder='Your name' onChange={this.handleNameChange} />
              <button className='btn btn-primary center' onClick={this.createMeetup}>Send</button>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}