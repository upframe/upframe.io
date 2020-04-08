import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TagInput, Icon, ProfilePicture } from '.'
import { useQuery, gql } from '../gql'
import { Link } from 'react-router-dom'

const SEARCH = gql`
  query Search($term: String!) {
    search(term: $term) {
      users {
        id
        name
        handle
        profilePictures {
          size
          type
          url
        }
      }
    }
  }
`

export default function SearchBar() {
  const [input, _setInput] = useState('')
  const [inputFinal, setInputFinal] = useState('')
  const [focus, setFocus] = useState(false)
  const [inputStamps, setInputStamps] = useState([])
  const [cancelGo, setCancelGo] = useState()
  const { data: { search: { users = [] } = {} } = {} } = useQuery(SEARCH, {
    skip: !/\w/.test(inputFinal),
    variables: { term: inputFinal.trim().replace(/\s{2,}/g, ' ') },
  })

  const inputRef = useRef(input)
  inputRef.current = input
  const setInputStampsRef = useRef(setInputStamps)
  setInputStampsRef.current = setInputStamps
  const setInputFinalRef = useRef(setInputFinal)
  setInputFinalRef.current = setInputFinal

  function setInput(v) {
    _setInput(v)
    setInputStamps([...inputStamps, performance.now()])
  }

  useEffect(() => {
    if (cancelGo) clearTimeout(cancelGo)
    if (!inputStamps.length) return

    const inputDelta = inputStamps.slice(1).map((v, i) => v - inputStamps[i])
    const inputAvg = inputDelta.reduce((a, c) => a + c, 0) / inputDelta.length

    let next = isNaN(inputAvg) ? 200 : Math.min(inputAvg * 1.7, 200)

    setCancelGo(
      setTimeout(() => {
        setInputStampsRef.current([])
        setInputFinalRef.current(inputRef.current)
      }, next)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStamps])

  return (
    <S.Wrap>
      <S.Search>
        <TagInput
          value={input}
          onChange={setInput}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 100)}
        />
        <Icon icon="search" />
      </S.Search>
      {focus && users.length > 0 && (
        <S.Preview>
          {users.map(({ id, name, handle, profilePictures }) => (
            <S.User key={id}>
              <Link to={`/${handle}`}>
                <ProfilePicture size={IMG_SIZE} imgs={profilePictures} />
                <span>{name}</span>
              </Link>
            </S.User>
          ))}
        </S.Preview>
      )}
    </S.Wrap>
  )
}

const IMG_SIZE = '2.8rem'

const S = {
  Wrap: styled.div`
    max-width: 35rem;
    flex-grow: 1;
    display: block;
    position: relative;
  `,

  Search: styled.div`
    width: 100%;
    display: block;
    border-radius: 1000rem;
    overflow: hidden;

    display: flex;
    align-items: center;
    background-color: #f1f3f4;

    svg {
      margin-right: 1rem;
    }

    input {
      margin-left: 0.5rem;
    }
  `,

  Preview: styled.ul`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    margin-top: 0.5rem;
    background: #fff;
    box-shadow: 0px 1px 6px #0004;
    border-radius: 0.3rem;
    list-style: none;
    padding: 0 1rem;
    max-height: min(200rem, calc(100vh - 5rem));
    overflow-y: auto;
  `,

  User: styled.ul`
    padding: 0;

    & > a {
      display: flex;
      padding: 0;
      align-items: center;
      margin: 0.5rem 0;

      img {
        width: ${IMG_SIZE};
        height: ${IMG_SIZE};
        border-radius: 50%;
        margin-right: 1rem;
      }
    }
  `,
}
