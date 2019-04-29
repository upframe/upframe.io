import React, { Component } from 'react';

import Api from '../utils/Api';
import MainCategories from '../components/MainCategories'
import MainMentorList from '../components/MainMentorList'
import MainSearchBar from '../components/MainSearchBar'

import aos from 'aos'
import 'aos/dist/aos.css'

export default class Main extends Component {

  constructor (props) {
    super(props)
    this.state = {
      mentors: [],
      searchQuery: '',
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

  updateSearchQuery = (query) => {
    this.setState({ searchQuery: query })
  }

  render() {
    let queryLength = this.state.searchQuery.length

    return (
      <main id='home'>
        <div className="container grid" >
          <MainSearchBar setMentors={this.setMentors} searchChanged={this.updateSearchQuery}/>
          { !queryLength ? 
            <MainCategories setMentors={this.setMentors} />
          : null
          }
          <h1 className='font-150 fontweight-medium'><i class="em em-hot_pepper"></i>Featured Mentors</h1>
          <p>Our in-house curators work alongside with startup founders, community shapers and domain
            experts across Europe to make sure you can find people who can help you tackle the challenges
            of today and tomorrow.</p>
          <MainMentorList mentors={this.state.mentors} />
        </div>
      </main>
    )
  }
}