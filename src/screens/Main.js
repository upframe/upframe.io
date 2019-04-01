import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import * as Api from '../utils/Api';

// import MainMentorList from '../components/MainMentorList'
// import MainPopularTags from '../components/MainPopularTags'
// import MainSearchBar from '../components/MainSearchBar'

const Tags = (props) => {
  if (props.content === "" || props.content === "[]") {
    return null
  } else {
    let tags = JSON.parse(props.content)
    // We want to keep tags to a max of 3
    if (tags.length > 3) {
      tags = tags.slice(0, 2)
      tags.push("+")
    }
    let hello = tags.map((tag, i) =>
      <li key={i} className='flex align-items-center mentor-tag'>{tag.text}</li>
    )
    return hello
  }
}

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

  render() {
    if (this.state.mentors !== []) {
      return (
        <main id='home'>
          <div className="container grid">
            <div className="mentor-list">
              {this.state.mentors.map((mentor) => {
                return (
                  <Link to={mentor.keycode}>
                    <div className='card mentor-card flex justify-center'>
                      <div>
                        <img className='mentor-profilepic' src={mentor.profilePic} alt={mentor.name} />
                        <div className='mentor-info'>
                          <h1 id='name' className='font-150 font-weight-normal'>{mentor.name}</h1>
                          <p id='role-company'>{mentor.role} at {mentor.company}</p>
                          <p id='bio' style={{ WebkitBoxOrient: 'vertical'}}>{mentor.bio}</p>
                          <ul id='tags' className='flex'>
                            <Tags content={mentor.tags} />
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
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