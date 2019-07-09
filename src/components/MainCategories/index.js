import React from 'react'
import { Link } from 'react-router-dom';

import './index.css'

const MainCategories = props => {

  return (
    <div id='categories-list'>
      <h1 className='font-150 fontweight-medium' data-aos='fade-up'
        data-aos-delay='0' data-aos-offset='0'>
      <i className="em em-star2 mr1"></i>Top Categories</h1>
      <p data-aos='fade-up' data-aos-delay='200' data-aos-offset='0'>
        How can we help? Start by picking one of our main categories.
      </p>
      <ul className='list-reset grid'>
        <Link to='/business' data-aos='fade-up' data-aos-delay='300' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Business' title='Business' id="category-image"></div>
            <h1>Business</h1>
          </li>
        </Link>
        
        <Link to='/design' data-aos='fade-up' data-aos-delay='400' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Design' title='Design' id="category-image"></div>
            <h1>Design</h1>
          </li>
        </Link>

        <Link to='/software' data-aos='fade-up' data-aos-delay='500' data-aos-offset='0'>
          <li className='category-item'>
            <div alt='Software' title='Software' id="category-image"></div>
            <h1>Software</h1>
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default MainCategories