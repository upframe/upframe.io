
import React from 'react'
import {render, cleanup} from '@testing-library/react'
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from 'react-router-dom'
import Main from '../Main'
import MainCategories from '../MainCategories'
import MainMentorList from '../MainMentorList/MainMentorList'
import MentorCard from '../MentorCard'
import AppContext from '../../../components/AppContext'
import Api from '../../../utils/Api'
import mentors from '../test/mock_users'


Api.getAllMentors = jest.fn(() => Promise.resolve({ res: {mentors} }))


const getAllMentors = () => {
    return Promise.resolve({ mentors: {users} })
  }

  
  
  // Api.mockImplementation(() => {getAllMentors: getAllMentors} )
  

const renderMainPage = () => { 

    const mockSearchQuery = jest.fn(searchQuery => true)
    const mockSetSearchQuery = jest.fn()
    
    return render(
        <Router>
            <AppContext.Provider value={{ startSearchQuery:mockSearchQuery,setSearchQuery:mockSetSearchQuery}} >
                <Main>
                    <MainCategories />
                    <MainMentorList mentors={mentors}>
                        <MentorCard mentorInfo={mentors[0]}/>
                    </MainMentorList>
                </Main>
            </AppContext.Provider>
        </Router>
    )
}

it.skip("renders", () =>{
    const {container} = renderMainPage()
    expect(container).toMatchSnapshot()
})

it.skip("test", async() =>{
    const {getByText} = renderMainPage()
    expect(Api.getAllMentors).toHaveBeenCalled()


})