import React from 'react'
import styled from 'styled-components'
import { Title, Icon } from 'components'
import Dropdown from './DropdownAction'

export function Filters() {
  return (
    <S.Wrap>
      <Title size={4}>Filters</Title>
    </S.Wrap>
  )
}

export default function FilterAction() {
  return (
    <Dropdown dropdown={<Filters />}>
      <span>Filter</span>
      <Icon icon="adjust" />
    </Dropdown>
  )
}

const S = {
  Wrap: styled.div`
    padding: 1rem;
  `,
}
