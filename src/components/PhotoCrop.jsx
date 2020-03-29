import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Shade, Title } from '.'

export default function PhotoCrop({ photo }) {
  const selectRef = useRef()
  const previewRef = useRef()
  const imgRef = useRef()

  useEffect(() => {
    if (!selectRef.current || !previewRef.current || !imgRef.current) return
    const img = imgRef.current.getBoundingClientRect()
    selectRef.current.style.width = `${Math.min(img.width, img.height)}px`
    selectRef.current.style.height = `${Math.min(img.width, img.height)}px`
    let select = selectRef.current.getBoundingClientRect()
    selectRef.current.style.left = `${img.left -
      select.left +
      (img.width - select.width) / 2}px`
    selectRef.current.style.top = `${img.top -
      select.top +
      (img.height - select.height) / 2}px`

    select = selectRef.current.getBoundingClientRect()
    previewRef.current.style.width = `${(1 /
      (selectRef.current.offsetWidth / imgRef.current.offsetWidth)) *
      100}%`
    previewRef.current.style.transform = `translateX(-${((select.x - img.x) /
      img.width) *
      100}%) translateY(-${((select.y - img.y) / img.height) * 100}%)`
  }, [selectRef, previewRef, imgRef])

  function dragStart() {
    let dragPoint
    selectRef.current.dataset.grabbed = true

    const img = imgRef.current.getBoundingClientRect()
    const container = imgRef.current.parentNode.getBoundingClientRect()
    const boundary = {
      left: img.x - container.x,
      width: container.width - (img.x - container.x),
      top: img.y - container.y,
      height: container.height - (img.y - container.y),
    }

    function onMove(e) {
      const { x, y } = selectRef.current.getBoundingClientRect()
      if (!dragPoint) dragPoint = { x: e.x - x, y: e.y - y }

      if (e.movementX > 0 ? e.x >= x + dragPoint.x : e.x <= x + dragPoint.x)
        selectRef.current.style.left = `${Math.min(
          Math.max(selectRef.current.offsetLeft + e.movementX, boundary.left),
          boundary.width - selectRef.current.offsetWidth
        )}px`
      if (e.movementY > 0 ? e.y >= y + dragPoint.y : e.y <= y + dragPoint.y)
        selectRef.current.style.top = `${Math.min(
          Math.max(selectRef.current.offsetTop + e.movementY, boundary.top),
          boundary.height - selectRef.current.offsetHeight
        )}px`

      previewRef.current.style.transform = `translateX(-${((x - img.x) /
        img.width) *
        100}%) translateY(-${((y - img.y) / img.height) * 100}%)`
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', onMove)
        selectRef.current.dataset.grabbed = false
      },
      { once: true }
    )
  }

  function resize(e) {
    e.stopPropagation()
    const node = Array.from(e.target.parentNode.childNodes).indexOf(e.target)
    const img = imgRef.current.getBoundingClientRect()

    function onMove(e) {
      const select = selectRef.current.getBoundingClientRect()

      let width =
        select.width + e.movementX * (node === 1 || node === 2 ? 1 : -1)
      let height =
        select.height + e.movementY * (node === 2 || node === 3 ? 1 : -1)

      const size = Math.max(
        Math.abs(e.movementX) > Math.abs(e.movementY) ? width : height,
        50
      )

      if (node === 0) {
        const bound = Math.min(
          size,
          img.width - (img.x + img.width - (select.x + select.width)),
          img.height - (img.y + img.height - (select.y + select.height))
        )
        selectRef.current.style.left = `${selectRef.current.offsetLeft -
          (bound - select.width)}px`
        selectRef.current.style.top = `${selectRef.current.offsetTop -
          (bound - select.height)}px`
        selectRef.current.style.width = `${bound}px`
        selectRef.current.style.height = `${bound}px`
      } else if (node === 1) {
        const bound = Math.min(
          size,
          img.width - (select.left - img.left),
          img.height - (img.y + img.height - (select.y + select.height))
        )
        selectRef.current.style.top = `${selectRef.current.offsetTop -
          (bound - select.height)}px`
        selectRef.current.style.width = `${bound}px`
        selectRef.current.style.height = `${bound}px`
      } else if (node === 2) {
        const bound = Math.min(
          size,
          img.width - (select.left - img.left),
          img.height - (select.top - img.top)
        )
        selectRef.current.style.width = `${bound}px`
        selectRef.current.style.height = `${bound}px`
      } else if (node === 3) {
        const bound = Math.min(
          size,
          img.width - (img.x + img.width - (select.x + select.width)),
          img.height - (select.top - img.top)
        )
        selectRef.current.style.left = `${selectRef.current.offsetLeft -
          (bound - select.width)}px`
        selectRef.current.style.width = `${bound}px`
        selectRef.current.style.height = `${bound}px`
      }

      previewRef.current.style.width = `${(1 /
        (selectRef.current.offsetWidth / imgRef.current.offsetWidth)) *
        100}%`
      previewRef.current.style.transform = `translateX(-${((select.x - img.x) /
        img.width) *
        100}%) translateY(-${((select.y - img.y) / img.height) * 100}%)`
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener(
      'mouseup',
      () => window.removeEventListener('mousemove', onMove),
      { once: true }
    )
  }

  return (
    <Shade>
      <S.Container>
        <Title s3>Crop your photo</Title>
        <S.Frame>
          <S.Img src={photo} draggable={false} alt="original" ref={imgRef} />
          <S.Selection ref={selectRef} onMouseDown={dragStart}>
            <S.Corner onMouseDown={resize} />
            <S.Corner onMouseDown={resize} />
            <S.Corner onMouseDown={resize} />
            <S.Corner onMouseDown={resize} />
          </S.Selection>
        </S.Frame>
        <Title s4>Preview</Title>
        <S.Preview>
          <S.PreviewImgWrap>
            <img ref={previewRef} alt="preview" src={photo} />
          </S.PreviewImgWrap>
        </S.Preview>
      </S.Container>
    </Shade>
  )
}

const S = {
  Container: styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
    padding: 1rem 1.5rem;
    background: #fff;
    border-radius: 0.5rem;
    user-select: none;

    h3 {
      margin-top: 0;
      color: #000;
    }
  `,

  Frame: styled.div`
    position: relative;
    display: block;
    background-color: #f7f7f7;
    overflow: hidden;
    height: 25rem;
    width: 25rem;
  `,

  Img: styled.img`
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    user-select: none;
  `,

  Selection: styled.div`
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 5rem;
    height: 5rem;
    border: 5px dotted #f00;
    cursor: pointer;

    &[data-grabbed='true'] {
      cursor: move;
    }
  `,

  Corner: styled.div`
    position: absolute;
    display: block;
    width: 1rem;
    height: 1rem;
    background: red;
    transform: translateX(-50%) translateY(-50%);

    &:nth-child(1) {
      cursor: nwse-resize;
    }
    &:nth-child(2) {
      left: 100%;
      cursor: nesw-resize;
    }
    &:nth-child(3) {
      left: 100%;
      top: 100%;
      cursor: nwse-resize;
    }
    &:nth-child(4) {
      top: 100%;
      cursor: nesw-resize;
    }
  `,

  Preview: styled.div`
    display: flex;
  `,

  PreviewImgWrap: styled.div`
    width: 5rem;
    height: 5rem;
    overflow: hidden;
  `,
}
