import React, { PureComponent } from 'react'
import MentorCard from './MentorCard'
import styles from './mentorlist.module.scss'

export default class MainMentorList extends PureComponent {
  render() {
    if (this.props.mentors !== [] && this.props.mentors !== undefined) {
      return (
        <React.Fragment>
          <div className={styles.mentorList}>
            {this.props.mentors.map((mentor, index) => {
              return (
                <MentorCard key={index} mentor={mentor} animation="fade-up" />
              )
            })}
          </div>
        </React.Fragment>
      )
    } else {
      return <p>No mentors found</p>
    }
  }
}
