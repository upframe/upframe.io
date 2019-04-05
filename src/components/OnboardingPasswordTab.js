import React, { Component } from 'react';
import Api from '../utils/Api';

export default class OnboardingPasswordTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newPassword : '',
      confirmPassword: ''
    }
  }

  handleNewPassword = (event) => {this.setState({ newPassword : event.target.value })}

  handleConfirmPasswordChange = (event) => {this.setState({ confirmPassword: event.target.value }) }

  finishOnboarding = () => {
    if (this.state.newPassword === this.state.confirmPassword) {
      console.log('Finishing onboard')
      console.log(this.props.email)
      console.log(this.state.confirmPassword) 
      console.log(this.props.name)
      Api.register(this.props.data.email, this.state.confirmPassword, this.props.data.name).then((res) => {
        if (res.ok === 1) {
          this.props.next()
        } else {
          console.log(res)
        }
      })
    } else {
      alert('The passwords do not match')
    }
  }

  render() {
    return (
      <div>
        <p>Insert New Password</p>
        <input type='password' onChange={this.handleNewPassword} value={this.state.newPassword} />
        <p>Confirm Password</p>
        <input type='password' onChange={this.handleConfirmPasswordChange} value={this.state.confirmPassword} />
        <button onClick={this.finishOnboarding}>Save</button>
      </div>
    );
  }
}