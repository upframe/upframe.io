import React, { PureComponent } from 'react'

export default class Breadcrumbs extends PureComponent {

  render() {
    return (
      <ul className="breadcrumbs">
        <li>Directory</li>
        <li>People</li>
        <li className="font-weight-bold">{this.props.name}</li>
      </ul>
    )
  }
}