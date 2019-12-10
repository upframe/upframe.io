import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

import { BrowserRouter as Router } from 'react-router-dom'
import MainSearchBar from '../MainSearchBar'
import AppContext from '../../AppContext'

afterEach(cleanup)

const renderContext = (mockSearchQuery, mockSetSearchQuery) => {
  return render(
    <Router>
      <AppContext.Provider
        value={{
          startSearchQuery: mockSearchQuery,
          setSearchQuery: mockSetSearchQuery,
        }}
      >
        <MainSearchBar />
      </AppContext.Provider>
    </Router>
  )
}

describe('component is rendered correctly', () => {
  it('rendered the input', () => {
    const { getByPlaceholderText } = render(
      <Router>
        <MainSearchBar />
      </Router>
    )
    const input = getByPlaceholderText('What are you looking for?')
    expect(input).toBeTruthy()
  })

  it('take a snapshot', () => {
    const { container } = render(
      <Router>
        <MainSearchBar />
      </Router>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('check search query context', () => {
  it('check if search query context', () => {
    const mockSearchQuery = jest.fn(searchQuery => true)
    const mockSetSearchQuery = jest.fn()
    const { getByPlaceholderText } = renderContext(
      mockSearchQuery,
      mockSetSearchQuery
    )
    const input = getByPlaceholderText('What are you looking for?')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 13 })
    expect(mockSetSearchQuery.mock.calls[0][0]).toBe('test')
  })
})
