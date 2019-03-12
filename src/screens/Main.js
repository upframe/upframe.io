import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import * as Api from '../utils/Api';

// import MainMentorList from '../components/MainMentorList'
// import MainPopularTags from '../components/MainPopularTags'
// import MainSearchBar from '../components/MainSearchBar'

export default class Main extends Component {

  constructor (props) {
    super(props)
    this.state = {
      mentors: []
    }
  }

  componentDidMount() {
    Api.getAllMentors().then((res) => {
      this.setState({
        mentors: res.mentors
      })
    })
  }

  mentorTagsToElement = (tags) => {
    return tags.map((tag) => {
      return (
        <li className='mentor-tags-list-element'>{tag}</li>
      )
    })
  }

  mentorToElement = (mentor) => {
    return (
      <Link to={mentor.keycode}>
        <div className='flex'>
          <img className='mentor-card-image' src={mentor.profilePic} alt={mentor.name} />
          <div className='mentor-card-info'>
            <h1>{mentor.name}</h1>
            <p>{mentor.role} @ <Link to={'/companies/' + mentor.company}>{mentor.company}</Link></p>
            <p>{mentor.bio}</p>
          </div>
          {/*DEBUG for now <ul className='mentor-card-tags'>
            {this.mentorTagsToElement(mentor.tags)}
          </ul> */}
        </div>
      </Link>
    )
  }

  render() {
    if (this.state.mentors !== []) {
      return (
        <main id='home'>
          <div className="container grid">
            <div className="mentor-list">
              {this.state.mentors.map((mentor) => {
                return this.mentorToElement(mentor)
              })}
            </div>
          </div>
        </main>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}