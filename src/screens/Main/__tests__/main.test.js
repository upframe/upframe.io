// chack if api call is being call
import React from 'react'
import {render, cleanup} from '@testing-library/react'
import "@testing-library/jest-dom";
import Main from '../Main'

it("renders", () =>{
    const {asFragment} = render(<Router><Main /></Router>)
    expect(asFragment()).toMatchSnapshop()
})