import React, { Component } from 'react'

import './index.css'
import { Redirect } from 'react-router-dom'

import AppContext from '../AppContext'
import { runInThisContext } from 'vm'

import styles from './index.module.scss'
export default class MainSearchBar extends Component {
  static contextType = AppContext

  handleChange = event => {
    this.context.setSearchQuery(event.target.value)
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.context.setSearchQuery(event.target.value, true)
    }
  }
  RedirectToMain = () => {
    if (this.context.resetSearchQuery) {
      return <Redirect to="/" />
    }
  }

  render() {
    return (
      <div className={styles.SearchWrapper}>
        <input
          type="text"
          className={styles.input}
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
