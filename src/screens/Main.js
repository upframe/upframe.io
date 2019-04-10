import React, { Component } from 'react';
// import { Link } from 'react-router-dom'

import Api from '../utils/Api';

import MainMentorList from '../components/MainMentorList'
// import MainPopularTags from '../components/MainPopularTags'
import MainSearchBar from '../components/MainSearchBar'

import aos from 'aos'
import 'aos/dist/aos.css'

export default class Main extends Component {

  constructor (props) {
    super(props)
    this.state = {
      mentors: []
    }

    aos.init({
      duration: 1000,
    })
  }

  componentDidMount() {
    Api.getAllMentors().then((res) => {
      this.setState({
        mentors: res.mentors
      })
    })
  }

  setMentors = (mentors) => {
    this.setState({
      mentors: mentors
    })
  }

  render() {
    return (
      <main id='home'>
        <div className = "container grid" >
          <MainSearchBar setMentors={this.setMentors}/>
          <MainMentorList mentors={this.state.mentors}/>
        </div>
      </main>
    )
  }
}