import React from 'react'
import {render, cleanup} from '@testing-library/react'
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from 'react-router-dom'
import Main from '../Main'
import AppContext from '../../../components/AppContext'
import mocks from 'http'



afterEach(cleanup)


const users = [
    {
        bio: "Product person with a lot to learn.  I'm not going to pretend I have answers but I'm happy to guide you and connect you with people who can help you.",
        company: "Upframe",
        keycode: "malik",
        name: "Malik Piara",
        pictures: {},
        profilePic: "https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg",
        role: "Product Owner",
        slots: [],
        tags: "",
        uid: "3a611becd332813182559cf781f32ae18caa09c1",
    },
    {
        bio: "test.",
        company: "Upframe",
        keycode: "yoav",
        name: "yoav Piara",
        pictures: {},
        profilePic: "https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg",
        role: "Product Owner",
        slots: [],
        tags: "",
        uid: "3a611bead332813182559cf781f32ae18caa09c1",
    }

]

const renderContext = (values) => { 
    
    return render(
        <Router>
            <AppContext.Provider value={values} >
                <Main emptyQuery={true}/>
            </AppContext.Provider>
        </Router>
    )
}


it("renders", async () =>{
    const values = {isSearchQuery:true}
    renderContext(values)
    console.log(mocks)
    
    mocks.get.mockImplementationOnce(() =>
    Promise.resolve(data)
  );
    expect(mocks.get.calls.length).toBe(1)
})


// test if context is true, make an api call