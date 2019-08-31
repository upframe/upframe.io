import React, { PureComponent } from 'react';
import MentorCard from './MentorCard'

const MainMentorList = (props) => {
  if (Array.isArray(props.mentors) && props.mentors.length) {
    return (
      <div className="mentor-list flex flex-column">
        {props.mentors.map((mentor, index) => {
          return (
            <MentorCard key={index} mentorInfo={mentor} animation='fade-up' index={index} />
          )
        })}
      </div>
    )
  } else {
    return null
  }
}

export default MainMentorList