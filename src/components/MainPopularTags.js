import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as Api from '../utils/Api'

export default class MainSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tags : []
    }
  }

  componentDidMount() {
    Api.getSearchTags().then(res => {
      this.setState({
        tags : res
      })
    })
  }

  render() {
    if (this.state.tags !== []) {
      return (
        <div>
          {this.state.tags.map(tag => {
            return (<div><Link to={'/search/' + tag}>
              {tag}
            </Link></div>)
          })}
        </div>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}