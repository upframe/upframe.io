import React, { PureComponent } from 'react'
import MentorCard from '../MentorCard'

import './index.css'

export default class MainMentorList extends PureComponent {
  render() {
    if (this.props.mentors !== [] && this.props.mentors !== undefined) {
      return (
        <React.Fragment>
          <div className="mentor-list flex flex-column">
            {this.props.mentors.map((mentor, index) => {
              return (
                <MentorCard
                  key={index}
                  mentorInfo={mentor}
                  animation="fade-up"
                />
              )
            })}
          </div>
        </React.Fragment>
      )
    } else {
      return <h3>No mentors found</h3>
    }
  }
}
