import React, { Component } from 'react';

import * as Api from '../utils/Api';

export default class MainSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      expertise: [],
      company: [],
      people: []
    }
  }

  handleChange = (event) => {
    this.setState({
      search: event.target.value
    }, () => {
      if (this.state.search && this.state.search.length > 1) {
        if (this.state.search.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) {
      }
    })
  }

  getInfo = () => {
    Api.searchQuick(this.state.search).then((res) => {
      this.setState({
        expertise: res.expertise,
        company: res.companies,
        people: res.people
      })
    })
  }

  expertise = (props) => {
    if (!props)
      return 
    const expertise = props.map(element => (
      <li>
        {element.name}
        {element.description}
      </li>
    ))
    return <ul>{expertise}</ul>
  }

  company = (props) => {
    if (!props)
      return 
    const companies = props.map(element => (
      <li>
        {element.name}
        {element.description}
      </li>
    ))
    return <ul>{companies}</ul>
  }

  people = (props) => {
    if (!props)
      return 
    const people = props.map(element => (
      <li>
        {element.name}
        {element.keycode}
        {element.bio}
        {element.profilePic}
      </li>
    ))
    return <ul>{people}</ul>
  }

  render() {
    return (
      <div>
        <input type='text' onChange={this.handleChange} value={this.state.search} />
        {this.expertise(this.state.expertise)}
        {this.company(this.state.company)}
        {this.people(this.state.people)}
      </div>
    );
  }
}