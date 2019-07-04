import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Api from '../utils/Api'

import AppContext from '../components/AppContext'
import Breadcrumbs from '../components/Breadcrumbs'
import MentorMeetupPopup from '../components/MentorMeetupPopup'
import MentorRequestPopup from '../components/MentorRequestPopup';

export default class People extends Component {

  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      selectedSlot: '',
      showPopup: 0,
      showRequestPopup: 0,
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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.keycode !== this.props.match.params.keycode) {
      this.setState({
        mentorExists: 0
      }, () => {
        Api.getMentorInfo(this.props.match.params.keycode).then((res) => {
          if (res.ok === 0) {
            this.setState({
              mentorExists: 2
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
                favoriteLocations: res.mentor.favoriteLocations ? JSON.parse(res.mentor.favoriteLocations) : []
              }
            })
          }
        })
      })
    }
  }

  componentDidMount() {
    let keycode = window.location.pathname.split('/')[1]
    Api.getMentorInfo(keycode).then((res) => {
      if (res.ok === 0) {
        this.setState({
          mentorExists: 2
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
            favoriteLocations: res.mentor.favoriteLocations ? JSON.parse(res.mentor.favoriteLocations) : []
          }
        })
      }
    })
  }

  copyUrlToClipboard = () => {
    if (!navigator.clipboard) {
      this.fallbackCopyUrlToClipboard('https://upfra.me/' + this.props.match.params.keycode);
      return
    }
    navigator.clipboard.writeText('https://upfra.me/' + this.props.match.params.keycode)
    this.context.showToast('URL Copied')
  }

  fallbackCopyUrlToClipboad = (text) => {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.context.showToast('URL Copied')
    } catch (err) {
      // Error
      this.context.showToast('Could not copy URL')
    }
    document.body.removeChild(textArea);
  }

  selectSlot = (event) => {
    let target = event.target
    while(target.parentNode && !target.dataset.id && !target.classList.contains('mentor-card-slot')) target = target.parentNode
    this.setState({ 
      selectedSlot: target.dataset.id,
      showPopup: 1
    })
  }

  showRequestPopup = (event) => {
    this.setState({
      showRequestPopup: 1
    })
  }

  hideRequestPopup = () => {
    this.setState({
      showRequestPopup: 0
    })
  }

  hidePopup = () => {
    this.setState({
      showPopup: 0
    })
  }

  mentorTagsToElement = (tags) => {
    return tags.map((tag, i) => {
      return (
        <li key={i} className='flex alignitems-center mentor-tag'>{tag.text}</li>
      )
    })
  }

  displayFreeSlots = () => {
    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    if (this.state.mentor.freeSlots) {
      return this.state.mentor.freeSlots.map((slot, i) => {
        let startDate = new Date(slot.start)
        return (
          <li className="mentor-card-slot flex justifycontent-center" data-id={slot.sid} key={slot.sid} onClick={this.selectSlot}>
            <div className='flex alignitems-center'>
              <div>
                <span id='month' className='fontweight-bold text-uppercase'>{months[startDate.getMonth()]}</span>
                <span id="day">{startDate.getDate()}</span>
              </div>
              <div>
                <span id='time'>{days[startDate.getDay()]} {startDate.getHours() > 12 ? startDate.getHours() - 12: startDate.getHours()}:{startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes() } {startDate.getHours() >= 12 ? 'PM' : 'AM'}</span>
              </div>
            </div>
          </li>
        )
      })
      
    }
  }

  render() {
    if (this.state.mentorExists === 1) {
      return (
        <main id='people' className='container'>
          {this.state.showPopup === 1
              ?
              <MentorMeetupPopup
                hidePopup={this.hidePopup}
                sid={this.state.selectedSlot}
                locations={this.state.mentor.favoriteLocations}
                name={this.state.mentor.name} />
              :
              null
          }
          {this.state.showRequestPopup === 1
            ?
            <MentorRequestPopup 
              hideRequestPopup={this.hideRequestPopup}
            />
            :
            null
          }

          <Helmet>
            <title>{this.state.mentor.name} | Upframe</title>
            <meta property="og:title" content={`${this.state.mentor.name} | Upframe`}></meta>
            <meta property="og:description" content={`Setup a meetup with ${this.state.mentor.name}`}></meta>
            <meta property="og:image" content={this.state.mentor.profilePic}></meta>
            <meta name="twitter:card" content="summary_large_image"></meta>
          </Helmet>
          
          <Breadcrumbs name={this.state.mentor.name} />
          <div className='card mentor-card flex justifycontent-center'>
            <div>
              <div className='flex justifycontent-center'>
                <img className="mentor-profilepic" src={this.state.mentor.profilePic} alt='Profile'/>
              </div>
              <div className='mentor-info'>
                <h1 id='name' className="font-150 fontweight-medium">{this.state.mentor.name}</h1>
                <p id='role-company'>{this.state.mentor.role} at {this.state.mentor.company}</p>
                <p id='location' className='flex alignitems-center'><img src='/location.svg' alt='location' className="location-icon"></img>{this.state.mentor.location}</p>
                <ul id='tags' className='flex'>
                  {this.mentorTagsToElement(this.state.mentor.tags)}
                </ul>
                {this.state.mentor.bio.split('\n').map((element) => {
                  return (
                    <p id='bio'>{element}</p>
                  )
                })}
              </div>
            </div>
            
            <span className="hr"></span>

            <div>
              {/*<a href={'http://www.twitter.com/' + this.state.mentor.twitter}>Twitter</a><br />
              <a href={'http://www.linkedin.com/' + this.state.mentor.linkedin}>LinkedIn</a><br />
              <a href={'http://www.github.com/' + this.state.mentor.github}>Github</a><br />
              <a href={'http://www.facebook.com/' + this.state.mentor.facebook}>Facebook</a><br />
              <a href={'http://www.dribbble.com/' + this.state.mentor.dribbble}>Dribbble</a>*/}
              <ul className='mentor-card-slots grid'>
                {this.displayFreeSlots()}
                <button id='request' className='btn btn-primary btn-fill' onClick={this.showRequestPopup}>Request</button>
              </ul>
            </div>
          </div>
          <div className='copy-url' onClick={this.copyUrlToClipboard}>
          </div>
        </main>
      )
    } else if (this.state.mentorExists === 2)  {
      return (
        <main id='people' className='container'>
          <h1>Upframe 404 - Mentor not found <span role="img" aria-label="sad emoji">😔</span></h1>
        </main>
      );
    } else {
      return (
        <div className="center-container">
          <div className="loader"></div>
        </div>
      )
    }
  }

} 