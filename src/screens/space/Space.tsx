import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useQuery, fragments } from 'gql'
import type { SpacePage, SpacePageVariables } from 'gql/types'
import { Spinner, Title, Text, Switch } from 'components'
import { Route, Redirect, useHistory } from 'react-router-dom'
import Image from './Image'
import { Helmet } from 'react-helmet'
import { path } from 'utils/url'
import { parseSize } from 'utils/css'
import Navigation from './Navigation'
import Mentors from './Mentors'
import Sidebar, { sidebarWidth } from './Sidebar'
import Settings from './Settings'
import People from './People'
import { InviteButton, InviteMenu } from './Invite'
import type { Role } from './roles'
import { mobile, desktop } from 'styles/responsive'
import { useMatchMedia } from 'utils/hooks'

const SPACE_QUERY = gql`
  query SpacePage($handle: String!) {
    space(handle: $handle) {
      id
      isMember
      isOwner
      name
      handle
      description
      sidebar
      mentors {
        ...MentorDetails
        sortScore
      }
      owners {
        id
        handle
        ...ProfilePictures
      }
      members {
        id
        handle
        ...ProfilePictures
      }
    }
  }
  ${fragments.person.mentorDetails}
  ${fragments.person.profilePictures}
`

export default function Space({ match }) {
  const history = useHistory()
  const [invite, setInvite] = useState<Role>()
  const { data, loading } = useQuery<SpacePage, SpacePageVariables>(
    SPACE_QUERY,
    {
      variables: { handle: match.params.handle.toLowerCase() },
    }
  )
  const isMobile = useMatchMedia(mobile)

  if (loading) return <Spinner />
  if (!data?.space) return <Redirect to="/404" />

  const {
    id,
    isMember,
    isOwner,
    name,
    handle,
    description,
    mentors,
  } = data.space

  if (match.params.handle !== handle)
    requestAnimationFrame(() => history.replace(`${path(1)}/${handle}`))

  const sidebar = <Sidebar {...data.space} />

  return (
    <>
      <Helmet>
        <title>{name} | Upframe</title>
      </Helmet>
      <S.Space data-view={isMember ? 'member' : 'external'}>
        <S.Main>
          <S.MainWrap>
            <S.Info
              data-mode={
                path().split('/').pop() === 'settings' ? 'edit' : 'view'
              }
            >
              <Image
                edit={path().split('/').pop() === 'settings'}
                ratio={0.25}
              />
              <div>
                <Image
                  edit={path().split('/').pop() === 'settings'}
                  ratio={1}
                />
                <S.InfoContent>
                  <Title size={2}>{name}</Title>
                  <Text>{description}</Text>
                </S.InfoContent>
                <S.InfoActions>
                  {isOwner && <InviteButton onSelect={setInvite} />}
                </S.InfoActions>
              </div>
            </S.Info>
            <Navigation isOwner={isOwner ?? false} />
            <Switch>
              {isMember && (
                <>
                  <Route
                    exact
                    path={path(2)}
                    render={() => <Mentors mentors={mentors} />}
                  />
                  <Route
                    exact
                    path={path(2) + '/people'}
                    render={() => (
                      <People
                        spaceId={id}
                        spaceName={name}
                        onInvite={setInvite}
                        isOwner={isOwner ?? false}
                      />
                    )}
                  />
                </>
              )}
              {isOwner && (
                <>
                  <Route
                    exact
                    path={path(2) + '/settings'}
                    render={() => <Settings spaceId={id} />}
                  ></Route>
                  <Route
                    exact
                    path={path(2) + '/activity'}
                    render={() => <div>activity</div>}
                  ></Route>
                </>
              )}
              {isMobile && (
                <Route path={path(2) + '/info'} render={() => sidebar} />
              )}
              <Redirect to={path(2)} />
            </Switch>
          </S.MainWrap>
        </S.Main>
        {sidebar}
      </S.Space>
      {invite && (
        <InviteMenu
          name={name}
          onClose={() => setInvite(undefined)}
          role={invite}
          spaceId={id}
          spaceName={name}
        />
      )}
    </>
  )
}

const columnGap = parseSize('2rem')
const contentWidth = parseSize('55rem')
const coverRatio = 1 / 4
const sidePadding = 0.03

const S = {
  Space: styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: calc(100% - ${sidebarWidth}px);

    --side-padding: ${sidePadding * 100}vw;

    padding: 2rem var(--side-padding);

    /* standardize the f*cking buttons! arrrgh!! */
    button[data-mode~='accent'] {
      font-size: 0.8rem;
      color: #f01c5c;
      font-weight: 600;
      background-color: #feeef2;
      height: 2.2rem;
      border-radius: 1.1rem;
      padding: 0 2rem;
    }

    @media ${mobile} {
      width: 100%;

      & > *:last-child {
        display: none;
      }
    }

    &[data-view='external'] > *:last-child {
      display: none;
    }
  `,

  Main: styled.div`
    flex: 1 1;

    @media ${desktop} {
      margin-right: ${columnGap}px;
    }
  `,

  MainWrap: styled.div`
    max-width: ${contentWidth}px;
    width: 100%;
    margin: auto;

    *[data-view='external'] & > *:not(:first-child) {
      display: none;
    }
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #0003;
    border-radius: 0.5rem;
    width: 100%;
    height: ${2 * coverRatio * contentWidth}px;

    @media (max-width: ${(contentWidth + sidebarWidth + columnGap) /
      (1 - sidePadding * 2)}px) {
      height: calc(
        ${`(${100 - sidePadding * 200}vw - ${
          sidebarWidth + columnGap
        }px) * ${coverRatio} * 2`}
      );
    }

    @media ${mobile} {
      height: calc((100vw - var(--side-padding) * 2) * ${coverRatio} * 2);
    }

    & > * {
      width: 100%;
      border: none;
      height: 50%;
    }

    & > ${Image.ImgWrap} {
      background-color: #dfdbe5;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
      border: none;
      display: block;
    }

    & > div {
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;

      --img-size: 7rem;

      & > ${Image.ImgWrap} {
        position: absolute;
        width: 7rem;
        height: 7rem;
        border: 0.4rem solid #fff;
        border-radius: 0.5rem;
        background-color: #aaa;
        transform: translateY(calc(var(--img-size) * -0.75));
        box-shadow: 0 0 6px #0004;
      }
    }
  `,

  InfoContent: styled.div`
    padding-top: calc(var(--img-size) * 0.25);

    h2 {
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }

    p {
      margin-top: 0;
    }
  `,

  InfoActions: styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;

    & > * {
      margin: 0;
    }
  `,
}
