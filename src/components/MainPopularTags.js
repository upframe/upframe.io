import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Api from '../utils/Api'

export default class MainSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tags : []
    }
  }

  componentDidMount() {
    Api.getSearchTags().then((res) => {
      this.setState({
        tags : res ? res : []
      })
    })
  }

  render() {
    if (this.state.tags !== []) {
      return (
        <div class="popular-tags">
          <h2 className="font-weight-normal">Popular Tags</h2>
          <div>
            {this.state.tags.map((tag) => {
              return (
                <Link to={'/search/' + tag} className="tag-item">
                  {tag}
                </Link>
              )
            })}
          </div>
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