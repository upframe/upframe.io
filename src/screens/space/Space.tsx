import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from 'gql'
import type { SpacePage, SpacePageVariables } from 'gql/types'
import * as C from 'components'
import PhotoCrop from './Crop'
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
import { useMatchMedia, useMe } from 'utils/hooks'
import { SPACE_QUERY, REMOVE_MEMBER } from './gql'

export default function Space({ match }) {
  const history = useHistory()
  const [invite, setInvite] = useState<Role>()
  const [showContext, setShowContext] = useState(false)
  const [key, setKey] = useState(0)
  const [coverEditFile, setCoverEditFile] = useState<File>()
  const [photoEditFile, setPhotoEditFile] = useState<File>()
  const [coverEditSrc, setCoverEditSrc] = useState<string>()
  const [photoEditSrc, setPhotoEditSrc] = useState<string>()
  const photoRef = useRef() as React.MutableRefObject<HTMLImageElement>
  const coverRef = useRef() as React.MutableRefObject<HTMLImageElement>
  const { data, loading } = useQuery<SpacePage, SpacePageVariables>(
    SPACE_QUERY,
    {
      variables: { handle: match.params.handle.toLowerCase() },
    }
  )
  const isMobile = useMatchMedia(mobile)
  const { me } = useMe()

  const [leave] = useMutation(REMOVE_MEMBER, {
    variables: { spaceId: data?.space?.id, userId: me?.id },
    update(cache) {
      ;(cache as any).data.delete(`Space|${data?.space?.id}`)
      setKey(key + 1)
    },
  })

  if (loading) return <C.Spinner />
  if (!data?.space) return <Redirect to="/404" />

  if (me?.role === 'ADMIN') {
    data.space.isMember = true
    data.space.isOwner = true
  }
  const {
    id,
    isMember,
    isOwner,
    name,
    handle,
    description,
    mentors,
    cover,
    photo,
  } = data.space

  if (match.params.handle !== handle)
    requestAnimationFrame(() => history.replace(`${path(1)}/${handle}`))

  const sidebar = <Sidebar {...data.space} />

  return (
    <>
      <Helmet>
        <title>{name} | Upframe</title>
      </Helmet>
      <S.Space data-view={isMember ? 'member' : 'external'} key={key}>
        <S.Main>
          <S.MainWrap>
            <S.Info
              data-mode={
                path().split('/').pop() === 'settings' ? 'edit' : 'view'
              }
            >
              <Image
                edit={path().split('/').pop() === 'settings'}
                setEditFile={setCoverEditFile}
                img={cover}
                editSrc={coverEditSrc}
                ref={coverRef}
                isCover
              />
              <div>
                <Image
                  edit={path().split('/').pop() === 'settings'}
                  setEditFile={setPhotoEditFile}
                  img={photo}
                  editSrc={photoEditSrc}
                  ref={photoRef}
                />
                <S.InfoContent>
                  <C.Title size={2}>{name}</C.Title>
                  <C.Text>{description}</C.Text>
                </S.InfoContent>
                <S.InfoActions>
                  {isOwner && <InviteButton onSelect={setInvite} />}
                  {isMember && (
                    <S.Context>
                      <C.Icon
                        icon="more"
                        onClick={() => setShowContext(!showContext)}
                      />
                      {showContext && (
                        <C.Dropdown
                          onClose={() => setShowContext(false)}
                          onClick={item => {
                            if (item !== 'leave') return
                            leave()
                          }}
                        >
                          <span key="leave">Leave {name}</span>
                        </C.Dropdown>
                      )}
                    </S.Context>
                  )}
                </S.InfoActions>
              </div>
            </S.Info>
            <Navigation isOwner={isOwner ?? false} />
            <C.Switch>
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
                    render={() => <C.AuditTrail trailId={`SPACE|${id}`} />}
                  ></Route>
                </>
              )}
              {isMobile && (
                <Route path={path(2) + '/info'} render={() => sidebar} />
              )}
              <Redirect to={path(2)} />
            </C.Switch>
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
      {(coverEditFile || photoEditFile) && (
        <PhotoCrop
          photo={coverEditFile ?? photoEditFile}
          ratio={coverEditFile ? coverRatio : 1}
          cover={!!coverEditFile}
          src={coverEditFile ? coverEditSrc : photoEditSrc}
          preview={coverEditFile ? coverRef : photoRef}
          setSrc={coverEditFile ? setCoverEditSrc : setPhotoEditSrc}
          spaceId={id}
          onClose={keep => {
            setCoverEditFile(undefined)
            setPhotoEditFile(undefined)
            if (!coverEditFile || !keep) setCoverEditSrc(undefined)
            if (!photoEditFile || !keep) setPhotoEditSrc(undefined)
          }}
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
    margin-top: -1rem;

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
      padding-top: 0;

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

    @media ${mobile} {
      width: 100%;
    }
  `,

  MainWrap: styled.div`
    max-width: ${contentWidth}px;
    width: 100%;
    margin: auto;

    *[data-view='external'] & > *:not(:first-child) {
      display: none;
    }

    @media ${mobile} {
      nav {
        margin: 2rem calc(var(--side-padding) * -1);
        width: 100vw;
        box-sizing: border-box;
        padding: 0 var(--side-padding);
        position: sticky;
        top: 0;

        ol::after {
          content: '';
          display: block;
          position: absolute;
          left: 100%;
          width: var(--side-padding);
          height: 100%;
        }
      }
    }
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #0003;
    border-radius: 0.5rem;
    width: 100%;
    height: ${2 * coverRatio * contentWidth}px;
    overflow-x: hidden;

    @media (max-width: ${(contentWidth + sidebarWidth + columnGap) /
      (1 - sidePadding * 2)}px) {
      height: calc(
        ${`(${100 - sidePadding * 200}vw - ${
          sidebarWidth + columnGap
        }px) * ${coverRatio} * 2`}
      );
    }

    @media ${mobile} {
      height: auto;
      border-radius: unset;
      border: none;
      margin-left: calc(var(--side-padding) * -1);
      width: calc(100% + var(--side-padding) * 2);

      & > *:first-child {
        height: calc((100vw - var(--side-padding) * 2) * ${coverRatio});
      }
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
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    & > div:last-child {
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;

      --img-size: 7rem;
      --photo-translate: -0.75;

      & > ${Image.ImgWrap} {
        position: absolute;
        width: 7rem;
        height: 7rem;
        border: 0.4rem solid #fff;
        border-radius: 0.5rem;
        background-color: #aaa;
        transform: translateY(calc(var(--img-size) * var(--photo-translate)));
        box-shadow: 0 0 6px #0004;
      }

      @media ${mobile} {
        --photo-translate: -0.5;

        button,
        svg {
          display: none;
        }
      }
    }
  `,

  InfoContent: styled.div`
    padding-top: calc(var(--img-size) * (var(--photo-translate) + 1));

    h2 {
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }

    p {
      margin-top: 0;
    }

    @media ${mobile} {
      h2 {
        margin-top: 1rem;
      }

      p {
        margin-bottom: 0;
      }
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

  Context: styled.div`
    position: relative;
    height: 1.5rem;

    ol {
      left: unset;
      right: 0;
    }
  `,
}
