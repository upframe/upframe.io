import React, { useEffect, useState } from 'react'
import API from '../../utils/Api'

import './index.scss'

const MENTOR_URL = 'https://upframe.io/'

const MentorAvatar = props => {
  if (props.mentor) {
    return (
      <div className="mentorWrapper">
        <a href={MENTOR_URL + props.mentor.keycode} className="mentorContent">
          <img src={props.mentor.profilePic} alt={props.mentor.name} />
          <div className="mentorText">
            <h2>{props.mentor.name}</h2>
            <h3>
              {props.mentor.role} at {props.mentor.company}{' '}
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

  const apiCall = async mentorKeycode => {
    let res = await API.getMentorInfo(mentorKeycode)

    return res.mentor
  }

  useEffect(() => {
    const promises = props.recommendations.map(mentorPromise => {
      return apiCall(mentorPromise)
    })

    Promise.all(promises).then(result => {
      setMentorsList(result)
    })
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
