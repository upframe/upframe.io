import React, { Component } from 'react';

export default class People extends Component {
  //Someone accessed the website with a /people/* something.
  //Hypothesis:
  // /expertise-name - render resultado da pesquisa expertise
  // /keycode - render profile
  // /company - everyone who works at company

  render() {
    return (
      <h1>Sou um People</h1>
    );
  }
}