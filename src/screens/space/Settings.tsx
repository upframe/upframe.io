import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Labeled, Input, Textbox, Button } from 'components'
import { useQuery, useMutation } from 'gql'
import { useReset } from 'utils/hooks'
import { SETTINGS_QUERY, CHANGE_INFO } from './gql'

export default function Settings({ spaceId }: { spaceId: string }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [handle, setHandle] = useState('')
  const [sidebar, setSidebar] = useState('')
  const [diff, setDiff] = useState<{
    name?: string
    description?: string
    handle?: string
    sidebar?: string
  }>({})

  useReset(
    spaceId,
    '',
    setName,
    setDescription,
    setHandle,
    setSidebar,
    {},
    setDiff
  )

  const { data, loading } = useQuery(SETTINGS_QUERY, {
    variables: { spaceId },
    onCompleted({ space }) {
      if (!space) return
      setName(space.name)
      setDescription(space.description ?? '')
      setHandle(space.handle)
      setSidebar(space.sidebar ?? '')
    },
  })

  const [update] = useMutation(CHANGE_INFO, {
    variables: { input: { id: spaceId, ...diff } },
  })

  useEffect(() => {
    if (!data?.space) return
    setDiff(
      Object.fromEntries(
        Object.entries({
          name,
          description,
          handle,
          sidebar,
        }).flatMap(([k, v]) => (v !== (data.space[k] ?? '') ? [[k, v]] : []))
      )
    )
  }, [name, description, handle, sidebar, data])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    update()
  }

  return (
    <S.Settings onSubmit={onSubmit}>
      <Labeled
        label="Name"
        action={<Input value={name} onChange={setName} />}
      />
      <Labeled
        label="About"
        action={<Input value={description} onChange={setDescription} />}
      />
      <Labeled
        label="Space URL"
        action={<Input value={handle} onChange={setHandle} />}
      />
      <Labeled
        label="Overview"
        action={<Textbox value={sidebar} onChange={setSidebar} />}
      />
      <Button
        accent
        type="submit"
        disabled={loading || Object.keys(diff).length === 0}
      >
        Save Changes
      </Button>
    </S.Settings>
  )
}

const S = {
  Settings: styled.form`
    width: 100%;

    input,
    textarea {
      width: 100%;
    }

    label {
      font-size: 1rem;
      font-weight: bold;
      color: #000;

      &:not(:first-of-type) {
        margin-top: 1rem;
      }
    }

    button {
      margin: 2rem auto;
      display: block;
    }
  `,
}
