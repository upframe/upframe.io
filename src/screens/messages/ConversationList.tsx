import React from 'react'
import styled from 'styled-components'
import { Title, Icon, Spinner } from 'components'
import SelectPerson from './SelectPerson'
import Tab from './ConversationTab'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'
import { useConversations } from 'conversations'

interface Props {
  select: boolean
  onToggleSelect(v: boolean): void
  selected: Participant[]
  onSelection(v: Participant[]): void
}

export default function ConversationList({
  select,
  onToggleSelect,
  selected,
  onSelection,
}: Props) {
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

  Head: styled.div<{ select: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    padding-top: 1rem;
    padding-bottom: 0.5rem;
    margin-right: calc(var(--side-margin) * -0.5);
    margin-left: calc(var(--side-margin) * -0.5 + 0.1rem);

    * {
      margin: 0;
    }

    & > svg {
      width: 1.8rem;
      height: 1.8rem;
      background-color: #e5e5e5;

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
    margin-top: 0;
    padding-top: 0.5rem;

    .${Spinner.sc} {
      width: 2.5rem;
      position: absolute;
      left: calc(50% - 1.25rem);
    }
  `,
}
