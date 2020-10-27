import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Icon, ProfilePhotoCrop } from 'components'

interface ImgProps {
  src?: string
  edit?: boolean
  ratio: number
}

function Image({
  src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  edit = false,
  ratio = 1,
}: ImgProps) {
  const [photo, setPhoto] = useState<string>()

  useEffect(() => {
    if (!edit) return
    setPhoto(undefined)
  }, [edit])

  return (
    <>
      <S.ImgWrap>
        <img src={src} alt="" />
        <S.ImgEdit
          {...(edit && {
            onClick({ currentTarget }) {
              currentTarget.parentElement?.querySelector('input')?.click()
            },
          })}
        >
          <Icon icon="add_photo" />
        </S.ImgEdit>
        <input
          type="file"
          accept="image/*"
          onChange={({ target }) => {
            const reader = new FileReader()
            reader.onload = e => {
              const data = e.target?.result
              if (!data) return setPhoto(undefined)
              setPhoto(typeof data === 'string' ? data : data.toString())
            }
            reader.readAsDataURL((target as any).files[0])
          }}
          hidden
        />
      </S.ImgWrap>
      {photo && (
        <S.EditWrap>
          <ProfilePhotoCrop
            photo={photo}
            name="foo"
            onCancel={() => setPhoto(undefined)}
            onSave={console.log}
            ratio={ratio}
          />
        </S.EditWrap>
      )}
    </>
  )
}

const S = {
  ImgWrap: styled.div`
    position: relative;

    & > * {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  `,

  ImgEdit: styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #0002;
    backdrop-filter: blur(1px);
    opacity: 0;
    transition: opacity 0.2s ease;

    *[data-mode='edit'] & {
      opacity: 1;
      cursor: pointer;
    }

    & > * {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 2.5rem;
      height: 2.5rem;
      fill: #fff;
    }
  `,

  EditWrap: styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  `,
}

export default Object.assign(Image, S)
