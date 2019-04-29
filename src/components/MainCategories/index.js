import React from 'react'

import './index.css'
import Api from '../../utils/Api';

const MainCategories = props => {
  const showBusiness = () => {
    document.getElementById('search-input').value = 'Business'
    Api.searchFull('Business').then((res) => {
      props.setMentors(res.search)
    })
  }

  const showDesign = () => {
    document.getElementById('search-input').value = 'Design'
    Api.searchFull('Design').then((res) => {
      props.setMentors(res.search)
    })
  }

  const showTechnology = () => {
    document.getElementById('search-input').value = 'Technology'
    Api.searchFull('Technology').then((res) => {
      props.setMentors(res.search)
    })
  }

  return (
    <div id='categories-list'>
      <h1 className='font-150 fontweight-medium'>
      <i className="em em-star2"></i>Top Categories</h1>
      <p>How can we help? Start by picking one of our main categories.</p>
      <ul className='list-reset grid'>
        <li className='category-item' onClick={showBusiness}>
          <div alt='Business' title='Business' id="category-image"></div>
          <h1>Business</h1>
        </li>
        
        <li className='category-item' onClick={showDesign}>
          <div alt='Design' title='Design' id="category-image"></div>
          <h1>Design</h1>
        </li>

        <li className='category-item' onClick={showTechnology}>
          <div alt='Technology' title='Technology' id="category-image"></div>
          <h1>Technology</h1>
        </li>
      </ul>
    </div>
  )
}

export default MainCategories