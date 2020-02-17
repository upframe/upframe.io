import React, { useState, useRef, useEffect } from 'react'
import { Text, Title, Button, Input, Chip, ProfilePicture } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import { useCtx } from 'utils/Hooks'
import { haveSameContent } from 'utils/Array'
import styles from './profile.module.scss'
import { useQuery, queries, mutations, useMutation } from '../../gql'

export default function Profile() {
  const [skill, setSkill] = useState('')
  const fileInput = useRef(null)
  const { currentUser } = useCtx()
  const [diff, setDiff] = useState({})
  const [invalid, setInvalid] = useState([])
  const [tags, setTags] = useState([])

  const { data: { mentor: user = {} } = {} } = useQuery(queries.PROFILE, {
    variables: { keycode: currentUser, skip: !currentUser },
  })

  useEffect(() => {
    if (Array.isArray(user.tags)) setTags(user.tags)
  }, [user.tags])

  function uploadPhoto(e) {}

  function removePhoto() {}

  function addSkill(e) {
    e.preventDefault()
    const newTags = [...tags, skill.toLowerCase()]
    setTags(newTags)
    handleChange('tags', newTags)
    setSkill('')
  }

  function removeSkill(name) {
    const newTags = tags.filter(tag => tag !== name)
    setTags(newTags)
    handleChange('tags', newTags)
  }

  const required = ['name', 'keycode', 'role', 'bio']
  const requiredMet = required.every(field => user[field])

  const [updateProfile] = useMutation(mutations.UPDATE_PROFILE, {
    variables: { diff },
    onCompleted(v) {
      setInvalid([])
    },
    onError({ graphQLErrors }) {
      if (!graphQLErrors) return
      setInvalid(
        graphQLErrors.map(({ extensions }) => extensions.field).filter(Boolean)
      )
    },
  })

  function handleChange(k, v) {
    setDiff({ ...diff, [k]: v })
  }

  useEffect(() => {
    if (
      Object.entries(diff).length &&
      Object.entries(diff).every(([k, v]) =>
        Array.isArray(v)
          ? haveSameContent(user.tags, v)
          : user[k] === v || user.social[k] === v
      )
    ) {
      setDiff({})
      setInvalid([])
    }
  }, [user, diff])

  const item = ({
    label,
    field,
    type = 'input',
    hint,
    social = false,
    inputType,
  }) => {
    field = field || label.toLowerCase()
    const value = !social
      ? user[field]
      : user.social && user.social[field]
      ? user.social[field]
      : undefined
    if (
      !hint &&
      social &&
      (!social ? user[field] : user.social && user.social[field])
    ) {
      let urlPredict = value
        .replace(/^http(s?):\/\//, '')
        .replace(/\/$/, '')
        .split('/')
        .slice(0, -1)
        .join('/')
      if (urlPredict.length < 3) urlPredict = false
      if (social.startsWith(urlPredict))
        hint = `https://${value.replace(/^http(s?):\/\//, '')}`
      else hint = `https://${social}${value}`
      hint = (
        <a href={hint} target="_blank" rel="noopener noreferrer">
          {hint}
        </a>
      )
    }
    return (
      <Item
        label={label}
        required={required.includes(field)}
        {...{ [type]: value || '' }}
        {...(inputType && { inputType })}
        onChange={v => handleChange(field, v)}
        hint={hint}
        error={invalid.includes(field)}
      />
    )
  }

  return (
    <div>
      <div className={styles.head}>
        <ProfilePicture imgs={user.profilePictures} />
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
            <Button onClick={removePhoto}>Remove</Button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={uploadPhoto}
            hidden
          />
        </div>
      </div>
      {item({ label: 'Your Name', field: 'name' })}
      {item({
        label: 'Username',
        field: 'keycode',
        hint: (
          <span>
            Your personal URL is{' '}
            <a
              href={`https://upframe.io/${user.keycode}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              upframe.io/<b>{user.keycode}</b>
            </a>
          </span>
        ),
      })}
      {item({ label: 'Location' })}
      {item({ label: 'Your Position', field: 'role' })}
      {item({ label: 'Company' })}
      {item({ label: 'Website', inputType: 'url' })}
      {item({ label: 'Biography', field: 'bio', type: 'text' })}
      <Title s2>Social Profiles</Title>
      {item({ label: 'Dribbble', social: 'dribbble.com/' })}
      {item({ label: 'Facebook', social: 'facebook.com/' })}
      {item({ label: 'Github', social: 'github.com/' })}
      {item({ label: 'LinkedIn', social: 'linkedin.com/in/' })}
      {item({ label: 'Twitter', social: 'twitter.com/' })}
      {Object.keys(diff).length > 0 && (
        <ChangeBanner onSave={updateProfile} accent={requiredMet} />
      )}
      <Title s2>Experience</Title>
      <Text>
        Add up to 6 skills to display in your profile. Other people will see
        them under the section "I can advise you on".
      </Text>
      <form className={styles.skillInput} onSubmit={addSkill}>
        <Input placeholder="add new tag" value={skill} onChange={setSkill} />
        <Button accent type="submit">
          Add tag
        </Button>
      </form>
      <div className={styles.skillList}>
        {tags.map(tag => (
          <Chip key={tag} onClick={removeSkill}>
            {tag}
          </Chip>
        ))}
      </div>
      <Button
        linkTo={`/${user.keycode}`}
        newTab
        className={styles.btViewProfile}
      >
        View Profile
      </Button>
    </div>
  )
}
