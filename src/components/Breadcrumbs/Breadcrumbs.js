import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

export default class Breadcrumbs extends PureComponent {
  render() {
    return (
      <ul className="breadcrumbs">
        <li>
          <Link to="/">Directory</Link>
        </li>
        <li>
          <Link to="/">People</Link>
        </li>
        <li className="font-weight-bold">{this.props.name}</li>
      </ul>
    )
  }
}
