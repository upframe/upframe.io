import React, { useState, useContext, useRef } from 'react'
import AppContext from 'components/AppContext'
import { Text, Title, Button, Input, Chip, ProfilePicture } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import { useToast } from 'utils/Hooks'
import Api from 'utils/Api'
import styles from './profile.module.scss'

export default function Profile() {
  const ctx = useContext(AppContext)
  const [user, setUser] = useState(Object.assign({}, ctx.user))
  const [skill, setSkill] = useState('')
  const fileInput = useRef(null)
  const showToast = useToast()

  function uploadPhoto(e) {
    const file = e.currentTarget.files[0]
    if (file.size > 2 ** 20) return showToast('Please select a smaller file')
    Api.uploadPhoto(file)
      .then(({ ok, url }) => {
        if (ok !== 1) throw Error()
        ctx.setProfilePic(url)
      })
      .catch(() => showToast('Could not update picture'))
  }

  function removePhoto() {
    const profilePic =
      'https://connect-api-profile-pictures.s3.amazonaws.com/default.png'
    Api.updateUserInfo({ profilePic }).then(() => ctx.setProfilePic(profilePic))
  }

  function addSkill(e) {
    e.preventDefault()
    if (skill.length === 0) return
    const skills = JSON.parse(user.tags)
    if (skills.length < 6)
      setUser({
        ...user,
        tags: JSON.stringify(Array.from(new Set([...skills, skill]))),
      })
    else showToast('You already added 6 skills')
    setSkill('')
  }

  function removeSkill(name) {
    setUser({
      ...user,
      tags: JSON.stringify(JSON.parse(user.tags).filter(tag => tag !== name)),
    })
  }

  const diff = Object.fromEntries(
    Object.entries(user).flatMap(([k, v]) =>
      ctx.user[k] !== v ? [[k, v]] : []
    )
  )

  function saveChanges() {
    Api.updateUserInfo(diff)
      .then(({ ok }) => {
        if (ok !== 1) throw Error()
        ctx.saveUserInfo({ ...user, ...diff })
      })
      .catch(() => showToast('something went wrong'))
  }

  const setField = field => v => setUser({ ...user, ...{ [field]: v } })
  const item = ({ label, field, type = 'input', hint, social }) => {
    field = field || label.toLowerCase()
    hint =
      hint || (social && user[field])
        ? `https://${field}.com/${user[field]}`
        : undefined
    return (
      <Item
        label={label}
        {...{ [type]: ctx.user[field] || '' }}
        onChange={setField(field)}
        hint={hint}
      />
    )
  }
  return (
    <div>
      <div className={styles.head}>
        <ProfilePicture imgs={ctx.user.profilePic} />
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
            Your personal URL is upframe.io/<b>{user.keycode}</b>
          </span>
        ),
      })}
      {item({ label: 'Location' })}
      {item({ label: 'Your Position', field: 'role' })}
      {item({ label: 'Company' })}
      {item({ label: 'Website' })}
      {item({ label: 'Biography', field: 'bio', type: 'text' })}
      <Title s2>Social Profiles</Title>
      {item({ label: 'Dribbble', social: true })}
      {item({ label: 'Facebook', social: true })}
      {item({ label: 'Github', social: true })}
      {item({ label: 'LinkedIn', social: true })}
      {item({ label: 'Twitter', social: true })}
      {Object.keys(diff).length > 0 && <ChangeBanner onSave={saveChanges} />}
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
        {JSON.parse(user.tags).map(tag => (
          <Chip key={tag} onClick={removeSkill}>
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  )
}
