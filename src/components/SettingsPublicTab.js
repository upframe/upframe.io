import React, { Component } from 'react';

import { WithContext as ReactTags } from 'react-tag-input';
import AppContext from './AppContext'
import * as Api from '../utils/Api';

const KeyCodes = {
  comma: 188,
  enter: 13
}

// const { fetch, localStorage, alert, Headers } = window

const delimiters = [KeyCodes.comma, KeyCodes.enter]

export default class SettingsPublicTab extends Component {

  static contextType = AppContext
  // tags: [
  //   { id: "Thailand", text: "Thailand" },
  //   { id: "India", text: "India" }
  // ],
  // suggestions: [
  //   { id: 'USA', text: 'USA' },
  //   { id: 'Germany', text: 'Germany' },
  //   { id: 'Austria', text: 'Austria' },
  //   { id: 'Costa Rica', text: 'Costa Rica' },
  //   { id: 'Sri Lanka', text: 'Sri Lanka' },
  //   { id: 'Thailand', text: 'Thailand' }
  // ]

  constructor(props, context) {
    super(props, context)
    console.log('Contexto')
    console.log(context)
    this.state = {
      tags: context.user.tags ? JSON.parse(context.user.tags) : [],
      favoriteLocations: context.user.favoriteLocations ? JSON.parse(context.user.favoriteLocations) : [],
      suggestions: [],
      profilePic: context.user.profilePic,
      name: context.user.name,
      location: context.user.location,
      role: context.user.role,
      company: context.user.company,
      website: context.user.website,
      twitter: context.user.twitter,
      linkedin: context.user.linkedin,
      github: context.user.github,
      facebook: context.user.facebook,
      dribbble: context.user.dribbble,
      bio: context.user.bio,
      keycode: context.user.keycode
    }
  }

  handleNameChange = (event) => { this.setState({ name : event.target.value })}
  handleLocationChange = (event) => { this.setState({ location: event.target.value })}
  handleRoleChange = (event) => { this.setState({ role: event.target.value }) }
  handleCompanyChange = (event) => { this.setState({ company: event.target.value })}
  handleWebsiteChange = (event) => { this.setState({ website: event.target.value })}
  handleTwitterChange = (event) => { this.setState({ twitter: event.target.value })}
  handleLinkedinChange = (event) => { this.setState({ linkedin: event.target.value })}
  handleGithubChange = (event) => { this.setState({ github: event.target.value })}
  handleFacebookChange = (event) => { this.setState({ facebook: event.target.value })}
  handleDribbbleChange = (event) => { this.setState({ dribbble: event.target.value })}
  handleBioChange = (event) => { this.setState({bio : event.target.value})}
  handleKeycodeChange = (event) => { this.setState({ keycode: event.target.value }) }

  handleFirstFavoriteLocationChange = (event) => {
    let newFavoriteLocations = this.state.favoriteLocations
    newFavoriteLocations[0] = event.target.value
    this.setState({ favoriteLocations: newFavoriteLocations})
  }

  handleSecondFavoriteLocationChange = (event) => {
    let newFavoriteLocations = this.state.favoriteLocations
    newFavoriteLocations[1] = event.target.value
    this.setState({ favoriteLocations: newFavoriteLocations })
  }

  handleThirdFavoriteLocationChange = (event) => {
    let newFavoriteLocations = this.state.favoriteLocations
    newFavoriteLocations[2] = event.target.value
    this.setState({ favoriteLocations: newFavoriteLocations })
  }

  openUploadDialog = () => {
    document.querySelector("input[type='file']").click()
  }

  uploadPhoto = () => {
    let fileSize = document.querySelector('input[type="file"]').files[0].size / 1048576
    if (fileSize < 5) {
      Api.uploadPhoto().then((res) => {
        console.log(res)
        if (res.ok === 1) {
          alert('File upload successful')
          this.context.setProfilePic(res.url)
          this.setState({
            profilePic: res.url
          })
        } else {
          alert('Could not update picture')
        }
      })
    } else {
      alert('Sorry but that file is too big for upload')
    }
  }

  removePhoto = () => {
    this.context.saveUserInfo({
      profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
    })
    // Api.updateUserInfo({
    //   profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
    // }).then((res) => {
    //   if (res.ok === 1) {
    //     alert('Set picture to default')
    //     this.setState({
    //       profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
    //     })
    //     this.context.saveUserInfo({ profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'})
    //   } else {
    //     alert('Could not set picture to default. Error ocurred')
    //     console.log(res)
    //   }
    // })
  }

  saveChanges = () => {
    let numOfChars = JSON.stringify(this.state.tags).length
    if (numOfChars > 254) {
      alert('Your expertise tags are too long! Delete some so we can save your info :D')
    } else {
      this.context.saveUserInfo({
        tags: JSON.stringify(this.state.tags),
        favoriteLocations: JSON.stringify(this.state.favoriteLocations),
        name: this.state.name,
        location: this.state.location,
        role: this.state.role,
        company: this.state.company,
        website: this.state.website,
        twitter: this.state.twitter,
        linkedin: this.state.linkedin,
        github: this.state.github,
        facebook: this.state.facebook,
        dribbble: this.state.dribbble,
        bio: this.state.bio,
        keycode: this.state.keycode,
        profilePic: this.state.profilePic
      })
    }
    // console.log(this.state)
    // Api.updateUserInfo({
    //   tags: JSON.stringify(this.state.tags),
    //   favoriteLocations: JSON.stringify(this.state.favoriteLocations),
    //   name: this.state.name,
    //   location: this.state.location,
    //   role: this.state.role,
    //   company: this.state.company,
    //   website: this.state.website,
    //   twitter: this.state.twitter,
    //   linkedin: this.state.linkedin,
    //   github: this.state.github,
    //   facebook: this.state.facebook,
    //   dribbble: this.state.dribbble,
    //   bio: this.state.bio,
    //   keycode: this.state.keycode
    // }).then((res) => {
    //   if (res.ok === 1) {
    //     alert('Information saved!')
    //   } else {
    //     alert('Oops, an error ocurred')
    //   }
    // })
  }

  handleDeleteTag = (i) => {
    const { tags } = this.state
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    })
  }

  handleAddTag = (tag) => {
    this.setState((state) => ({ tags: [...state.tags, tag] }))
  }

  handleDragTag = (tag, currPos, newPos) => {
    const tags = [...this.state.tags]
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: newTags })
  }

  render() {
    return (
      <div id='settings-publictab' className='tab center'>
        <div className='flex'>
          <img className='profile-pic' alt='profile-pic' src={this.state.profilePic} />
          <input id='file-select' type='file' accept='image/*' onChange={this.uploadPhoto} />
          <div id='bio'>
            <h1 className='font-weight-normal'>Profile Picture</h1>
            <p>We're big on pictures around here.</p>
            <p>Add an updated picture so you don't look like a <span role='img' aria-label='robot'>🤖</span></p>
            <button className='btn btn-round btn-primary font-weight-thin' onClick={this.openUploadDialog}>Upload new picture</button>
            <button className='btn btn-round font-weight-thin' onClick={this.removePhoto}>Remove</button>
          </div>
        </div>
        <div>
          <div className='input-group'>
            <label htmlFor='name'>Your Name</label>
            <input type='text' onChange={this.handleNameChange} value={this.state.name} id='name' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='location'>Location</label>
            <input type='text' onChange={this.handleLocationChange} value={this.state.location} id='location' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='role'>Your Position</label>
            <input type='text' onChange={this.handleRoleChange} value={this.state.role} id='role' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='company'>Company</label>
            <input type='text' onChange={this.handleCompanyChange} value={this.state.company} id='company' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='website'>Website</label>
            <input type='text' onChange={this.handleWebsiteChange} value={this.state.website} id='website' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='twitter'>Twitter</label>
            <input type='text' onChange={this.handleTwitterChange} value={this.state.twitter} id='twitter' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='linkedin'>LinkedIn</label>
            <input type='text' onChange={this.handleLinkedinChange} value={this.state.linkedin} id='linkedin' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='github'>Github</label>
            <input type='text' onChange={this.handleGithubChange} value={this.state.github} id='github' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='facebook'>Facebook</label>
            <input type='text' onChange={this.handleFacebookChange} value={this.state.facebook} id='facebook' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='dribbble'>Dribbble</label>
            <input type='text' onChange={this.handleDribbbleChange} value={this.state.dribbble} id='dribbble' maxLength='50' />
          </div>
          <div className='input-group'>
            <label htmlFor='bio'>Biography</label>
            <textarea rows='5' type='text' onChange={this.handleBioChange} value={this.state.bio} id='bio' maxLength='600' />
          </div>
          <div className='input-group'>
            https://connect.upframe.io/<input type='text' onChange={this.handleKeycodeChange} value={this.state.keycode} maxLength='50'/>
          </div>
          <div className='input-group'>
            <h2>Your Skills</h2>
            <p>Add up to 7 skills to display in your profile.</p>
            <ReactTags tags={this.state.tags}
              autofocus={false}
              handleDelete={this.handleDeleteTag}
              handleAddition={this.handleAddTag}
              handleDrag={this.handleDragTag}
              delimiter={delimiters} />
          </div>

          <div className='input-group'>
            <h2>Favorite Locations</h2>
            <label htmlFor='location-1'>First location</label>
            <input type='text' onChange={this.handleFirstFavoriteLocationChange} value={this.state.favoriteLocations[0]} id='location-1' />
            <label htmlFor='location-2'>Second location</label>
            <input type='text' onChange={this.handleSecondFavoriteLocationChange} value={this.state.favoriteLocations[1]} id='location-2'/>
            <label htmlFor='location-3'>Third location</label>
            <input type='text' onChange={this.handleThirdFavoriteLocationChange} value={this.state.favoriteLocations[2]} id='location-3'/>
          </div>

          <div className='input-group'>
            <button className='btn btn-fill btn-primary block center' onClick={this.saveChanges}>Save changes</button>
          </div>
        </div>
      </div>
    )
  }
}