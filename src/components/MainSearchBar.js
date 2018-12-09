import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        // if (this.state.search.length % 2 === 0) {
        this.getInfo()
        // }
      } else if (!this.state.query && this.state.search.length === 1) {
        this.setState({
          expertise: [],
          company: [],
          people: []
        })
      }
    })
  }

  getInfo = () => {
    Api.searchQuick(this.state.search).then((res) => {
      console.log(res)
      this.setState({
        expertise: res.expertise,
        company: res.company,
        people: res.people
      })
    })
  }

  expertise = (props) => {
    if (!props) {
      return 
    }
    console.log(props.results)
    const expertise = props.map((element) => (
      <Link to={'/expertise/' + element.name}>
        <li key={element.name}>
          {element.name}
          {element.description}
        </li>
      </Link>
    ))
    return <ul>{expertise}</ul>
  }

  people = (props) => {
    if (!props) {
      return
    }
    console.log(props.results)
    const people = props.map((element) => (
      <Link to={'/people/' + element.keycode}>
        <li key={element.name}>
          {element.name}
          {element.keycode}
          {element.bio}
          {element.profilePic}
        </li>
      </Link>
    ))
    return <ul>{people}</ul>
  }

  company = (props) => {
    if (!props) {
      return
    }
    console.log(props.results)
    const company = props.map((element) => (
      <Link to={'/company/' + element.name}>
        <li key={element.name}>
          {element.name}
          {element.description}
        </li>
      </Link>
    ))
    return <ul>{company}</ul>
  }

  render() {
    return (
      <div>
        <input onChange={this.handleChange} />
        {this.expertise(this.state.expertise)}
        {this.people(this.state.people)}
        {this.company(this.state.company)}
      </div>
    );
  }
}