import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// import app context
import AppContext from '../components/AppContext'

import Api from '../utils/Api';
import MainCategories from '../components/MainCategories'
import MainMentorList from '../components/MainMentorList'
import MainSearchBar from '../components/MainSearchBar'

import aos from 'aos'
import 'aos/dist/aos.css'

export default class Main extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      mentors: [],
      fetched: false,
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
    let emptyQuery = this.context.searchQuery.length === 0

    return (
      <React.Fragment>
        <Helmet>
          <title>Upframe</title>
          <meta property="og:title" content="Home | Upframe"></meta>
          <meta property="og:description" content="Start making your projects a reality with experienced worldwide mentors"></meta>
          <meta property="og:image" content="/android-chrome-192x192.png"></meta>
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Helmet>


        <main id='home'>
          <div className="container grid" >
            <MainSearchBar setMentors={this.setMentors} />
            {emptyQuery ?
              <React.Fragment>
                <MainCategories setMentors={this.setMentors} />
                <h1 className='font-150 fontweight-medium' data-aos='fade-up'
                  data-aos-delay='600' data-aos-offset='0'>
                  <i className="em em-hot_pepper mr1"></i>Featured Mentors
                </h1>
                <p data-aos='fade-up' data-aos-delay='700' data-aos-offset='0'>Our in-house curators work
                  alongside with startup founders, community shapers and domain experts across Europe to
                  make sure you can find people who can help you tackle the challenges
                  of today and tomorrow.
                </p>
              </React.Fragment>
              : null
            }
            <MainMentorList mentors={this.state.mentors} />
          </div>
        </main>
      </React.Fragment>
    )
  }
}