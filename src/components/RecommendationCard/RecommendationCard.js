import React, { useEffect, useState } from 'react'
import { queries } from '../../gql'
import Api from '../../api'
import { ProfilePicture } from '../../components'

import './RecommendationCard.scss'

const MENTOR_URL = 'https://upframe.io/'

const MentorAvatar = props => {
  if (props.mentor) {
    return (
      <div className="mentorWrapper">
        <a href={MENTOR_URL + props.mentor.handle} className="mentorContent">
          <ProfilePicture imgs={props.mentor.profilePictures} />
          <div className="mentorText">
            <h2>{props.mentor.name}</h2>
            <h3>
              {props.mentor.title} at {props.mentor.company}
            </h3>
          </div>
        </a>
      </div>
    )
  }

  return (
    <div className="center-container">
      <div className="loader"></div>
    </div>
  )
}

const Recommendation = props => {
  const [mentorsList, setMentorsList] = useState([])

  useEffect(() => {
    Promise.all(
      props.recommendations.map(handle =>
        Api.query({
          query: queries.PROFILE,
          variables: { handle, slotsAfter: new Date().toISOString() },
        })
      )
    ).then(results => setMentorsList(results.map(({ data }) => data.mentor)))
  }, [props.recommendations])

  const mentorComponent = mentorsList.map((mentor, key) => {
    return <MentorAvatar mentor={mentor} key={key} />
  })

  return (
    <section className="cardWrapper">
      <h2>Other mentors who can help</h2>
      <div className="recommenderWrapper">
        {mentorComponent.length ? (
          mentorComponent
        ) : (
          <div className="center-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Recommendation
