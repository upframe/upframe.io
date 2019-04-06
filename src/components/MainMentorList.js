import React, { PureComponent } from 'react';
import MentorCard from './MentorCard'

export default class MainMentorList extends PureComponent {

  render() {
    if (this.props.mentors !== [] && this.props.mentors !== undefined) {
      return (
        <div className="mentor-list">
          {this.props.mentors.map((mentor) => {
            return (
              <MentorCard mentorInfo={mentor} />
            )
          })}
        </div>
      )
    } else {
      return (
        <p>No mentors found</p>
      )
    }
  }
}