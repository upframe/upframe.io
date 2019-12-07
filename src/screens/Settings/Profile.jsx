import React, { useState, useContext, useRef } from 'react'
import AppContext from 'components/AppContext'
import { Text, Title, Button, Input, Chip, ProfilePicture } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import { useToast } from 'utils/Hooks'
import Api from 'utils/Api'
import { haveSameContent } from 'utils/Array'
import styles from './profile.module.scss'

export default function Profile() {
  const ctx = useContext(AppContext)
  const ctxUser = {
    ...ctx.user,
    tags: JSON.parse(ctx.user.tags || '[]'),
  }
  const [user, setUser] = useState(ctxUser)
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
    let tags = user.tags
    if (tags.length < 6) {
      tags = Array.from(new Set([...tags.map(({ text }) => text), skill])).map(
        skill => ({ id: skill, text: skill })
      )
      if (JSON.stringify(tags).length > 255)
        showToast('Please pick shorter tags')
      else setUser({ ...user, tags })
    } else showToast('You already added 6 skills')
    setSkill('')
  }

  function removeSkill(name) {
    setUser({
      ...user,
      tags: user.tags.filter(({ text }) => text !== name),
    })
  }

  const diff = Object.fromEntries(
    Object.entries(user).flatMap(([k, v]) =>
      (Array.isArray(v)
      ? !haveSameContent(
          ctxUser[k],
          v,
          ({ text: t1 }, { text: t2 }) => t1 === t2
        )
      : ctxUser[k] !== v)
        ? [[k, v]]
        : []
    )
  )

  function saveChanges() {
    Api.updateUserInfo(diff)
      .then(({ ok }) => {
        if (ok !== 1) throw Error()
        ctx.saveUserInfo(
          Object.fromEntries(
            Object.entries(diff).map(([k, v]) =>
              k !== 'tags' ? [k, v] : [k, JSON.stringify(v)]
            )
          )
        )
      })
      .catch(() => showToast('something went wrong'))
  }

  const setField = field => v => setUser({ ...user, ...{ [field]: v } })
  const item = ({ label, field, type = 'input', hint, social = false }) => {
    field = field || label.toLowerCase()
    if (!hint && social && user[field]) {
      let urlPredict = user[field]
        .replace(/^http(s?):\/\//, '')
        .replace(/\/$/, '')
        .split('/')
        .slice(0, -1)
        .join('/')
      if (urlPredict.length < 3) urlPredict = false
      if (social.startsWith(urlPredict))
        hint = `https://${user[field].replace(/^http(s?):\/\//, '')}`
      else hint = `https://${social}${user[field]}`
      hint = <a href={hint}>{hint}</a>
    }
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
            Your personal URL is{' '}
            <a href={`https://upframe.io/${user.keycode}`}>
              upframe.io/<b>{user.keycode}</b>
            </a>
          </span>
        ),
      })}
      {item({ label: 'Location' })}
      {item({ label: 'Your Position', field: 'role' })}
      {item({ label: 'Company' })}
      {item({ label: 'Website' })}
      {item({ label: 'Biography', field: 'bio', type: 'text' })}
      <Title s2>Social Profiles</Title>
      {item({ label: 'Dribbble', social: 'dribbble.com/' })}
      {item({ label: 'Facebook', social: 'facebook.com/' })}
      {item({ label: 'Github', social: 'github.com/' })}
      {item({ label: 'LinkedIn', social: 'linkedin.com/in/' })}
      {item({ label: 'Twitter', social: 'twitter.com/' })}
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
        {user.tags.map(({ id, text }) => (
          <Chip key={id} onClick={removeSkill}>
            {text}
          </Chip>
        ))}
      </div>
    </div>
  )
}
