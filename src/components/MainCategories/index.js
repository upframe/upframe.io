import React, { Component } from 'react'

import './index.css'

export default class MainCategories extends Component {
  render() {
    return (
      <div id='categories-list'>
        <h1 className='font-150 fontweight-medium'>Top Categories</h1>
        <p>How can we help? Start by picking one of our main categories.</p>
        <div className='grid'>
          <div className='category-item'></div>
        </div>
      </div>
    )
  }
}