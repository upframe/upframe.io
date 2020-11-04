import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from 'gql'
import { Title, Input, Labeled, Button } from 'components'
import type {
  Spaces as SpacesQuery,
  CreateSpace as CreateSpaceMutation,
  CreateSpaceVariables,
} from 'gql/types'

const SPACE = gql`
  fragment ToolsSpace on Space {
    id
    name
  }
`

const SPACES_QUERY = gql`
  query Spaces {
    spaces {
      ...ToolsSpace
    }
  }
  ${SPACE}
`

const CREATE_SPACE = gql`
  mutation CreateSpace($name: String!, $handle: String!) {
    createSpace(name: $name, handle: $handle) {
      ...ToolsSpace
    }
  }
  ${SPACE}
`

export default function Spaces() {
  const { data: { spaces = [] } = {} } = useQuery<SpacesQuery>(SPACES_QUERY)

  return (
    <S.Spaces>
      <Title size={2}>Create Space</Title>
      <CreateSpace />
      <Title size={2}>Spaces</Title>
      <S.List>
        {spaces.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </S.List>
    </S.Spaces>
  )
}

function CreateSpace() {
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [manualHandle, setManualHandle] = useState(false)

  function reset() {
    setName('')
    setHandle('')
    setManualHandle(false)
  }

  const [createSpace] = useMutation<CreateSpaceMutation, CreateSpaceVariables>(
    CREATE_SPACE,
    {
      variables: { name, handle },
      update(cache, { data }) {
        const { spaces = [] } = cache.readQuery({ query: SPACES_QUERY }) ?? {}
        cache.writeQuery({
          query: SPACES_QUERY,
          data: { spaces: [...spaces, data?.createSpace] },
        })
        reset()
      },
    }
  )

  useEffect(() => {
    if (manualHandle) return
    setHandle(name.replace(/\s+\w/g, v => v.slice(-1).toUpperCase()).trim())
  }, [name, manualHandle])

  function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    createSpace()
  }

  return (
    <S.Create onSubmit={create}>
      <Labeled
        wrap
        label="name"
        action={<Input value={name} onChange={setName} />}
      />
      <Labeled
        wrap
        label="handle"
        action={
          <Input
            value={handle}
            onChange={v => {
              setManualHandle(true)
              setHandle(v)
            }}
          />
        }
      />
      <Button type="submit" accent>
        create
      </Button>
    </S.Create>
  )
}

const S = {
  Spaces: styled.div`
    padding-left: 5vw;
    width: 100%;

    & > *:first-child {
      margin-top: 0;
    }
  `,

  List: styled.ul``,

  Create: styled.form`
    display: flex;
    width: 100%;
    align-items: flex-end;

    & > *:not(:last-child) {
      margin-right: 1rem;
      flex-grow: 1;

      input {
        width: 100%;
      }
    }
  `,
}
