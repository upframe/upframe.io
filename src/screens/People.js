import React, { Component } from 'react';
import * as Api from '../utils/Api';
import MentorMeetupPopup from '../components/MentorMeetupPopup';

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
    Api.getFreeSlots().then((res) => {
      console.log(res)
      //res.slots()
    })
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
            tags: res.mentor.tags ? JSON.parse(res.mentor.tags) : []
          }
        })
      }
    })
  }

  mentorTagsToElement = (tags) => {
    return tags.map((tag) => {
      return (
        <li className='mentor-tags-list-element'>{tag.text}</li>
      )
    })
  }

  selectSlot = () => {

  }

  render() {
    console.log(this.state.mentor.tags)
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
          <p>Aqui ficam os slots</p>
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