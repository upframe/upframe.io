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

  const { data: { user = {} } = {} } = useQuery(queries.SETTINGS_PROFILE, {
    variables: { id: currentUser, skip: !currentUser },
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

  const required = ['name', 'handle', 'title', 'biography']
  const requiredMet = required.every(field => user[field])

  const [updateProfile] = useMutation(mutations.UPDATE_PROFILE, {
    onCompleted() {
      setInvalid([])
    },
    onError({ graphQLErrors }) {
      if (!graphQLErrors) return
      setInvalid(
        graphQLErrors.map(({ extensions }) => extensions.field).filter(Boolean)
      )
    },
  })

  function update() {
    updateProfile({
      variables: {
        diff: Object.entries(diff).reduce(
          (a, [k, v]) => ({
            ...a,
            ...(!/\d+/.test(k)
              ? { [k]: v }
              : {
                  social: [
                    ...(a.social || []),
                    { platform: parseInt(k), handle: v },
                  ],
                }),
          }),
          {}
        ),
      },
    })
  }

  function handleChange(k, v) {
    setDiff({ ...diff, [k]: v })
  }

  useEffect(() => {
    if (
      Object.entries(diff).length &&
      Object.entries(diff).every(([k, v]) =>
        Array.isArray(v)
          ? haveSameContent(user.tags, v)
          : /\d+/.test(k)
          ? (user.social.find(({ id }) => id.toString() === k).handle || '') ===
            v
          : user[k] === v
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
    inputType,
    span1 = false,
  }) => {
    field = field || label.toLowerCase()
    const value = user[field]

    if (!hint && user[field]) {
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
        {...(!span1 && { className: styles.span2 })}
        key={label}
      />
    )
  }

  return (
    <div className={styles.profile}>
      <div className={styles.head}>
        <ProfilePicture imgs={user.profilePictures} size="11.125rem" />
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
      {item({ label: 'Your Name', field: 'name', span1: true })}
      {item({ label: 'Location', span1: true })}
      {item({
        label: 'Username',
        field: 'handle',
        hint: (
          <span>
            Your personal URL is{' '}
            <a
              href={`https://upframe.io/${user.handle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              upframe.io/<b>{user.handle}</b>
            </a>
          </span>
        ),
      })}
      {user.role !== 'USER' && (
        <>
          {item({ label: 'Your Position', field: 'title' })}
          {item({ label: 'Company' })}
        </>
      )}
      {item({ label: 'Biography', field: 'biography', type: 'text' })}
      <Title s2 className={styles.span2}>
        Experience
      </Title>
      <Text className={styles.span2}>
        What can you advise people on? Add up to 6 skills to display in your
        profile. The more specific, the better (‘Event Marketing’ is easier to
        picture than ‘Marketing).
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
      <Title s2 className={styles.span2}>
        Other Profiles
      </Title>
      {[
        item({ label: 'Personal Website', inputType: 'url', span1: true }),
        ...(user.social || []).map(({ id, name, handle, url }) => (
          <Item
            key={id}
            label={name}
            required={false}
            input={handle}
            {...(handle && { hint: url + handle })}
            onChange={v => handleChange(id, v)}
          />
        )),
      ]}
      {Object.keys(diff).length > 0 && (
        <ChangeBanner onSave={update} accent={requiredMet} />
      )}
      <Button
        linkTo={`/${user.handle}`}
        newTab
        className={styles.btViewProfile}
      >
        View Profile
      </Button>
    </div>
  )
}
