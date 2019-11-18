import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import * as moment from 'moment'

import Api from '../../utils/Api'

import AppContext from '../../components/AppContext'
import Breadcrumbs from '../../components/Breadcrumbs'
import MentorMeetupPopup from './MentorMeetupPopup'
import MentorRequestPopup from './MentorRequestPopup'

import {RecommendationCard} from '../../components'
import recommendationList from '../common/recommendationList'
import {ProfilePicture} from '../../components'

const BioWithLinks = ({ bio }) => {
  let paragraphs = bio.split('\n')

  return (
    <React.Fragment>
      {paragraphs.map((p, index) => {
        return (
          <p
            className={
              paragraphs[index + 1] === '' && paragraphs[index] !== ''
                ? 'line-break'
                : ''
            }
          >
            {p}
          </p>
        )
      })}
    </React.Fragment>
  )
}

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
        pictures: {},
        role: 'Loading',
        twitter: 'Loading',
        uid: 'Loading',
        website: 'Loading',
        tags: [],
        freeSlots: [],
        favoriteLocations: ['Startup Lisboa', 'Arabesco'],
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.keycode !== this.props.match.params.keycode) {
      this.setState(
        {
          mentorExists: 0,
        },
        () => {
          Api.getMentorInfo(this.props.match.params.keycode).then(res => {
            if (res.ok === 0) {
              this.setState({
                mentorExists: 2,
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
                  pictures: res.mentor.pictures,
                  role: res.mentor.role,
                  twitter: res.mentor.twitter,
                  uid: res.mentor.uid,
                  website: res.mentor.website,
                  tags: res.mentor.tags ? JSON.parse(res.mentor.tags) : [],
                  freeSlots: res.mentor.slots,
                  favoriteLocations: res.mentor.favoriteLocations
                    ? JSON.parse(res.mentor.favoriteLocations)
                    : [],
                },
              })
            }
          })
        }
      )
    }
  }

  componentDidMount() {
    let keycode = window.location.pathname.split('/')[1]
    Api.getMentorInfo(keycode).then(res => {
      if (res.ok === 0) {
        this.setState({
          mentorExists: 2,
        })
      } else {
        this.setState({
          mentorExists: 1,
          mentor: {
            bio: res.mentor.bio,
            company: res.mentor.company,
            dribbble: res.mentor.dribbble,
            email: res.mentor.email,
            github: res.mentor.github,
            linkedin: res.mentor.linkedin,
            location: res.mentor.location,
            name: res.mentor.name,
            keycode: res.mentor.keycode,
            profilePic: res.mentor.profilePic,
            pictures: res.mentor.pictures,
            role: res.mentor.role,
            facebook: res.mentor.facebook,
            twitter: res.mentor.twitter,
            uid: res.mentor.uid,
            website: res.mentor.website,
            tags: res.mentor.tags ? JSON.parse(res.mentor.tags) : [],
            freeSlots: res.mentor.slots,
            favoriteLocations: res.mentor.favoriteLocations
              ? JSON.parse(res.mentor.favoriteLocations)
              : [],
          },
        })
      }
    })
  }

  copyUrlToClipboard = () => {
    if (!navigator.clipboard) {
      this.fallbackCopyUrlToClipboard(
        'https://upfra.me/' + this.props.match.params.keycode
      )
      return
    }
    navigator.clipboard.writeText(
      'https://upfra.me/' + this.props.match.params.keycode
    )
    this.context.showToast('URL Copied')
  }

  fallbackCopyUrlToClipboad = text => {
    let textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      this.context.showToast('URL Copied')
    } catch (err) {
      // Error
      this.context.showToast('Could not copy URL')
    }
    document.body.removeChild(textArea)
  }

  selectSlot = event => {
    let target = event.target
    while (
      target.parentNode &&
      !target.dataset.id &&
      !target.classList.contains('mentor-card-slot')
    )
      target = target.parentNode
    this.setState({
      selectedSlot: target.dataset.id,
      showPopup: 1,
    })
  }

  showRequestPopup = event => {
    this.setState({
      showRequestPopup: 1,
    })
  }

  hideRequestPopup = () => {
    this.setState({
      showRequestPopup: 0,
    })
  }

  hidePopup = () => {
    this.setState({
      showPopup: 0,
    })
  }

  mentorTagsToElement = tags => {
    return tags.map((tag, i) => {
      return (
        <li key={i} className="flex alignitems-center mentor-tag">
          {tag.text}
        </li>
      )
    })
  }

  displayFreeSlots = () => {
    if (this.state.mentor.freeSlots) {
      return this.state.mentor.freeSlots.map((slot, i) => {
        // let startDate = new Date(slot.start)

        // Transform dates from UTC to local time
        let utcOffset = new Date().getTimezoneOffset()
        let startDate = moment.utc(slot.start).utcOffset(-utcOffset)

        return (
          <li
            className="mentor-card-slot flex justifycontent-center"
            data-id={slot.sid}
            key={slot.sid}
            onClick={this.selectSlot}
          >
            <div className="flex alignitems-center">
              <div>
                <span id="month" className="fontweight-bold text-uppercase">
                  {startDate.format('MMM')}
                </span>
                <span id="day">{startDate.format('D')}</span>
              </div>
              <div>
                <span id="time">{startDate.format('ddd h:mm A')}</span>
              </div>
            </div>
          </li>
        )
      })
    }
  }

  checkRecommender = () => {
    if (recommendationList[this.state.mentor.keycode]) {
      return (
        <RecommendationCard
          recommendations={recommendationList[`${this.state.mentor.keycode}`]}
        />
      )
    }
  }

  render() {
    if (this.state.mentorExists === 1) {
      return (
        <main id="people" className="container">
          {this.state.showPopup === 1 ? (
            <MentorMeetupPopup
              hidePopup={this.hidePopup}
              sid={this.state.selectedSlot}
              locations={this.state.mentor.favoriteLocations}
              name={this.state.mentor.name}
            />
          ) : null}
          {this.state.showRequestPopup === 1 ? (
            <MentorRequestPopup
              hideRequestPopup={this.hideRequestPopup}
              name={this.state.mentor.name.split(' ')[0]}
            />
          ) : null}

          <Helmet>
            <title>{this.state.mentor.name} | Upframe</title>
            <meta
              property="og:url"
              content={`${window.location.origin}/${this.state.mentor.keycode}`}
            ></meta>
            <meta
              property="og:title"
              content={`${this.state.mentor.name} | Upframe`}
            ></meta>
            <meta
              property="og:description"
              content={`Set up a meetup with ${
                this.state.mentor.name
              }. ${this.state.mentor.bio.substr(0, 128)}...`}
            ></meta>
            <meta
              property="og:image"
              content={this.state.mentor.profilePic}
            ></meta>
            <meta name="twitter:card" content="summary_large_image"></meta>
          </Helmet>

          <Breadcrumbs name={this.state.mentor.name} />
          <div className="card mentor-card flex">
            <div id="main-info">
              <div className="flex flex-column">
                <ProfilePicture
                  imgs={
                    this.state.mentor.pictures &&
                    Object.entries(this.state.mentor.pictures).length
                      ? this.state.mentor.pictures
                      : this.state.mentor.profilePic
                  }
                  className="mentor-profilepic"
                  name={this.state.mentor.name}
                  size="13rem"
                />

                <h1 id="name" className="font-150 fontweight-medium">
                  {this.state.mentor.name}
                </h1>
                <p id="company-role">
                  {this.state.mentor.role} at {this.state.mentor.company}
                </p>
                <p id="location" className="flex alignitems-center">
                  <svg
                    className="mr1"
                    width="15px"
                    height="22px"
                    viewBox="0 0 15 22"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Location</title>
                    <desc>Created with Sketch.</desc>
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="currentColor"
                      fillRule="evenodd"
                    >
                      <g
                        id="Mentor-Profile"
                        transform="translate(-569.000000, -342.000000)"
                        fill="currentColor"
                        fillRule="nonzero"
                      >
                        <g
                          id="Location"
                          transform="translate(569.000000, 342.000000)"
                        >
                          <path
                            d="M7.5021453,0 C3.3616354,0.00461630452 0.00592507486,3.32328179 8.94183898e-05,7.4192381 C-0.0168548072,12.223619 2.37439903,17.0782857 7.10607403,21.8428571 C7.20525026,21.9432866 7.34115844,21.9999351 7.48308305,22 C7.62500766,21.9999351 7.76091584,21.9432866 7.86009207,21.8428571 C12.6087113,17.0782857 15.0105553,12.2257143 14.9999651,7.4192381 C14.9941351,3.32491501 11.6410009,0.00692373357 7.5021453,0 Z M7.48520108,20.724 C3.20466609,16.288381 1.04215929,11.8150476 1.05910352,7.4192381 C1.12279233,3.94474998 3.98822844,1.16108051 7.50108629,1.16108051 C11.0139441,1.16108051 13.8793803,3.94474998 13.9430691,7.4192381 C13.9515412,11.8150476 11.7805623,16.288381 7.48520108,20.724 Z"
                            id="Shape"
                          ></path>
                          <circle
                            id="Oval"
                            transform="translate(7.500000, 7.500000) rotate(-13.280000) translate(-7.500000, -7.500000) "
                            cx="7.5"
                            cy="7.5"
                            r="3.5"
                          ></circle>
                        </g>
                      </g>
                    </g>
                  </svg>

                  {this.state.mentor.location}
                </p>

                <div className="mt2" id="social-networks">
                  <div className="flex">
                    {this.state.mentor.facebook ? (
                      <a
                        href={
                          this.state.mentor.facebook.includes('facebook.com')
                            ? this.state.mentor.facebook
                            : `https://facebook.com/${this.state.mentor.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/media/facebook.jpg"
                          alt="Facebook profile"
                        ></img>
                      </a>
                    ) : null}

                    {this.state.mentor.twitter ? (
                      <a
                        href={
                          this.state.mentor.twitter.includes('twitter.com')
                            ? this.state.mentor.twitter
                            : `https://twitter.com/${this.state.mentor.twitter}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/media/twitter.jpg"
                          alt="Twitter profile"
                        ></img>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div id="additional-info">
              <h2 className="color-black ma0">About me</h2>
              <div id="bio">
                <BioWithLinks bio={this.state.mentor.bio} />
              </div>

              <div id="tags">
                <h2 className="color-black ma0">I can advise you on</h2>

                <ul id="tags" className="flex">
                  {this.mentorTagsToElement(this.state.mentor.tags)}
                </ul>
              </div>
            </div>
          </div>

          <div className="card mt2" id="office-hours">
            <h2 className="ma0">Book a meetup with me</h2>

            <p className="color-black mt1">
              Upframe one-on-one mentoring sessions come in two flavours, video
              chats or in-person meetings. You can also send me a direct
              message.
            </p>

            <div>
              <ul className="mentor-card-slots grid">
                {this.displayFreeSlots()}
                <button
                  id="request"
                  className="btn btn-primary btn-fill"
                  onClick={this.showRequestPopup}
                >
                  Message
                </button>
              </ul>
            </div>
          </div>

          {this.checkRecommender()}
        </main>
      )
    } else if (this.state.mentorExists === 2) {
      return (
        <main id="people" className="container">
          <h1>
            Upframe 404 - Mentor not found{' '}
            <span role="img" aria-label="sad emoji">
              😔
            </span>
          </h1>
        </main>
      )
    } else {
      return (
        <div className="center-container">
          <div className="loader"></div>
        </div>
      )
    }
  }
}
