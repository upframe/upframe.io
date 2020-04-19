import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components'
import Item from '../Settings/Item'
import { queries, useQuery } from '../../gql'
import { useDebouncedInputCall } from '../../utils/hooks'

export default function Step2() {
  const [name, _setName] = useState('')
  const [handle, _setHandle] = useState('')
  const [cstHandle, setCstHandle] = useState(false)
  const checkData = useDebouncedInputCall({ name, handle })
  const [invalid, setInvalid] = useState({})

  useQuery(queries.CHECK_VALIDITY, {
    variables: checkData,
    skip: !checkData.name && !checkData.handle,
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

  function setName(v) {
    _setName(v)
    if (cstHandle) return
    _setHandle(
      v
        .replace(/\s\w/g, v => v[1].toUpperCase())
        .normalize('NFKD')
        .replace(/[^\w\-.]/g, '')
    )
  }

  function setHandle(v) {
    if (!cstHandle) setCstHandle(true)
    _setHandle(v)
  }

  return (
    <S.Step2 onSubmit={e => e.preventDefault()}>
      <Item
        label="Name"
        input={name}
        onChange={setName}
        {...(name.length &&
          'name' in invalid && { hint: invalid.name, error: true })}
      />
      <Item
        label="Username"
        input={handle}
        onChange={setHandle}
        {...(handle && { hint: `https://upframe.io/${handle}` })}
        {...(handle.length &&
          'handle' in invalid && { hint: invalid.handle, error: true })}
      />
      <Button accent type="submit" disabled={Object.keys(invalid).length > 0}>
        Finish signup
      </Button>
    </S.Step2>
  )
}

const S = {
  Step2: styled.form`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    padding-bottom: 2rem;

    & > button {
      grid-column: 2;
      margin: 0;
    }
  `,
}
