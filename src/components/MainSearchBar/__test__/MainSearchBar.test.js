import React from 'react';
import { render,fireEvent, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

import { BrowserRouter as Router } from 'react-router-dom'
import MainSearchBar from '../MainSearchBar';
import AppContext from '../../AppContext';


afterEach(cleanup)

const renderContext = () => { 

    return render(
        <Router>
            <AppContext.Provider >
            {/* {console.log(AppContext.Provider)} */}
                <MainSearchBar />
            </AppContext.Provider>
        </Router>
    )
}

// describe( "component is rendered correctly", () => {
//     it("rendered the input", () => {
//         const {getByPlaceholderText} = render(<Router><MainSearchBar /></Router>)
//         const input = getByPlaceholderText('What are you looking for?')
//         expect(input).toBeTruthy()     
//     })
    
//     it("setting the value of input", () => {
//         const {getByPlaceholderText} = render(<Router><MainSearchBar /></Router>)
//         const input = getByPlaceholderText('What are you looking for?')
//         fireEvent.change(input, {target: {value: 'test'}})
//         expect(input.value).toBe('test')     
//     })

// })


describe( "check search query context", () => {
    // const isSearchQuery = false; 

    it("check if search query context", () => {
        const {getByPlaceholderText} = renderContext()
        const input = getByPlaceholderText('What are you looking for?')
        fireEvent.change(input, {target: {value: 'test'}})
        fireEvent.keyDown(input, {key: 'Enter', code: 13})
    })

})


// describe( "check search query context", () => {
//     // const isSearchQuery = false; 

//     it("check if search query context", () => {
//         const {getByPlaceholderText} = renderContext()
//         const input = getByPlaceholderText('What are you looking for?')
//         fireEvent.change(input, {target: {value: 'test'}})
//         fireEvent.keyDown(input, {key: 'Enter', code: 13})
//     })

// })