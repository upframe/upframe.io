import React, { Component } from 'react';
import Api from '../../utils/Api';
import './index.css';

import AppContext from '../AppContext';

export default class MainSearchBar extends Component {
  static contextType = AppContext

  handleChange = (event) => {
    this.setSearch(event.target.value)
  }

  setSearch = (search) => {
    // update query in context
    this.context.setSearchQuery(search)

    // remove all mentors from the mentors list
    this.props.setMentors([])

    if (search === '') {
      Api.getAllMentors().then((res) => {
        this.props.setMentors(res.mentors)
      })
    } else {
      Api.searchFull(search).then((res) => {
        this.props.setMentors(res.search)
      })
    }
  }

  render() {
    if (this.context.searchQuery.length === 0 && this.context.resetSearchQuery) {
      this.context.setSearchQuery('', false)

      Api.getAllMentors().then((res) => {
        this.props.setMentors(res.mentors)
      })
    }

    return (
      <input type='text' id="search-input" className='icon' placeholder="Try looking for a person..."
        onChange={this.handleChange} value={this.context.searchQuery} />
    );
  }
}