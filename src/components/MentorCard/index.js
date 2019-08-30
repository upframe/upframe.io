import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AOS from 'aos'

export default class MentorCard extends Component {

  componentWillReceiveProps() {
    AOS.refresh()
  }

  render() {
    const mentor = this.props.mentorInfo
    return (
      <Link to={mentor.keycode} data-aos={this.props.animation} data-aos-offset='0' data-aos-delay={300}>
        <div className='card hoverable mentor-card flex justifycontent-center'>
          <div>
            <img className='mentor-profilepic' src={mentor.profilePic} alt={mentor.name} />
            <div id='mentor-info'>
              <h1 id='name' className='fontweight-medium'>{mentor.name}</h1>
              <p id='role-company'>{mentor.role} at {mentor.company}</p>
              <p id='bio' style={{ WebkitBoxOrient: 'vertical'}}>{mentor.bio}</p>
              <ul id='tags' className='flex'>
                <Tags content={mentor.tags} small={true} />
              </ul>
            </div>
          </div>
        </div>
      </Link>
    )
  } 
}

const Tags = (props) => {
  if (props.content === "" || props.content === "[]") {
    return null
  } else {
    let tags = JSON.parse(props.content)
    // We want to keep tags to a max of 3
    // ABaixo de 1290 pomos so 2 + o simbolo
    if (tags.length > 3) {
      if (props.small) {
        tags = tags.slice(0, 2)
      } else {
        tags = tags.slice(0, 3)
      }
      tags.push({
        text: "+"
      })
    }
    if (tags.length === 3 & props.small) {
      tags = tags.slice(0, 2)
      tags.push({
        text: "+"
      })
    }
    let hello = tags.map((tag, i) =>
      <li key={i} className='flex alignitems-center mentor-tag'>{tag.text}</li>
    )
    return hello
  }
}