import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Icon, Image as ResImg, Img } from 'components'
import type * as T from 'gql/types'

interface ImgProps {
  edit?: boolean
  editSrc?: string
  setEditFile?(v?: File): void
  img: T.Img | null
}

function Image(
  { edit = false, setEditFile, img, editSrc }: ImgProps,
  ref: React.Ref<HTMLImageElement>
) {
  useEffect(() => {
    if (!edit) return
    setEditFile?.(undefined)
  }, [edit, setEditFile])

  return (
    <>
      <S.ImgWrap>
        {img && <ResImg base={img.base ?? ''} imgs={img.versions as Img[]} />}
        {editSrc && <S.Preview src={editSrc} alt="" ref={ref} />}
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
            setEditFile?.(file)
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
    overflow: hidden;

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

  Preview: styled.img`
    object-fit: cover;
  `,
}

export default Object.assign(
  React.forwardRef<HTMLImageElement, ImgProps>(Image),
  S
)
