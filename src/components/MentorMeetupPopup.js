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
  handleNameChange = (event) => {this.setState({name: event.targe.value})}

  createMeetup = () => {
    window.location = '/'
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
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
          window.location = '/'
        } else {
          alert('Error creating meetup')
          window.location = '/'
        }
      })
    } else {
      //É um meetup
      Api.createMeetup(slotId, location, message, email, name).then((res) => {
        if (res.ok === 1) {
          alert('Meetup created! Now wait for mentor confirmation')
        } else {
          alert('Error creating meetup')
        }
      })
    }
    
  }

  render() {
    if (this.state.currentTab === 1) {
      return (
        <div className='dim-background'>
          <div id='mentor-meetup-popup' className='mentor-meetup-popup'>
            <button onClick={this.props.hidePopup}>Close</button>
            <h1>Reach out to Malik</h1>
            <div onClick={this.grabCoffee}>
              <h1>Grab a coffe</h1>
              <p>Pick from a selection of Malik's favourite cafés and local coworking spaces.</p>
            </div>
            <div onClick={this.makeCall}>
              <h1>Make a call remotely</h1>
              <p>Reach out to Malik from anywhere in the world. A unique link will be generated and sent to your calendar privately.</p>
            </div>
          </div>
        </div>
      );
    } else if (this.state.currentTab === 2) { //Grab a coffe
      return (
        <div className='dim-background'>
          <div id='mentor-meetup-popup' className='mentor-meetup-popup'>
            <button onClick={this.props.hidePopup}>Close</button>
            <h1>Grab a coffee with Malik</h1>
            <p>Pick a nearby place</p>
            <select onChange={this.handleLocationChange}>
              {this.props.locations.map((location) => {
                return (
                  <option value={location}>{location}</option>
                )
              })}
            </select><br/>
            <textarea name="message" cols="40" rows="5" onChange={this.handleMessageChange} value={this.state.message}></textarea><br />
            <input type='email' onChange={this.handleEmailChange} value={this.state.email} /><br />
            <input type='text' onChange={this.handleNameChange} value={this.state.name} /><br />
            <button onClick={this.createMeetup}>Send</button>
          </div>
        </div>
      )
    } else if (this.state.currentTab === 3) { //Make a call
      return (
        <div className='dim-background'>
          <div id='mentor-meetup-popup' className='mentor-meetup-popup'>
            <button onClick={this.props.hidePopup}>Close</button>
            <h1>Make a call with Malik</h1>
            <textarea name="message" cols="40" rows="5" onChange={this.handleMessageChange} value={this.state.message}></textarea><br />
            <input type='email' onChange={this.handleEmailChange} value={this.state.email}/><br />
            <input type='text' onChange={this.handleNameChange} value={this.state.name}/><br />
            <button onClick={this.createMeetup}>Send</button>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}