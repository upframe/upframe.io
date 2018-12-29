import React, { Component } from 'react';
import * as Api from '../utils/Api';
import MentorMeetupPopup from '../components/MentorMeetupPopup';
import moment from 'moment';

export default class People extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mentorExists: 1,
      mentor: {
        bio: 'Loading',
        company: 'Loading',
        dribbble: 'Loading',
        email: 'Loading',
        facebook: 'Loading',
        github: 'Loading',
        linkedin: 'Loading',
        location: 'Loading',
        name: 'Loading',
        profilePic: 'Loading',
        role: 'Loading',
        twitter: 'Loading',
        uid: 'Loading',
        website: 'Loading',
        tags: [],
        freeSlots: []
      }
    }
  }

  componentDidMount() {
    let keycode = window.location.pathname.split('/')[1]
    let nowDate = new Date()
    let limitDate = moment().add('days', 30)
    // let weekday = new Array(7);
    // weekday[0] = "Sun";
    // weekday[1] = "Mon";
    // weekday[2] = "Tue";
    // weekday[3] = "Wed";
    // weekday[4] = "Thu";
    // weekday[5] = "Fri";
    // weekday[6] = "Sat";
    // let month = new Array();
    // month[0] = "January";
    // month[1] = "February";
    // month[2] = "March";
    // month[3] = "April";
    // month[4] = "May";
    // month[5] = "June";
    // month[6] = "July";
    // month[7] = "August";
    // month[8] = "September";
    // month[9] = "October";
    // month[10] = "November";
    // month[11] = "December";

    Api.getFreeSlots(nowDate, limitDate).then((res) => {
      return res.slots
      // let freeSlots = res.slots.map((slot) => {
      //   let startDate = new Date(slot.start)
      //   let endDate = new Date(slot.end)
      //   let dayOfWeek = weekday[startDate.getDay()]
      //   let monthText = month[startDate.getMonth()]
      //   //getDate() dia
      //   return (
      //     start
      //   )
      // })
    }).then((res) => {
      let slots = res
      Api.getMentorInfo(keycode).then((res) => {
        console.log(res)
        if (res.message) {
          this.setState({
            mentorExists: 0
          })
        } else {
          this.setState({
            mentor: {
              bio: res.mentor.bio,
              company: res.mentor.company,
              dribbble: res.mentor.dribbble,
              email: res.mentor.email,
              facebook: res.mentor.facebook,
              github: res.mentor.github,
              linkedin: res.mentor.linkedin,
              location: res.mentor.location,
              name: res.mentor.name,
              profilePic: res.mentor.profilePic,
              role: res.mentor.role,
              twitter: res.mentor.twitter,
              uid: res.mentor.uid,
              website: res.mentor.website,
              tags: res.mentor.tags ? JSON.parse(res.mentor.tags) : [],
              freeSlots: slots
            }
          })
        }
      })
    })
  }

  mentorTagsToElement = (tags) => {
    return tags.map((tag) => {
      return (
        <li className='mentor-tags-list-element'>{tag.text}</li>
      )
    })
  }

  displayFreeSlots = () => {
    if (this.state.mentor.freeSlots) {
      return this.state.mentor.freeSlots.map((slot) => {
        let startDate = new Date(slot.start)
        return (
          <div>
            <p>{startDate.getDate()}-{startDate.getMonth()}-{startDate.getUTCFullYear()}</p>

          </div>
        )
      })
    }
  }

  selectSlot = () => {

  }

  render() {
    console.log(this.state.mentor)
    if (this.state.mentorExists === 1) {
      return (
        <div>
          <img src={this.state.mentor.profilePic} alt='Profile' />
          <p>{this.state.mentor.name}</p>
          <p>{this.state.mentor.role} at {this.state.mentor.company}</p>
          <p>{this.state.mentor.location}</p>
          <ul className='mentor-card-tags'>
            {this.mentorTagsToElement(this.state.mentor.tags)}
          </ul>
          <p>{this.state.mentor.bio}</p>
          <a href={'http://www.twitter.com/' + this.state.mentor.twitter}>Twitter</a><br />
          <a href={'http://www.linkedin.com/' + this.state.mentor.linkedin}>LinkedIn</a><br />
          <a href={'http://www.github.com/' + this.state.mentor.github}>Github</a><br />
          <a href={'http://www.facebook.com/' + this.state.mentor.facebook}>Facebook</a><br />
          <a href={'http://www.dribbble.com/' + this.state.mentor.dribbble}>Dribbble</a><br />
          {this.displayFreeSlots()}
          {}
          <MentorMeetupPopup mentorExists={0}/>
        </div>
      )
    } else {
      return (
        <h1>Este mentor não existe</h1>
      );
    }
  }
} 