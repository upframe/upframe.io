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
      <h1 className='font-150 fontweight-medium'><i className="em em-star2"></i>Top Categories</h1>
      <p>How can we help? Start by picking one of our main categories.</p>
      <div className='grid'>
        <div className='category-item flex alignitems-center' onClick={showBusiness}>
          <h1 className='white-text'>Business</h1>
        </div>

        <div className='category-item' onClick={showDesign}>
          <h1>Design</h1>
        </div>

        <div className='category-item' onClick={showTechnology}>
          <h1>Technology</h1>
        </div>
      </div>
    </div>
  )
}

export default MainCategories