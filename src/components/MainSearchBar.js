import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as Api from '../utils/Api';

export default class MainSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
    }
  }

  handleChange = (event) => {
    this.setState({
      search: event.target.value
    }, () => {
      if (this.state.search && this.state.search.length > 1) {
        this.getInfo()
      } else if (!this.state.query && this.state.search.length === 1) {
        Api.getAllMentors().then((res) => {
          this.props.setMentors(res.mentors)
        })
      }
    })
  }

  getInfo = () => {
    Api.searchFull(this.state.search).then((res) => {
      this.props.setMentors(res.search)
    })
  }

  render() {
    return (
      <div>
        <input onChange={this.handleChange} />
      </div>
    );
  }
}