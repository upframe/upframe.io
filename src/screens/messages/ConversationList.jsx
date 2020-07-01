import React from 'react'
import styled from 'styled-components'
import { Title, Icon, Spinner } from 'components'
import SelectPerson from './SelectPerson'
import Tab from './ConversationTab'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'
import { useConversations } from 'conversations'

export default function ConversationList({
  select,
  onToggleSelect,
  selected,
  onSelection,
}) {
  const conversations = useConversations()

  return (
    <S.Conversations>
      <S.Head select={select}>
        <Title size={2}>
          {select ? 'Select people' : <Link to={path(1)}>Conversations</Link>}
        </Title>
        <Icon icon="add" onClick={() => onToggleSelect(!select)} />
      </S.Head>
      {select && <SelectPerson selected={selected} onSelection={onSelection} />}
      {!select && (
        <S.List>
          <>
            {conversations.map(({ id, participants }) => (
              <Tab key={id} id={id} userIds={participants} />
            ))}
          </>
        </S.List>
      )}
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
      `}/* stylelint-enable value-keyword-case */
    }
  `,

  List: styled.ul`
    padding: 0 0.5rem;
    flex-grow: 1;
    overflow-y: auto;
    margin: 0 calc(var(--side-margin) * -1);
    position: relative;

    .${Spinner.sc} {
      width: 2.5rem;
      position: absolute;
      left: calc(50% - 1.25rem);
    }
  `,
}
