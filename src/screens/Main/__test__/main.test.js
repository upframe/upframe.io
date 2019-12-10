import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from '../Main'
import MainCategories from '../MainCategories'
import MainMentorList from '../MainMentorList/MainMentorList'
import MentorCard from '../MentorCard'
import AppContext from '../../../components/AppContext'
import Api from '../../../utils/Api'

Api.getAllMentors = jest.fn(() => Promise.resolve({ mentors: mentors }))

const mentors = [
  {
    bio:
      "Product person with a lot to learn.  I'm not going to pretend I have answers but I'm happy to guide you and connect you with people who can help you.",
    company: 'Upframe',
    keycode: 'malik',
    name: 'Malik Piara',
    pictures: {},
    profilePic:
      'https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg',
    role: 'Product Owner',
    slots: [],
    tags: '',
    uid: '3a611becd332813182559cf781f32ae18caa09c1',
  },
  {
    bio: 'test.',
    company: 'Upframe',
    keycode: 'yoav',
    name: 'yoav Piara',
    pictures: {},
    profilePic:
      'https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg',
    role: 'Product Owner',
    slots: [],
    tags: '',
    uid: '3a611bead332813182559cf781f32ae18caa09c1',
  },
]

const renderMainPage = (mockIsSearchQuery,mockSetSearchQuery,mockSearchQuery) => {

 


  return render(
    <Router>
      <AppContext.Provider
        value={{
          startSearchQuery: mockIsSearchQuery,
          setSearchQuery: mockSetSearchQuery,
          searchQuery:mockSearchQuery
        }}
      >
        <Main >
          <MainCategories />
          <MainMentorList >
            <MentorCard />
          </MainMentorList>
        </Main>
      </AppContext.Provider>
    </Router>
  )
}

describe('when page render', () => {

const mockIsSearchQuery = jest.fn().mockReturnValue(true)
const mockSetSearchQuery = jest.fn()
const mockSearchQuery = jest.fn().mockReturnValue('')


it('renders', () => {
  const { getByText } = renderMainPage(mockIsSearchQuery,mockSetSearchQuery,mockSearchQuery)
  const mentors = getByText('Featured Mentors')
  expect(mentors).toBeTruthy()
})

it('test if a call to API is been made', async () => {
renderMainPage(mockIsSearchQuery,mockSetSearchQuery,mockSearchQuery)
  expect(Api.getAllMentors).toHaveBeenCalled()
})
})