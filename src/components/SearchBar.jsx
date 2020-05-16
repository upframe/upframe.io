import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TagInput, Icon, ProfilePicture } from '.'
import { useQuery, gql } from 'gql'
import { Link, useHistory } from 'react-router-dom'
import { useDebouncedInputCall } from 'utils/hooks'
import { useSpring, animated } from 'react-spring'

const SEARCH = gql`
  query Search($term: String!, $withTags: [Int!]) {
    search(term: $term, withTags: $withTags) {
      users {
        user {
          id
          handle
          profilePictures {
            size
            type
            url
          }
        }
        markup
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
  const [input, setInput] = useState(
    new URLSearchParams(window.location.search).get('q') ?? ''
  )
  const inputFinal = useDebouncedInputCall(input)
  const [focus, setFocus] = useState(false)
  const [selected, setSelected] = useState()
  const [selectionList, setSelectionList] = useState([])
  const [searchTags, setSearchTags] = useState([])
  const [willDelete, setWillDelete] = useState(false)
  const [tags, setTags] = useState([])
  const history = useHistory()

  const {
    data: { search: { users = empty, tags: _tags = empty } = {} } = {},
  } = useQuery(SEARCH, {
    skip: !/\w/.test(inputFinal),
    variables: {
      term: inputFinal.trim().replace(/\s{2,}/g, ' '),
      withTags: searchTags.map(({ id }) => id),
    },
  })

  useEffect(() => {
    setTags(
      _tags.filter(({ tag }) => !searchTags.find(({ id }) => tag.id === id))
    )
  }, [_tags, searchTags])

  const height = useSpring({
    height: `${(users.length + tags.length) * 3.3}rem`,
  })

  useEffect(() => {
    const list = [
      ...tags.map(({ tag }) => tag.id),
      ...users.map(({ user }) => user.id),
    ]
    setSelectionList(list)
    if (!list.includes(selected)) setSelected()
  }, [users, tags, selected])

  const inputRef = useRef(input)
  inputRef.current = input
  const setFocusRef = useRef(setFocus)
  setFocusRef.current = setFocus

  function submit(e) {
    if (e) e.preventDefault()
    if (!inputFinal.length && !searchTags.length) return
    if (e) e.target.querySelector('input').blur()
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

  function handleKey(e) {
    setWillDelete(false)
    switch (e.key) {
      case 'Enter':
      case 'Tab': {
        if (selected) e.preventDefault()
        const tag = tags.find(({ tag }) => tag.id === selected)
        const user = tag ?? users.find(({ user }) => user.id === selected)
        if (tag) {
          setInput('')
          setSearchTags([...searchTags, tag.tag])
        } else if (user && e.key === 'Enter') {
          setInput('')
          history.push(`/${user.user.handle}`)
        }
        break
      }
      case 'Backspace':
        if (input.length === 0 && searchTags.length)
          willDelete
            ? setSearchTags(searchTags.slice(0, -1))
            : setWillDelete(true)
        break
      case 'ArrowUp':
      case 'ArrowDown': {
        if (selectionList.length === 0) break
        const selectIndex = selectionList.indexOf(selected)
        const dir = e.key.replace('Arrow', '').toLowerCase()
        if (dir === 'down') {
          if (selectIndex >= selectionList.length - 1) break
          if (selectIndex === -1) setSelected(selectionList[0])
          else setSelected(selectionList[selectIndex + 1])
        } else {
          if (selectIndex === 0) break
          if (selectIndex === -1) setSelected(selectionList.slice(-1)[0])
          else setSelected(selectionList[selectIndex - 1])
        }
        break
      }
      default:
    }
  }

  return (
    <S.Wrap onSubmit={submit} onKeyDown={handleKey}>
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
          {...(willDelete &&
            searchTags.length && { highlight: searchTags.slice(-1)[0]?.id })}
        />
        <Icon
          icon="search"
          onClick={({ target }) =>
            input || searchTags.length
              ? submit()
              : target.parentNode.querySelector('input')?.focus()
          }
        />
      </S.Search>
      {focus && (
        <S.Preview
          style={height}
          items={tags.length + users.length}
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
              data-selected={tag.id === selected}
              onMouseEnter={() => setSelected(tag.id)}
              dangerouslySetInnerHTML={{ __html: markup }}
            />
          ))}
          {users.map(({ user: { id, handle, profilePictures }, markup }) => (
            <S.User
              key={id}
              data-selected={id === selected}
              onMouseEnter={() => setSelected(id)}
            >
              <Link to={`/${handle}`} onClick={() => setInput('')}>
                <ProfilePicture size={IMG_SIZE} imgs={profilePictures} />
                <span dangerouslySetInnerHTML={{ __html: markup }} />
              </Link>
            </S.User>
          ))}
        </S.Preview>
      )}
    </S.Wrap>
  )
}

const IMG_SIZE = '2.8rem'

const Item = styled.li`
  width: 100%;
  height: calc(${IMG_SIZE} + 0.5rem);
  padding: 0.25rem 1rem;
  cursor: pointer;
  box-sizing: border-box;

  & > span {
    font-weight: 300;
  }

  &[data-selected='true'] {
    background-color: #feeef2;
  }
`

const S = {
  Wrap: styled.form`
    max-width: 35rem;
    flex-grow: 1;
    display: block;
    position: relative;
  `,

  Search: styled.div`
    width: 100%;
    border-radius: 1000px;
    overflow: hidden;
    display: flex;
    align-items: center;
    background-color: #f1f3f4;
    transition: background-color 0.25s ease;

    &:focus,
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }

    svg {
      margin-right: 1rem;
    }

    & > div {
      background-color: transparent;

      input {
        margin-left: 0.5rem;
        background-color: transparent;

        &:focus,
        &:hover {
          background-color: transparent;
        }

        &::placeholder {
          color: var(--cl-text-medium);
        }
      }
    }
  `,

  Preview: styled(animated.ul)`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 6px #0004;
    border-radius: var(--border-radius);
    list-style: none;
    margin: 0;
    margin-top: 0.5rem;
    padding: 0.25rem 0;
    padding: 0;
    max-height: min(200rem, calc(100vh - 5rem));
    overflow-y: auto;
    background-color: #fff;
    display: block;
  `,

  User: styled(Item)`
    & > a {
      display: flex;
      align-items: center;

      img {
        width: ${IMG_SIZE};
        height: ${IMG_SIZE};
        display: block;
        border-radius: 50%;
        margin-right: 1rem;
      }
    }
  `,

  Tag: styled(Item)`
    display: block;
    line-height: ${IMG_SIZE};
  `,
}

const empty = []
