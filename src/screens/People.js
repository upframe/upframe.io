import React, { Component } from 'react';
import * as Api from '../utils/Api';
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
        website: 'Loading'
      }
    }
  }

  componentDidMount() {
    let keycode = window.location.pathname.split('/')[2]
    Api.getMentorInfo(keycode).then((res) => {
      console.log(res)
      if (res.ok === 0) {
        this.setState({
          mentorExists: 0
        })
      } else {
        this.setState({
          mentor: res.mentor
        })
      }
    })
  }

  render() {
    if (this.state.mentorExists === 1) {
      return (
        <div>
          <img src={this.state.mentor.profilePic} alt='Profile' />
          <p>{this.state.mentor.name}</p>
          <p>{this.state.mentor.role} at {this.state.mentor.company}</p>
          <p>{this.state.mentor.location}</p>
          <p>Aqui ficam as tags</p>
          <p>{this.state.mentor.bio}</p>
          <a href={'http://www.twitter.com/' + this.state.mentor.twitter}>Twitter</a><br />
          <a href={'http://www.linkedin.com/' + this.state.mentor.linkedin}>LinkedIn</a><br />
          <a href={'http://www.github.com/' + this.state.mentor.github}>Github</a><br />
          <a href={'http://www.facebook.com/' + this.state.mentor.facebook}>Facebook</a><br />
          <a href={'http://www.dribbble.com/' + this.state.mentor.dribbble}>Dribbble</a><br />
          <p>Aqui ficam os slots</p>
        </div>
      )
    } else {
      return (
        <h1>Este mentor não existe</h1>
      );
    }
  }
} 