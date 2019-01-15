import React, { Component } from 'react';

import { WithContext as ReactTags } from 'react-tag-input';
import * as Api from '../utils/Api';

const KeyCodes = {
  comma: 188,
  enter: 13
}

// const { fetch, localStorage, alert, Headers } = window

const delimiters = [KeyCodes.comma, KeyCodes.enter]

export default class SettingsPublicTab extends Component {

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

  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      favoriteLocations: [],
      suggestions: [],
      profilePic : '',
      name : '',
      location : '',
      role : '',
      company : '',
      website : '',
      twitter : '',
      linkedin : '',
      github : '',
      facebook : '',
      dribbble : '',
      bio : '',
      keycode: ''
    }
  }

  componentDidMount() {
    //Vamos buscar a info e dar load da mesma
    Api.getUserInfo().then((res) => {
      console.log(res)
      if (res.ok === 1) {
        let newState = {
          tags: res.user.tags ? JSON.parse(res.user.tags) : [],
          favoriteLocations: res.user.favoriteLocations ? JSON.parse(res.user.favoriteLocations) : [],
          profilePic: res.user.profilePic,
          name: res.user.name,
          location: res.user.location,
          role: res.user.role,
          company: res.user.company,
          website: res.user.website,
          twitter: res.user.twitter,
          linkedin: res.user.linkedin,
          github: res.user.github,
          facebook: res.user.facebook,
          dribbble: res.user.dribbble,
          bio: res.user.bio,
          keycode: res.user.keycode
        }
        this.setState(newState)
      } else {
        alert('Could not fetch your latest info. Something might be wrong on our side')
      }
    })
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
    Api.uploadPhoto().then((res) => {
      if (res.ok === 1) {
        alert('File upload successful')
        this.setState({
          profilePic: res.url
        })
      } else {
        alert('Could not update picture')
      }
    })
  }

  removePhoto = () => {
    Api.updateUserInfo({
      profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
    }).then((res) => {
      if (res.ok === 1) {
        alert('Set picture to default')
        this.setState({
          profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
        })
      } else {
        alert('Could not set picture to default. Error ocurred')
        console.log(res)
      }
    })
  }

  saveChanges = () => {
    console.log(this.state)
    Api.updateUserInfo({
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
      keycode: this.state.keycode
    }).then((res) => {
      if (res.ok === 1) {
        alert('Information saved!')
      } else {
        alert('Oops, an error ocurred')
      }
    })
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
      <div id='settings-publictab' class='tab center'>
        <div className='flex'>
          <img className='profile-pic' alt='profile-pic' src={this.state.profilePic} />
          <input id='file-select' type='file' accept='image/*' onChange={this.uploadPhoto} />
          <div id='bio'>
            <h1 className='font-weight-normal'>Profile Picture</h1>
            <p>We're big on pictures around here.</p>
            <p>Add an updated picture so you don't like a <span role='img' aria-label='robot'>🤖</span></p>
            <button className='btn btn-round btn-primary' onClick={this.openUploadDialog}>Upload new picture</button>
            <button className='btn btn-round' onClick={this.removePhoto}>Remove</button>
          </div>
        </div>
        <div>
          <div className='input-group'>
            <label for='name'>Your name</label>
            <input type='text' onChange={this.handleNameChange} value={this.state.name} id='name' />
          </div>
          <div className='input-group'>
            <label for='location'>Location</label>
            <input type='text' onChange={this.handleLocationChange} value={this.state.location} id='location' />
          </div>
          <div className='input-group'>
            <label for='role'>Your role</label>
            <input type='text' onChange={this.handleRoleChange} value={this.state.role} id='role' />
          </div>
          <div className='input-group'>
            <label for='company'>Company</label>
            <input type='text' onChange={this.handleCompanyChange} value={this.state.company} id='company' />
          </div>
          <div className='input-group'>
            <label for='website'>Website</label>
            <input type='text' onChange={this.handleWebsiteChange} value={this.state.website} id='website'/>
          </div>
          <div className='input-group'>
            <label for='twitter'>Twitter</label>
            <input type='text' onChange={this.handleTwitterChange} value={this.state.twitter} id='twitter' />
          </div>
          <div className='input-group'>
            <label for='linkedin'>LinkedIn page</label>
            <input type='text' onChange={this.handleLinkedinChange} value={this.state.linkedin} id='linkedin' />
          </div>
          <div className='input-group'>
            <label for='github'>Github</label>
            <input type='text' onChange={this.handleGithubChange} value={this.state.github} id='github' />
          </div>
          <div className='input-group'>
            <label for='facebook'>Facebook</label>
            <input type='text' onChange={this.handleFacebookChange} value={this.state.facebook} id='facebook' />
          </div>
          <div className='input-group'>
            <label for='dribbble'>Dribbble</label>
            <input type='text' onChange={this.handleDribbbleChange} value={this.state.dribbble} id='dribbble' />
          </div>
          <div className='input-group'>
            <label for='bio'>Bio</label>
            <textarea rows='5' type='text' onChange={this.handleBioChange} value={this.state.bio} id='bio' />
          </div>
          <div className='input-group'>
            https://connect.upframe.io/<input type='text' onChange={this.handleKeycodeChange} value={this.state.keycode}/>
          </div>
          <div className='input-group'>
            <h2>Your skills</h2>
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
            <label for='location-1'>First location</label>
            <input type='text' onChange={this.handleFirstFavoriteLocationChange} value={this.state.favoriteLocations[0]} id='location-1' />
            <label for='location-2'>Second location</label>
            <input type='text' onChange={this.handleSecondFavoriteLocationChange} value={this.state.favoriteLocations[1]} id='location-2'/>
            <label for='location-3'>Third location</label>
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