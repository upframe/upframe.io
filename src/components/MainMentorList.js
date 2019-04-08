import React, { PureComponent } from 'react';
import MentorCard from './MentorCard'

export default class MainMentorList extends PureComponent {

  render() {
    if (this.props.mentors !== [] && this.props.mentors !== undefined) {
      return (
        <div className="mentor-list">
          {this.props.mentors.map((mentor, index) => {
            return (
              <MentorCard key={index} mentorInfo={mentor} animation='fade-up' index={index} />
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