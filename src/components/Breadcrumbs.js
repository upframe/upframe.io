import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import AppContext from './AppContext'

export default class Breadcrumbs extends Component {
  static contextType = AppContext

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
        {/* <Link to="/"><li>Directory ></li></Link> */}
        <li>Directory</li>
        <li>People</li>
        <li className="font-weight-bold">{this.props.name}</li>
        {/* {this.returnLinks()} */}
      </ul>
    )
  }
}