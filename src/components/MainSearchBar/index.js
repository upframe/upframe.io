import React, { Component } from 'react';
import Api from '../../utils/Api';
import './index.css';

export default class MainSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: props.search ? props.search : '',
    }
  }

  handleChange = (event) => {
    this.setSearch(event.target.value)
  }

  setSearch = (search) => {
    this.setState({
      search: search
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

    // update query in parent component
    this.props.searchChanged(search)
  }

  render() {
    return (
      <input type='text' id="search-input" className='icon' placeholder="Try looking for a person..."
        onChange={this.handleChange} />
    );
  }
}