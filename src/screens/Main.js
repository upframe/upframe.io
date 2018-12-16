import React, { Component } from 'react';

import MainMentorList from '../components/MainMentorList'
import MainPopularTags from '../components/MainPopularTags'
import MainSearchBar from '../components/MainSearchBar'
import MainSideAd from '../components/MainSideAd'

export default class Main extends Component {
  render() {
    return (
      <main>
        <div className="container">
          <MainSearchBar />
          <MainPopularTags />
          <MainMentorList />
          <MainSideAd />
        </div>
      </main>
    );
  }
}