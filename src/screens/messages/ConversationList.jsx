import React from 'react'
import styled from 'styled-components'
import { Title, Icon, Spinner } from 'components'
import SelectPerson from './SelectPerson'
import { gql, useQuery } from 'gql'
import { useMe } from 'utils/hooks'
import Tab from './ConversationTab'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'
import { spinner } from 'components/Spinner/spinner.module.scss'

const CONVERSATION_LIST = gql`
  query ConversationList($id: ID!) {
    user(id: $id) {
      id
      conversations {
        id
        participants {
          id
          name
          handle
          headline
          profilePictures {
            size
            type
            url
          }
        }
      }
    }
  }
`

export default function ConversationList({
  select,
  onToggleSelect,
  selected,
  onSelection,
}) {
  const { me } = useMe()
  const {
    data: { user: { conversations = [] } = {} } = {},
    loading,
  } = useQuery(CONVERSATION_LIST, {
    variables: { id: me?.id },
    skip: !me?.id,
  })

  return (
    <S.Conversations>
      <S.Head select={select}>
        <Title s2>
          {select ? 'Select people' : <Link to={path(1)}>Conversations</Link>}
        </Title>
        <Icon icon="add" onClick={() => onToggleSelect(!select)} />
      </S.Head>
      {select && <SelectPerson selected={selected} onSelection={onSelection} />}
      {!select && (
        <S.List>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {conversations.map(({ id, participants }) => (
                <Tab key={id} id={id} users={participants} />
              ))}
            </>
          )}
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
      `} /* stylelint-enable value-keyword-case */
    }
  `,

  List: styled.ul`
    padding: 0 0.5rem;
    flex-grow: 1;
    overflow-y: auto;
    margin: 0 calc(var(--side-margin) * -1);
    position: relative;

    .${spinner} {
      width: 2.5rem;
      position: absolute;
      left: calc(50% - 1.25rem);
    }
  `,
}
