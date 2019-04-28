import React, { Component } from 'react';
// import { Link } from 'react-router-dom'

import Api from '../utils/Api';

import MainCategories from '../components/MainCategories'
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
      duration: 750,
      delay: 0,
      offset: 0,
      throttleDelay: 0,
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
        <div className="container grid" >
          <MainSearchBar setMentors={this.setMentors} />
          <MainCategories/>
          <MainMentorList mentors={this.state.mentors} />
        </div>
      </main>
    )
  }
}