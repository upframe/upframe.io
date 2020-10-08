import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'
import type { SpacePage, SpacePageVariables } from 'gql/types'
import { Spinner, Title, Text } from 'components'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { path } from 'utils/url'
import { parseSize } from 'utils/css'
import Navigation from './Navigation'
import Mentors from './Mentors'

const SPACE_QUERY = gql`
  query SpacePage($handle: String!) {
    space(handle: $handle) {
      id
      name
      handle
      description
    }
  }
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

  const { id, name, handle, description } = data.space

  if (match.params.handle !== handle)
    requestAnimationFrame(() => history.replace(`${path(1)}/${handle}`))

  return (
    <S.Space>
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
              component={() => <Mentors spaceId={id} />}
            ></Route>
            <Route
              exact
              path={path(2) + '/people'}
              component={() => <div>people</div>}
            ></Route>
            <Route
              exact
              path={path(2) + '/settings'}
              component={() => <div>settings</div>}
            ></Route>
            <Route
              exact
              path={path(2) + '/activity'}
              component={() => <div>activity</div>}
            ></Route>
            <Redirect to={path(2)} />
          </Switch>
        </S.MainWrap>
      </S.Main>
      <S.Sidebar></S.Sidebar>
    </S.Space>
  )
}

const sidePadding = parseSize('2rem')
const sidebarWidth = parseSize('18rem')
const coverWidth = parseSize('40rem')
const coverRatio = 1 / 4

const S = {
  Space: styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
    padding: 2rem ${sidePadding}px;
  `,

  Main: styled.div`
    flex: 1 1;
  `,

  MainWrap: styled.div`
    margin: auto;
    max-width: 60rem;
    width: 100%;
  `,

  Sidebar: styled.div`
    height: 100vh;
    flex: 0 0 ${sidebarWidth}px;
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #0003;
    border-radius: 0.5rem;

    --cover-width: ${coverWidth}px;

    width: min(var(--cover-width), 100%);
    height: calc(2 * ${coverRatio} * var(--cover-width));

    @media (max-width: ${coverWidth + sidebarWidth + sidePadding * 2}px) {
      background: red;
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
