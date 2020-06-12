import React from 'react'
import styled from 'styled-components'
import { Title, Icon } from 'components'
import SelectPerson from './SelectPerson'

export default function ConversationList({ select, onToggleSelect }) {
  return (
    <S.Conversations>
      <S.Head select={select}>
        <Title s2>{select ? 'Select people' : 'Conversations'}</Title>
        <Icon icon="add" onClick={() => onToggleSelect(!select)} />
      </S.Head>
      {select && <SelectPerson />}
    </S.Conversations>
  )
}

const S = {
  Conversations: styled.div`
    --side-margin: 8%;

    padding: 0 var(--side-margin);
    display: flex;
    flex-direction: column;
    height: 100%;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    user-select: none;

    & > svg {
      width: 1.8rem;
      height: 1.8rem;

      /* stylelint-disable value-keyword-case */
      ${props =>
        props.select &&
        `
        transform: rotate(45deg);
      `} /* stylelint-enable value-keyword-case */
    }
  `,
}
