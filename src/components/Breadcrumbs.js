import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Breadcrumbs extends Component {
  constructor() {
    super()

    this.state = {
      path: window.location.pathname
    }
  }

  returnLinks() {
    let list = this.state.path.split('/')

    if(list.length === 2) {
      let name = list[1].replace('.', ' ')
      
      return (
        <Link className="font-weight-bold" to={this.state.path}><li>{name}</li></Link>
      )
    }
  }

  render() {
    return (
      <ul className="breadcrumbs">
        <Link to="/"><li>Directory</li></Link>
        {this.returnLinks()}
      </ul>
    )
  }
}