import React from 'react';
import { render,fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";

import MainSearchBar from '../MainSearchBar';
import { BrowserRouter as Router } from 'react-router-dom'


describe( "component is rendered correctly", () => {
    it("render component with props", () => {
        const {getByPlaceholderText} = render(<Router><MainSearchBar /></Router>)
        const input = getByPlaceholderText('What are you looking for?')
        expect(input).toBeTruthy()     
    })
    
    it("rendered the input", () => {
        const {getByPlaceholderText} = render(<Router><MainSearchBar /></Router>)
        const input = getByPlaceholderText('What are you looking for?')
        fireEvent.change(input, {target: {value: 'test'}})
        expect(input.value).toBe('test')     
    })

})