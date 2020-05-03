import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { TagInput, Icon, ProfilePicture } from '.'
import { useQuery, gql } from '../gql'
import { Link, useHistory } from 'react-router-dom'
import { useDebouncedInputCall } from '../utils/hooks'

const SEARCH = gql`
  query Search($term: String!, $withTags: [Int!]) {
    search(term: $term, withTags: $withTags) {
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
      tags {
        tag {
          id
          name
        }
        markup
      }
    }
  }
`

export default function SearchBar() {
  const [input, setInput] = useState('')
  const inputFinal = useDebouncedInputCall(input)
  const [focus, setFocus] = useState(false)
  const [searchTags, setSearchTags] = useState([])
  const history = useHistory()

  const { data: { search: { users = [], tags = [] } = {} } = {} } = useQuery(
    SEARCH,
    {
      skip: !/\w/.test(inputFinal),
      variables: {
        term: inputFinal.trim().replace(/\s{2,}/g, ' '),
        withTags: searchTags.map(({ id }) => id),
      },
    }
  )

  const inputRef = useRef(input)
  inputRef.current = input
  const setFocusRef = useRef(setFocus)
  setFocusRef.current = setFocus

  function submit(e) {
    e.preventDefault()
    if (!inputFinal.length && !searchTags.length) return
    e.target.querySelector('input').blur()
    setInput('')
    history.push(
      `/search?${Object.entries({
        q: inputFinal.trim().replace(/\s{2,}/g, ' '),
        t: searchTags.map(({ name }) => name).join(','),
      })
        .filter(([, v]) => v.length)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&')}`
    )
  }

  return (
    <S.Wrap onSubmit={submit}>
      <S.Search>
        <TagInput
          value={input}
          onChange={setInput}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setTimeout(() => setFocusRef.current(false), 100)
          }}
          tags={searchTags}
          onTagClick={id =>
            setSearchTags(searchTags.filter(tag => tag.id !== id))
          }
          placeholder="What are you looking for?"
        />
        <Icon icon="search" />
      </S.Search>
      {focus && users.length + tags.length > 0 && (
        <S.Preview
          tabIndex={0}
          onFocus={e => {
            const inputNode = e.target.parentNode.querySelector('input')
            if (inputNode) {
              inputNode.focus()
              setTimeout(() => setFocusRef.current(true), 100)
            }
          }}
        >
          {tags.map(({ tag, markup }) => (
            <S.Tag
              key={tag.id}
              onClick={() => {
                setSearchTags([...searchTags, tag])
                setInput('')
              }}
              dangerouslySetInnerHTML={{ __html: markup }}
            />
          ))}
          {users.map(({ id, name, handle, profilePictures }) => (
            <S.User key={id}>
              <Link to={`/${handle}`} onClick={() => setInput('')}>
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
  Wrap: styled.form`
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
      &:focus,
      &:hover {
        background-color: #f1f3f4;
      }
      &::placeholder {
        color: var(--cl-text-medium);
      }
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
    padding: 0 1rem;
  `,

  User: styled.li`
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

  Tag: styled.li`
    margin: 0.5rem 0;
    width: 100%;
    height: ${IMG_SIZE};
    display: block;
    line-height: ${IMG_SIZE};
    cursor: pointer;

    span {
      font-weight: 300;
    }
  `,
}
