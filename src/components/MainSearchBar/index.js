import React, { Component } from 'react';
import Api from '../../utils/Api';
import './index.css';

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
      if (this.state.search === '') {
        Api.getAllMentors().then((res) => {
          this.props.setMentors(res.mentors)
        })
      } else {
        Api.searchFull(this.state.search).then((res) => {
          this.props.setMentors(res.search)
        })
      }
    })
  }

  render() {
    return (
      <input id="search-input" placeholder="Try looking a topic, a person or a startup" onChange={this.handleChange} />
    );
  }
}