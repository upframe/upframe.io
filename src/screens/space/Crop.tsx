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

interface Props {
  photo?: File
  onClose(): void
  ratio: number
  cover: boolean
  spaceId: string
}

export default function Crop({ photo, onClose, ratio, cover, spaceId }: Props) {
  const [src, setSrc] = useState<string>()
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
  }, [photo])

  async function upload(signedUrl: string) {
    if (!src) return
    try {
      const res = await fetch(signedUrl, { method: 'PUT', body: photo })
      if (!res.ok) throw await res.text()
    } catch (e) {
      notify('failed to upload image')
      onClose()
      throw e
    }
    setLoading(false)
    onClose()
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
        upload(data.spaceImgUploadLink)
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
        {!src || loading ? (
          <Spinner />
        ) : (
          <>
            <PhotoCrop photo={src} ratio={ratio} />
            <S.Actions>
              <Button onClick={onClose}>Cancel</Button>
              <Button accent onClick={submit}>
                Upload
              </Button>
            </S.Actions>
          </>
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
}
