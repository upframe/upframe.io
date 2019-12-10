import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import AppContext from '../AppContext'

import styles from './MainSearchBar.module.scss'

export default class MainSearchBar extends Component {
  static contextType = AppContext
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
    }
  }

  handleChange = event => {
    this.setState({
      searchQuery: event.target.value,
    })
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.context.setSearchQuery(this.state.searchQuery)
      this.context.startSearchQuery(true)
    }
  }

  RedirectToMain = () => {
    if (this.context.isSearchQuery) {
      return <Redirect to="/" />
    }
  }

  render() {
    return (
      <div className={styles.SearchWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="What are you looking for?"
          onChange={this.handleChange}
          value={this.state.searchQuery}
          onKeyDown={this.handleKeyPress}
        />
        {this.RedirectToMain()}
      </div>
    )
  }
}
