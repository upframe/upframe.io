import React, { Component } from 'react'

import AppContext from '../../components/AppContext'

import Api from '../../utils/Api'
import MainCategories from './MainCategories'
import MainMentorList from './MainMentorList'

import aos from 'aos'
import 'aos/dist/aos.css'

export default class Main extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      mentors: [],
      fetched: false,
      search: false,
    }

    aos.init({
      duration: 350,
      delay: 0,
      offset: 0,
      throttleDelay: 0,
      once: true,
    })
  }

  componentDidMount() {
    Api.getAllMentors(true).then(res => {
      let orderedMentors = res.mentors.filter(mentor => mentor.slots.length)
      let mentorsWithNoSlots = res.mentors.filter(
        mentor => mentor.slots.length === 0
      )
      for (let mentor of mentorsWithNoSlots) orderedMentors.push(mentor)
      this.setState({
        mentors: orderedMentors,
      })
    })
  }

  componentDidUpdate() {
    if (this.context.resetSearchQuery) {
      Api.saveSearchQueryToDb(this.context.searchQuery).then(res => {})
      this.context.setSearchQuery(this.context.searchQuery, false)
      Api.searchFull(this.context.searchQuery).then(res => {
        this.setMentors(res.search)
      })
    }
  }

  setMentors = mentors => {
    this.setState({
      mentors: mentors,
    })
  }

  
  render() {
    return (
      <main id="home">
        <div className="container grid">
          <React.Fragment>
            <MainCategories setMentors={this.setMentors} />
            <h1
              className="font-150 fontweight-medium"
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-offset="0"
            >
              Featured Mentors
            </h1>
            <p data-aos="fade-up" data-aos-delay="700" data-aos-offset="0">
              Our in-house curators work alongside with startup founders,
              community shapers and domain experts across Europe to make sure
              you can find people who can help you tackle the challenges of
              today and tomorrow.
            </p>
          </React.Fragment>
          <MainMentorList mentors={this.state.mentors} />
        </div>
      </main>
    )
  }
}
