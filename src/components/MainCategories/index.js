import React, { Component } from 'react'

import './index.css'

export default class MainCategories extends Component {
  render() {
    return (
      <div id='categories-list'>
        <h1 className='font-150 fontweight-medium'>
        <i className="em em-star2"></i>Top Categories</h1>
        <p>How can we help? Start by picking one of our main categories.</p>
        <ul className='list-reset grid'>
          <li className='category-item flex alignitems-center'>
            <div alt='Business' title='Business' id="category-image"></div>
            <h1>Business</h1>
          </li>
          
          <li className='category-item'>
            <div alt='Design' title='Design' id="category-image"></div>
            <h1>Design</h1>
          </li>

          <li className='category-item'>
            <div alt='Technology' title='Technology' id="category-image"></div>
            <h1>Technology</h1>
          </li>
        </ul>
      </div>
    )
  }
}