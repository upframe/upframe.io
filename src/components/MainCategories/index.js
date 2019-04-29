import React from 'react'
import { Link } from 'react-router-dom';

import './index.css'

const MainCategories = props => {

  return (
    <div id='categories-list'>
      <h1 className='font-150 fontweight-medium'>
      <i className="em em-star2"></i>Top Categories</h1>
      <p>How can we help? Start by picking one of our main categories.</p>
      <ul className='list-reset grid'>
        <Link to='/business' data-aos='fade-up'
          data-aos-delay='0' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Business' title='Business' id="category-image"></div>
            <h1>Business</h1>
          </li>
        </Link>
        
        <Link to='/design' data-aos='fade-up'
          data-aos-delay='0' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Design' title='Design' id="category-image"></div>
            <h1>Design</h1>
          </li>
        </Link>

        <Link to='/technology' data-aos='fade-up'
          data-aos-delay='0' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Technology' title='Technology' id="category-image"></div>
            <h1>Technology</h1>
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default MainCategories