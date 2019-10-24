import React, { Component } from 'react'
import Confetti from 'react-confetti'

export default class OnboardingAllDoneTab extends Component {
  render() {
    return (
      <div>
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : '100%'}
          height={typeof window !== 'undefined' ? window.innerHeight : '100%'}
          numberOfPieces={300}
        />
        <h1>
          Welcome to the Upframe Family
          <span role="img" aria-label="party popper">
            🎉
          </span>
        </h1>
        <p>You are now ready to login. Have a look around.</p>
      </div>
    )
  }
}
