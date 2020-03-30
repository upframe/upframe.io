import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Shade, Title, Button, Icon } from '.'

export default function PhotoCrop({ photo, name, onCancel, onSave }) {
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
    previewRef.current.style.transform = `translateX(-${Math.round(
      ((select.x - img.x) / img.width) * 100
    )}%) translateY(-${Math.round(((select.y - img.y) / img.height) * 100)}%)`
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

  function crop() {
    const canvas = document.createElement('canvas')
    const selectRect = selectRef.current.getBoundingClientRect()
    const imgRect = imgRef.current.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const maxSizeMB = 5

    const resize = (scale = 1) => {
      canvas.width =
        (selectRect.width / imgRect.width) * imgRef.current.naturalWidth * scale
      canvas.height =
        (selectRect.height / imgRect.height) *
        imgRef.current.naturalHeight *
        scale

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          imgRef.current.naturalWidth,
          imgRef.current.naturalHeight,
          -((selectRect.left - imgRect.left) / imgRect.width) *
            imgRef.current.naturalWidth *
            scale,
          -(
            ((selectRect.top - imgRect.top) / imgRect.height) *
            imgRef.current.naturalHeight *
            scale
          ),
          imgRef.current.naturalWidth * scale,
          imgRef.current.naturalHeight * scale
        )
        let data = canvas.toDataURL()
        let size = Math.round((data.length * 3) / 4) / 10e5

        if (size > maxSizeMB && scale === 1) {
          resize(Math.sqrt((maxSizeMB / size) * 0.8))
        } else onSave(data)
      }
      img.src = photo
    }

    resize()
  }

  return (
    <Shade>
      <S.Container>
        <S.TitleRow>
          <Title s3>Crop your photo</Title>
          <Icon icon="close" onClick={onCancel} />
        </S.TitleRow>
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
          <S.Name>{name}</S.Name>
        </S.Preview>
        <S.BtWrap>
          <Button onClick={onCancel}>Cancel</Button>
          <Button filled onClick={crop}>
            Save
          </Button>
        </S.BtWrap>
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

    h4 {
      margin-bottom: 0.8rem;
    }
  `,

  TitleRow: styled.div`
    display: flex;
    justify-content: space-between;

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
    width: 30rem;
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
    border: 2px dashed #fff;
    cursor: pointer;

    &[data-grabbed='true'] {
      cursor: move;
    }
  `,

  Corner: styled.div`
    position: absolute;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    transform: translateX(-50%) translateY(-50%);

    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      background: #fff;
      left: 0.5rem;
      top: 0.5rem;
    }

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
    align-items: center;
  `,

  PreviewImgWrap: styled.div`
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
  `,

  Name: styled.p`
    color: #000;
    font-weight: bold;
    margin-left: 1rem;
    margin-top: 0;
    margin-bottom: 0;

    &::after {
      content: '';
      display: block;
      margin-top: 0.4rem;
      width: 10rem;
      height: 0.8rem;
      border-radius: 0.4rem;
      background: #e9e9e9;
    }
  `,

  BtWrap: styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 2.5rem;

    button {
      width: 6rem;
      margin-right: 0;
      margin-left: 1rem;
    }
  `,
}
