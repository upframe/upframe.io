import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Icon } from 'components'

interface ImgProps {
  src?: string
  edit?: boolean
  setEditSrc?(v?: File): void
}

function Image({
  src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  edit = false,
  setEditSrc,
}: ImgProps) {
  useEffect(() => {
    if (!edit) return
    setEditSrc?.(undefined)
  }, [edit, setEditSrc])

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
            const file = target.files?.[0]
            if (!file) return
            setEditSrc?.(file)
          }}
          hidden
        />
      </S.ImgWrap>
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
