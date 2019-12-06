import React from 'react'
import './index.scss'

const LandingComponent = () => {
  const goProductHunt = () => {
    window.open('https://www.producthunt.com/upcoming/upframe')
  }
  return (
    <div className="landing-component">
      <h1>The home for</h1>
      <h1>First-time Founders.</h1>
      <p>
        Upframe helps you find and connect with industry leaders that can give
        you startup advice and mentor you through the first steps of building a
        product.
      </p>
      <button onClick={goProductHunt}>Get Early Access</button>
    </div>
  )
}

export default LandingComponent
