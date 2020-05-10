import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button,
  Text,
  ProfilePicture,
  Title,
  PhotoCrop,
} from '../../components'
import Item from '../Settings/Item'
import { gql, queries, fragments, useQuery, useMutation } from 'gql'
import { useDebouncedInputCall, useCtx } from 'utils/hooks'

const COMPLETE_SIGNUP = gql`
  mutation CompleteSignUp(
    $token: ID!
    $name: String!
    $handle: String!
    $biography: String!
    $location: String
    $headline: String
    $photo: String
  ) {
    completeSignup(
      token: $token
      name: $name
      handle: $handle
      biography: $biography
      location: $location
      headline: $headline
      photo: $photo
    ) {
      ...PersonBase
      ... on Mentor {
        calendarConnected
      }
    }
  }
  ${fragments.person.base}
`

export default function Step2({
  token,
  info: { name: initialName, picture, defaultPicture, role },
}) {
  const [name, _setName] = useState(initialName || '')
  const [handle, _setHandle] = useState(handleFromName(name))
  const [location, setLocation] = useState('')
  const [headline, setHeadline] = useState('')
  const [biography, setBiography] = useState('')
  const [photo, setPhoto] = useState(picture?.url ?? defaultPicture?.url)
  const [rawPhoto, setRawPhoto] = useState()
  const [cstHandle, setCstHandle] = useState(false)
  const checkData = useDebouncedInputCall({
    name,
    handle,
    biography,
    location,
    ...(role === 'MENTOR' && {
      headline,
    }),
  })
  const [invalid, setInvalid] = useState({})
  const history = useHistory()
  const fileInput = useRef(null)
  const { setCurrentUser } = useCtx()

  const [completeSignup] = useMutation(COMPLETE_SIGNUP, {
    variables: {
      name,
      handle,
      biography,
      token,
      location,
      headline,
      ...(photo !== defaultPicture?.url && { photo }),
    },
    onCompleted({ completeSignup: { id } }) {
      setCurrentUser(id)
      localStorage.setItem('loggedin', true)
      history.push('/settings/public')
    },
  })

  useQuery(queries.CHECK_VALIDITY, {
    variables: checkData,
    onCompleted({ checkValidity }) {
      setInvalid(
        Object.fromEntries(
          !checkValidity
            ? []
            : checkValidity
                .filter(({ valid }) => !valid)
                .map(({ field, reason }) => [field, reason])
        )
      )
    },
  })

  function handleFromName(v) {
    return v
      .replace(/\s\w/g, v => v[1].toUpperCase())
      .normalize('NFKD')
      .replace(/[^\w\-.]/g, '')
      .slice(0, 20)
  }

  function setName(v) {
    _setName(v)
    if (cstHandle) return
    _setHandle(handleFromName(v))
  }

  function setHandle(v) {
    if (!cstHandle) setCstHandle(true)
    _setHandle(v)
  }

  function editPhoto(e) {
    const reader = new FileReader()
    reader.onload = e => setRawPhoto(e.target.result)
    reader.readAsDataURL(e.target.files[0])
  }

  return (
    <S.Step2 onSubmit={e => e.preventDefault()}>
      <S.Head>
        <ProfilePicture imgs={[{ url: photo }]} size="11.125rem" />
        <div>
          <Title s2>Profile Picture</Title>
          <Text>
            We're big on pictures here.
            <br />
            Add an updated picture so you don't look like a&nbsp;
            <span role="img" aria-label="robot">
              🤖
            </span>
          </Text>
          <div>
            <Button accent onClick={() => fileInput.current.click()}>
              Upload photo
            </Button>
            {photo !== defaultPicture?.url && (
              <Button onClick={() => setPhoto(defaultPicture.url)}>
                Remove
              </Button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={editPhoto}
            hidden
          />
        </div>
      </S.Head>
      <Item
        label="Name"
        autoComplete="name"
        input={name}
        onChange={setName}
        {...(name.length &&
          'name' in invalid && { hint: invalid.name, error: true })}
      />
      <Item
        label="Username"
        autoComplete="username"
        input={handle}
        onChange={setHandle}
        {...(handle && { hint: `https://upframe.io/${handle}` })}
        {...(handle.length &&
          'handle' in invalid && { hint: invalid.handle, error: true })}
      />
      <Item
        label="Location"
        autoComplete="address-level2"
        input={location}
        onChange={setLocation}
      />
      {role === 'MENTOR' && (
        <Item
          label="Headline"
          autoComplete="organization-title"
          input={headline}
          onChange={setHeadline}
        />
      )}
      <Item label="Biography" text={biography} onChange={setBiography} />
      <Button
        accent
        type="submit"
        disabled={Object.keys(invalid).length > 0}
        onClick={completeSignup}
      >
        Create Account
      </Button>
      {rawPhoto && (
        <PhotoCrop
          photo={rawPhoto}
          name={name}
          onSave={file => {
            setRawPhoto()
            setPhoto(file)
          }}
          onCancel={() => setRawPhoto()}
        />
      )}
    </S.Step2>
  )
}

const S = {
  Step2: styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin: 0;
    margin-top: -2rem;
    padding: 0 calc((100vw - 50rem) / 2);
    max-width: 95vw;

    @media (max-width: 52.5rem) {
      padding: 0 2.5vw;
    }

    @media (max-width: 600px) {
      *[data-action] {
        grid-column: 1 / span 2;
      }
    }

    & > button {
      grid-column: 2;
      margin: 0;
    }

    *[data-action='textbox'],
    *[data-label='location'],
    *[data-label='headline'] {
      grid-column: 1 / span 2;
    }
  `,

  Head: styled.div`
    display: flex;
    justify-content: flex-start;
    grid-column: 1 / span 2;
    margin-bottom: 1rem;

    img {
      height: 11.125rem;
      border-radius: var(--border-radius);
    }

    & > div {
      margin-left: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      * {
        margin-top: 0;
        margin-bottom: 0;
      }

      p {
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 600px) {
      h2,
      p {
        display: none;
      }

      flex-direction: column;
      align-items: center;

      & > div {
        margin-top: 2rem;
      }
    }
  `,
}
