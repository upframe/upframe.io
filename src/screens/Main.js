import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

// import MainMentorList from '../components/MainMentorList'
// import MainPopularTags from '../components/MainPopularTags'
// import MainSearchBar from '../components/MainSearchBar'

export default class Main extends Component {

  render() {
    return (
      <Redirect to='/login' />
      // <main id="home">
      //   <div className="container grid">
      //     <MainSearchBar />
      //     <MainPopularTags />
      //     <MainMentorList />
      //   </div>
      // </main>
    );
  }
}