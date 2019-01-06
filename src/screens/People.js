import React, { Component } from 'react';
import * as Api from '../utils/Api';
import MentorMeetupPopup from '../components/MentorMeetupPopup';

export default class People extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedStartTime: 0,
      selectedId: 0,
      showPopup: 0,
      mentorExists: 0,
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
        freeSlots: [],
        favoriteLocations: ['Startup Lisboa', 'Arabesco']
      }
    }
  }

  componentDidMount() {
    // this.setState({ //DEBUG
    //   mentorExists: 1,
    //   mentor: {
    //     bio: 'res.mentor.bio',
    //     company: 'res.mentor.company',
    //     dribbble: 'res.mentor.dribbble',
    //     email: 'res.mentor.email',
    //     facebook: 'res.mentor.facebook',
    //     github: 'res.mentor.github',
    //     linkedin: 'res.mentor.linkedin',
    //     location: 'res.mentor.location',
    //     name: 'res.mentor.name',
    //     profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png',
    //     role: 'res.mentor.role',
    //     twitter: 'res.mentor.twitter',
    //     uid: 'asd',
    //     website: 'asd',
    //     tags: [],
    //     freeSlots: [
    //       {
    //         start: new Date(),
    //         end: new Date(),
    //         sid: '123'
    //       }
    //     ],
    //     favoriteLocations: ['Startup Lisboa', 'Arabesco']
    //   }
    // })
    let keycode = window.location.pathname.split('/')[1]
    Api.getMentorInfo(keycode).then((res) => {
      if (res.message) {
        this.setState({
          mentorExists: 0
        })
      } else {
        this.setState({
          mentorExists: 1,
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
            freeSlots: res.mentor.slots,
            favoriteLocations: res.mentor.locations ? JSON.parse(res.mentor.locations) : []
          }
        })
      }
    })
  }

  selectSlot = (event) => {
    this.setState({
      selectedStartTime: this.state.mentor.freeSlots.find(slot => slot.sid === event.target.id).start,
      selectedId: event.target.id,
      showPopup: 1
    })
  }

  hidePopup = () => {
    this.setState({
      showPopup: 0
    })
  }

  render() {
    if (this.state.mentorExists === 1) {
      return (
        <div>
          {this.state.showPopup === 1 
            ? <MentorMeetupPopup 
                show={this.state.showPopup} 
                hidePopup={this.hidePopup} 
                sid={this.state.selectedId}
                locations={this.state.mentor.favoriteLocations}
                startTime={this.state.selectedStartTime}/> 
            : null
          }
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
          <a href={'http://www.dribbble.com/' + this.state.mentor.dribbble}>Dribbble</a>
          {this.displayFreeSlots()}
        </div>
      )
    } else {
      return (
        <h1>Este mentor não existe</h1>
      );
    }
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
          <div onClick={this.selectSlot} id={slot.sid}>
            <p id={slot.sid}>{startDate.getDate()}-{startDate.getMonth()}-{startDate.getUTCFullYear()} @ {startDate.getHours()}:{startDate.getMinutes()}</p>
          </div>
        )
      })
    }
  }

} 