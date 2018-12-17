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
    Api.getRandomMentors().then((res) => {
      this.setState({
        mentors: res.mentor
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
      <Link to={'/people/' + mentor.keycode}>
        <div className='flex'>
          <img className='mentor-card-image' src={mentor.profilePic} alt={mentor.name}/>
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

  render () { // For each mentor...
    if (this.state.mentors !== []) {
      return (
        <div className="mentor-list">
          {this.state.mentors.map((mentor) => {
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