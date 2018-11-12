import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import * as Api from '../utils/Api'

export default class MainMentorList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      mentors: []
    }
  }

  componentDidMount () {
    Api.getRandomMentors().then(res => {
      this.setState({
        mentors: res.mentor
      })
    })
  }

  mentorTagsToElement = (tags) => {
    return tags.map(tag => {
      return (
        <li className='mentor-tags-list-element'>{tag}</li>
      )
    })
  }

  mentorToElement = (mentor) => {
    return (
      <Link to={'/people/' + mentor.keycode}>
        <div className='mentor-cards'>
          <img alt={mentor.name} src={mentor.profilePic} />
          <p>{mentor.name}</p>
          <p>{mentor.role} @  
            <Link to={'/companies/' + mentor.company}>{mentor.company}</Link>
          </p>
          <p>{mentor.bio}</p>
          <p>{mentor.tags}</p>
          {/* <ul>
            {this.mentorTagsToElement(mentor.tags)}
          </ul> */}
          Fim
        </div>
      </Link>
    )
  }

  render () { // For each mentor...
    if (this.state.mentors !== []) {
      return (
        <div>
          {this.state.mentors.map(mentor => {
            return this.mentorToElement(mentor)
          })}
        </div>
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