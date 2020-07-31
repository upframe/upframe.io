import React, { useState, useRef, useEffect } from 'react'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import { haveSameContent } from 'utils/array'
import styles from './profile.module.scss'
import { useQuery, queries, mutations, useMutation } from 'gql'
import { useMe } from 'utils/hooks'
import {
  Text,
  Title,
  Button,
  ProfilePicture,
  Tagselect,
  PhotoCrop,
  Modal,
} from 'components'

export default function Profile() {
  const fileInput = useRef(null)
  const [diff, setDiff] = useState({})
  const [invalid, setInvalid] = useState([])
  const [tags, setTags] = useState([])
  const [photo, setPhoto] = useState()
  const [showRemove, setShowRemove] = useState(false)
  const { me } = useMe()

  const { data: { user = {} } = {} } = useQuery(queries.SETTINGS_PROFILE, {
    variables: { id: me.id, skip: !me },
  })

  useEffect(() => {
    if (Array.isArray(user.tags)) setTags(user.tags)
  }, [user.tags])

  function editPhoto(e) {
    const reader = new FileReader()
    reader.onload = e => setPhoto(e.target.result)
    reader.readAsDataURL(e.target.files[0])
  }

  const required = ['name', 'displayName', 'handle', 'headline', 'biography']
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

  const [uploadPhoto] = useMutation(mutations.UPLOAD_PROFILE_PICTURE, {
    onCompleted() {
      setPhoto()
    },
  })

  const [removePhoto] = useMutation(mutations.REMOVE_PROFILE_PICTURE, {
    onCompleted() {
      setShowRemove(false)
    },
  })

  function update() {
    updateProfile({
      variables: {
        diff: {
          ...Object.entries(diff).reduce(
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
          tags: {
            addedIds: tags
              .filter(
                ({ id }) =>
                  typeof id !== 'string' &&
                  !(user.tags || []).find(tag => tag.id === id)
              )
              .map(({ id }) => id),
            removedIds: (user.tags || [])
              .filter(({ id }) => !tags.find(tag => tag.id === id))
              .map(({ id }) => id),
            addedName: tags
              .filter(({ id }) => typeof id === 'string')
              .map(({ name }) => name),
          },
        },
      },
    })
  }

  function handleChange(k, v) {
    if (
      !v &&
      (!/\d+/.test(k)
        ? !user[k]
        : !user.social.find(({ id }) => id === parseInt(k)))
    )
      setDiff(Object.fromEntries(Object.entries(diff).filter(e => e[0] !== k)))
    else setDiff({ ...diff, [k]: v })
  }

  useEffect(() => {
    if (
      Object.entries(diff).length &&
      Object.entries(diff).every(([k, v]) =>
        Array.isArray(v)
          ? haveSameContent(
              user.tags,
              v,
              (a, b) =>
                a.id === b.id ||
                (typeof a === 'string' &&
                  a.name.toLowerCase() === b.name.toLowerCase())
            )
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
    ...props
  }) => {
    field = field || label.toLowerCase()
    const value = user[field]

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
        {...props}
      />
    )
  }

  return (
    <div className={styles.profile}>
      <div className={styles.head}>
        <ProfilePicture imgs={user.profilePictures} size="11.125rem" />
        <div>
          <Title size={2}>Profile Picture</Title>
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
            {Array.isArray(user.profilePictures) &&
              !user.profilePictures[0].url.endsWith('default.png') && (
                <Button onClick={() => setShowRemove(true)}>Remove</Button>
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
      {item({ label: 'Display Name', field: 'displayName' })}
      {item({ label: 'Headline', field: 'headline' })}
      {user.role !== 'USER' && item({ label: 'Companies', field: 'company' })}
      {item({
        label: 'Biography',
        field: 'biography',
        type: 'text',
        hint: 'URLs are hyperlinked',
        placeholder:
          'Help people understand how you can help them by describing what you built or achieved.',
      })}
      {user.role !== 'USER' && (
        <>
          <Title size={2} className={styles.span2}>
            Experience
          </Title>
          <Text className={styles.span2}>
            What can you advise people on? Add up to 6 skills to display in your
            profile. The more specific, the better (‘Event Marketing’ is easier
            to picture than ‘Marketing).
          </Text>

          <div className={styles.span2}>
            <Tagselect
              selection={tags}
              onChange={v => {
                setTags(v)
                handleChange('tags', v)
              }}
              placeholder="Add up to 6 skills to display in your profile"
            />
          </div>
        </>
      )}
      <Title size={2} className={styles.span2}>
        Other Profiles
      </Title>
      {[
        item({
          label: 'Personal Website',
          field: 'website',
          inputType: 'url',
          span1: true,
        }),
        ...(user.social || []).map(({ id, name, handle, url }) => (
          <Item
            key={id}
            label={name}
            required={false}
            input={handle}
            hint={
              handle || diff[id] ? (
                <span>
                  <b>Preview: </b>
                  {url + (diff[id] ? diff[id] : handle)}
                </span>
              ) : (
                ''
              )
            }
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
      {photo && (
        <PhotoCrop
          photo={photo}
          name={user.name}
          onSave={file => uploadPhoto({ variables: { file } })}
          onCancel={() => setPhoto()}
        />
      )}
      {showRemove && (
        <Modal
          title="Remove profile photo?"
          text="Are you sure you want to remove your profile photo? We'll replace it with the default Upframe photo."
          onClose={() => setShowRemove(false)}
          actions={[
            <Button key="cancel" onClick={() => setShowRemove(false)}>
              Cancel
            </Button>,
            <Button filled key="remove" onClick={removePhoto}>
              Remove Photo
            </Button>,
          ]}
        />
      )}
    </div>
  )
}
