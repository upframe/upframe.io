import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, fragments } from 'gql'
import type { SpacePage, SpacePageVariables } from 'gql/types'
import { Spinner, Title, Text } from 'components'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { path } from 'utils/url'
import { parseSize } from 'utils/css'
import Navigation from './Navigation'
import Mentors from './Mentors'
import Sidebar, { sidebarWidth } from './Sidebar'
import Settings from './Settings'
import People from './People'

const SPACE_QUERY = gql`
  query SpacePage($handle: String!) {
    space(handle: $handle) {
      id
      name
      handle
      description
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
  const { data, loading } = useQuery<SpacePage, SpacePageVariables>(
    SPACE_QUERY,
    {
      variables: { handle: match.params.handle.toLowerCase() },
    }
  )

  if (loading) return <Spinner />
  if (!data?.space) return <Redirect to="/404" />

  const { id, name, handle, description, mentors, owners, members } = data.space

  if (match.params.handle !== handle)
    requestAnimationFrame(() => history.replace(`${path(1)}/${handle}`))

  return (
    <S.Space>
      <Helmet>
        <title>{name} | Upframe</title>
      </Helmet>
      <S.Main>
        <S.MainWrap>
          <S.Info>
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              alt=""
            />
            <div>
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                alt=""
              />
              <Title size={2}>{name}</Title>
              <Text>{description}</Text>
            </div>
          </S.Info>
          <Navigation />
          <Switch>
            <Route
              exact
              path={path(2)}
              render={() => <Mentors mentors={mentors} />}
            ></Route>
            <Route
              exact
              path={path(2) + '/people'}
              render={() => <People spaceId={id} />}
            ></Route>
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
            <Redirect to={path(2)} />
          </Switch>
        </S.MainWrap>
      </S.Main>
      <Sidebar owners={owners} members={members} />
    </S.Space>
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
    width: 100%;

    --side-padding: ${sidePadding * 100}vw;

    padding: 2rem var(--side-padding);
  `,

  Main: styled.div`
    flex: 1 1;
    margin-right: ${columnGap}px;
  `,

  MainWrap: styled.div`
    max-width: ${contentWidth}px;
    width: 100%;
    margin: auto;
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
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

    & > * {
      width: 100%;
      border: none;
      height: 50%;
    }

    & > img {
      background-color: #dfdbe5;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
      border: none;
      display: block;
    }

    & > div {
      position: relative;
      box-sizing: border-box;

      --img-size: 7rem;

      padding: 0 3rem;
      padding-top: calc(var(--img-size) * 0.25);

      img {
        position: absolute;
        width: 7rem;
        height: 7rem;
        border: 0.4rem solid #fff;
        border-radius: 0.5rem;
        background-color: #aaa;
        transform: translateY(calc(var(--img-size) * -1));
      }
    }
  `,
}
