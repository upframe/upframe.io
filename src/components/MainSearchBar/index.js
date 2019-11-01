import React, { Component } from 'react'

import Api from '../../utils/Api'
import { sortMentorsBySlots } from '../../utils/Array'

import './index.css'
import { Redirect } from "react-router-dom";


import AppContext from '../AppContext'
import { runInThisContext } from 'vm';

export default class MainSearchBar extends Component {
  static contextType = AppContext
  

  handleChange = event => {
    this.context.setSearchQuery(event.target.value)

  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      const search = this.context.searchQuery
      Api.searchFull(search).then(res => {
        if(res.ok == 0){
          return alert('user does not exist')
        }
        this.context.resetSearchQuery = true;
        this.props.setMentors(res.search)
    })
    }
  }

  RedirectToMain = () => {
    if (this.context.resetSearchQuery) {
      return <Redirect to='/' />
    }
  }

  render() {

    return (
      <div>
        <input
          type="text"
          id="search-input"
          className="icon"
          placeholder="Try looking for a person..."
          onChange={this.handleChange}
          value={this.context.searchQuery}
          onKeyPress={this.handleKeyPress}
        />
         {this.RedirectToMain()}
      </div>
     
    )
  }
}
