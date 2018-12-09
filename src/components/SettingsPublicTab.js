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
          /**
           * we can't load the tags since the backend app
           * isn't yet returning them
           */
          //tags: JSON.parse(res.user.tags),
          tags: [],
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

  openUploadDialog = () => {
    document.querySelector("input[type='file']").click()
  }
  
  uploadPhoto = () => {
    Api.uploadPhoto().then((res) => {
      if (res.ok === 1) {
        //upload successful
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
    //https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png
    Api.updateUserInfo({
      profilePic: 'https://s3.eu-west-2.amazonaws.com/connect-api-profile-pictures/default.png'
    }).then(res => {
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
    Api.updateUserInfo(this.state).then(res => {
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
    this.setState(state => ({ tags: [...state.tags, tag] }))
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
      <div>
        <div>
          <img alt='profile-pic' src={this.state.profilePic} />
          <input id='file-select' type='file' accept='image/*' onChange={this.uploadPhoto} />
          <p>We're big on pictures around here.</p>
          <p>Add an updated picture so you don't like a <span role='img' aria-label='robot'>🤖</span></p>
          <button onClick={this.openUploadDialog}>Upload new photo</button>
          <button onClick={this.removePhoto}>Remove</button>
        </div>
        <div>
          <p>Your name</p>
          <input type='text' onChange={this.handleNameChange} value={this.state.name}/>
          <p>Location</p>
          <input type='text' onChange={this.handleLocationChange} value={this.state.location}/>
          <p>Your role</p>
          <input type='text' onChange={this.handleRoleChange} value={this.state.role}/>
          <p>Company</p>
          <input type='text' onChange={this.handleCompanyChange} value={this.state.company}/>
          <p>Website</p>
          <input type='text' onChange={this.handleWebsiteChange} value={this.state.website}/>
          <p>Twitter</p>
          <input type='text' onChange={this.handleTwitterChange} value={this.state.twitter}/>
          <p>LinkedIn page</p>
          <input type='text' onChange={this.handleLinkedinChange} value={this.state.linkedin}/>
          <p>Github</p>
          <input type='text' onChange={this.handleGithubChange} value={this.state.github}/>
          <p>Facebook</p>
          <input type='text' onChange={this.handleFacebookChange} value={this.state.facebook}/>
          <p>Dribbble</p>
          <input type='text' onChange={this.handleDribbbleChange} value={this.state.dribbble}/>
          <p>Bio</p>
          <textarea rows='5' type='text' onChange={this.handleBioChange} value={this.state.bio}/>
          <div>
            https://connect.upframe.io/people/<input type='text' onChange={this.handleKeycodeChange} value={this.state.keycode}/>
          </div>
        </div>
        <div>
          <h2>Your skills</h2>
          <p>Add up to 7 skills to display in your profile.</p>
          <ReactTags tags={this.state.tags}
            autofocus={false}
            handleDelete={this.handleDeleteTag}
            handleAddition={this.handleAddTag}
            handleDrag={this.handleDragTag}
            delimiter={delimiters} />
        </div>
        <div>
          <button onClick={this.saveChanges}>Save changes</button>
        </div>
      </div>
    )
  }
}