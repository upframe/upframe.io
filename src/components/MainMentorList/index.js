import React, { PureComponent } from 'react';
import MentorCard from '../MentorCard'

import './index.css'

export default class MainMentorList extends PureComponent {

  render() {
    if (this.props.mentors !== [] && this.props.mentors !== undefined) {
      return (
        <React.Fragment>
          <h1 className='font-150 fontweight-medium'><i class="em em-hot_pepper"></i>Featured Mentors</h1>
          <p>Our in-house curators work alongside with startup founders, community shapers and domain
            experts across Europe to make sure you can find people who can help you tackle the challenges
            of today and tomorrow.</p>
          <div className="mentor-list flex flex-column">
            {this.props.mentors.map((mentor, index) => {
              return (
                <MentorCard key={index} mentorInfo={mentor} animation='fade-up' />
              )
            })}
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <h1 className='font-150 fontweight-medium'><i class="em em-hot_pepper"></i>Featured Mentors</h1>
          <p>Our in-house curators work alongside with startup founders, community shapers and domain
            experts across Europe to make sure you can find people who can help you tackle the challenges
            of today and tomorrow.</p>
          <p>No mentors found</p>
        </React.Fragment>
      )
    }
  }
}