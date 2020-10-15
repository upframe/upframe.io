import React from 'react'
import styled from 'styled-components'
import { parseSize } from 'utils/css'
import { path } from 'utils/url'
import type { SpacePage } from 'gql/types'
import { Title, ProfilePicture, Link } from 'components'
import { useHistory } from 'react-router-dom'

interface Props {
  owners: Exclude<SpacePage['space'], null>['owners']
  members: Exclude<SpacePage['space'], null>['members']
}

export default function Sidebar(props: Props) {
  return (
    <S.Sidebar>
      <Avatars {...props} />
    </S.Sidebar>
  )
}

function Avatars({ owners, members }: Props) {
  useHistory()
  const isPeoplePage = /people$/.test(window.location.href)

  return (
    <S.Avatars>
      {owners && (
        <>
          <Title size={3}>Owners</Title>
          <S.Group>
            {owners.map(({ id, profilePictures, handle }) => (
              <S.Avatar key={`owner-${id}`}>
                <ProfilePicture
                  imgs={profilePictures}
                  size={avatarSize}
                  linkTo={`/${handle}`}
                />
              </S.Avatar>
            ))}
          </S.Group>
        </>
      )}
      {members && (
        <>
          <Title size={3}>Founders</Title>
          <S.Group>
            {members
              .slice(0, 2 * avatarsPerRow)
              .map(({ id, profilePictures, handle }) => (
                <S.Avatar key={`member-${id}`}>
                  <ProfilePicture
                    imgs={profilePictures}
                    size={avatarSize}
                    linkTo={`/${handle}`}
                  />
                </S.Avatar>
              ))}
          </S.Group>
          {members.length > avatarsPerRow * 2 && !isPeoplePage && (
            <S.More>
              <Link to={`${path(2)}/people`}>View more &gt;</Link>
            </S.More>
          )}
        </>
      )}
    </S.Avatars>
  )
}

export const sidebarWidth = parseSize('18rem')
const avatarsPerRow = 5
const avatarGap = '0.5rem'
const avatarSize =
  (sidebarWidth -
    parseSize('2rem') -
    (avatarsPerRow - 1) * parseSize(avatarGap)) /
  avatarsPerRow

const Widget = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background-color: #f1f3f4;
`

const S = {
  Sidebar: styled.div`
    height: 100vh;
    flex: 0 0;
    display: flex;
    flex-direction: column;
    width: ${sidebarWidth}px;
    box-sizing: border-box;
  `,

  Avatars: styled(Widget)`
    h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #000;
      margin-bottom: 0.5rem;

      &:not(:first-of-type) {
        margin-top: 1rem;
      }
    }
  `,

  Group: styled.div`
    display: grid;
    grid-template-columns: repeat(${avatarsPerRow}, 1fr);
    grid-gap: ${avatarGap};
    overflow-x: hidden;
    width: 100%;
  `,

  Avatar: styled.div`
    width: ${avatarSize}px;
    height: ${avatarSize}px;
    border-radius: 50%;
    overflow: hidden;
  `,

  More: styled.span`
    margin-top: 1rem;
    display: block;

    a {
      font-size: 0.9rem;
      color: var(--cl-text-medium);
    }
  `,
}
