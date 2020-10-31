import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, PhotoCrop, Button, Spinner } from 'components'
import { gql } from 'gql'
import type * as T from 'gql/types'
import api from 'api'
import { notify } from 'notification'
import { Frame } from 'components/PhotoEdit/styles'

const UPLOAD_URL = gql`
  query RequestSpaceImgUpload(
    $spaceId: ID!
    $type: SpacePhotoType!
    $ext: String!
  ) {
    spaceImgUploadLink(spaceId: $spaceId, type: $type, ext: $ext)
  }
`

const PROCESS_IMG = gql`
  mutation ProcessSpaceImg($signedUrl: String!, $crop: CropInput!) {
    processSpaceImage(signedUrl: $signedUrl, crop: $crop)
  }
`

interface Props {
  photo?: File
  onClose(keep?: boolean): void
  ratio: number
  cover: boolean
  spaceId: string
  src?: string
  setSrc(v?: string): void
  preview?: React.MutableRefObject<HTMLImageElement>
}

export default function Crop({
  photo,
  onClose,
  ratio,
  cover,
  spaceId,
  src,
  setSrc,
  preview,
}: Props) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!photo) return setSrc(undefined)
    const reader = new FileReader()
    reader.onload = e => {
      const data = e.target?.result
      if (!data) return setSrc(undefined)
      setSrc(typeof data === 'string' ? data : data.toString())
    }
    reader.readAsDataURL(photo)
  }, [photo, setSrc])

  async function upload(signedUrl: string) {
    if (!src) return
    const frame = document.querySelector(`.${Frame.styledComponentId}`)
    const img = frame?.querySelector('img')?.getBoundingClientRect()
    const select = frame?.querySelector('div')?.getBoundingClientRect()
    if (!frame || !img || !select) throw Error("couldn't select frame")

    const left = (select.left - img.left) / img.width
    const top = (select.top - img.top) / img.height
    const width = select.width / img.width

    try {
      const res = await fetch(signedUrl, { method: 'PUT', body: photo })
      if (!res.ok) throw await res.text()

      await api.mutate<T.ProcessSpaceImg, T.ProcessSpaceImgVariables>({
        mutation: PROCESS_IMG,
        variables: { signedUrl, crop: { left, top, width, ratio } },
      })
    } catch (e) {
      notify('failed to upload image')
      onClose()
      throw e
    }
    setLoading(false)
    onClose(true)
  }

  function submit() {
    if (!photo) return
    setLoading(true)
    api
      .query<T.RequestSpaceImgUpload, T.RequestSpaceImgUploadVariables>({
        query: UPLOAD_URL,
        variables: {
          spaceId,
          type: (cover ? 'COVER' : 'PROFILE') as any,
          ext: photo.type.replace(/^image\//, ''),
        },
      })
      .then(({ data }) => {
        if (!data.spaceImgUploadLink) {
          notify("couldn't request upload link")
          return onClose
        }
        try {
          upload(data.spaceImgUploadLink)
        } catch (e) {
          notify("couldn't upload image")
          throw e
        }
      })
  }

  return (
    <S.Wrap>
      <Modal
        cancellable={false}
        onClose={onClose}
        title={`Select ${cover ? 'cover' : 'space'} image`}
        cstSize
      >
        {src && <PhotoCrop photo={src} ratio={ratio} previewRef={preview} />}
        <S.Actions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button accent onClick={submit}>
            Upload
          </Button>
        </S.Actions>
        {(!src || loading) && (
          <S.Loading>
            <Spinner />
          </S.Loading>
        )}
      </Modal>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    display: contents;

    ${Modal.Modal} {
      width: 50rem;
      max-width: 100vw;
    }

    ${Frame} {
      width: initial;
    }
  `,

  Actions: styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;

    button:last-child {
      margin-left: 1rem;
    }
  `,

  Loading: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(2px);

    svg {
      position: absolute;
      left: calc(50% - 2.5rem);
      top: calc(50% - 2.5rem);
    }
  `,
}
