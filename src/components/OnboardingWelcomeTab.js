import React, { Component } from 'react'
import Api from '../utils/Api'

export default class OnboardingWelcomeTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keycode: window.location.pathname.split('/')[1],
      name: '',
      uniqueid: '',
      email: '',
    }
  }

  componentDidMount() {
    Api.verifyKeycode(this.state.keycode).then(res => {
      this.setState({
        name: res.name,
        email: res.email,
      })
    })
  }

  handleUniqueIdChange = event => {
    this.setState({ uniqueid: event.target.value })
  }

  submitUniqueId = () => {
    Api.verifyUniqueId(this.state.uniqueid).then(res => {
      if (res.ok === 1) {
        console.log(res)
        this.props.next(res)
      } else {
        alert('That unique id is incorrect')
      }
    })
  }

  render() {
    return (
      <div>
        <h1>
          Welcome{' '}
          <span role="img" aria-label="home">
            🏠
          </span>{' '}
          {this.state.name}
        </h1>
        <p>
          We're honored to have you as one of our first 30 mentors worldwide.
          Please insert the unique ID that came with your invitation so we can
          make sure it's really you and not someone else.
        </p>
        <p>Insert Your Unique ID</p>
        <input
          type="text"
          onChange={this.handleUniqueIdChange}
          value={this.state.uniqueid}
        />
        <button onClick={this.submitUniqueId}>Let's do it</button>
      </div>
    )
  }
}
