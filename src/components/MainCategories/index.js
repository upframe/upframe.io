import React, { Component } from 'react'

import './index.css'

export default class MainCategories extends Component {
  render() {
    return (
      <div id='categories-list'>
        <h1 className='font-150 fontweight-medium'><i class="em em-star2"></i>Top Categories</h1>
        <p>How can we help? Start by picking one of our main categories.</p>
        <div className='grid'>
          <div className='category-item flex alignitems-center'>
            <h1 className='white-text'>Business</h1>
          </div>
          
          <div className='category-item'>
            <h1>Design</h1>
          </div>

          <div className='category-item'>
            <h1>Technology</h1>
          </div>
        </div>
      </div>
    )
  }
}