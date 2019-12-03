import React from 'react';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom";

import MainMentorList from '../MainMentorList';
import { BrowserRouter as Router } from 'react-router-dom'



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
    }
]


describe( "renders", () => {

    it("render component with props", () => {
        const {getByTestId} = render(<Router><MainMentorList mentors={users} /></Router>)
        const container = getByTestId('container')
        expect(container.childElementCount).toEqual(1)        
    })

    it("render component with out props", () => {
        const {getByTestId} = render(<Router><MainMentorList mentors={undefined} /></Router>)
        const container = getByTestId('noMentors')
        expect(container.tagName).toEqual("P")        
    })

})