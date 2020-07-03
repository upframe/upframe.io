import React from 'react'
import styled from 'styled-components'
import { Icon } from 'components'

export default function Omission() {
  return (
    <S.Omission>
      <Icon icon="more" />
    </S.Omission>
  )
}

const S = {
  Omission: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
  `,
}
