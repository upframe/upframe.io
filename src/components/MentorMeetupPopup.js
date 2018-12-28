import React, { Component } from 'react';

/* Neste popup vamos ter dois dialogos, um para escolher
 * um meetup, outro para escolher uma chamada, podemos
 * juntar tudo neste.
 */
export default class MentorMeetupPopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentTab: props.mentorExists
    }
  }

  grabCoffee = () => {
    this.setState({
      currentTab: 2
    })
  }

  makeCall = () => {
    this.setState({
      currentTab: 3
    })
  }

  render() {
    if (this.state.currentTab === 1) {
      return (
        <div>
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
      );
    } else if (this.state.currentTab === 2) { //Grab a coffe
      return (
        <div>
          <h1>Grab a coffee with Malik</h1>
          <p>Pick a nearby place</p>
          <p>Message</p>

        </div>
      )
    } else if (this.state.currentTab === 3) { //Make a call
      return (
        <div>
          <h1>Make a call with Malik</h1>
          <p>Message</p>

        </div>
      )
    } else {
      return (
        <div>
          
        </div>
      )
    }
  }
}