import React, { useRef, useEffect, useState, MutableRefObject } from 'react'
import styled from 'styled-components'
import { Title, Button, Modal, Spinner } from '.'

const MAX_IMG_SIZE = 5e6

interface Props {
  photo: string
  name: string
  onCancel(): void
  onSave(data: string): void
  ratio?: number
}

enum Vt {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

export default function PhotoCrop({
  photo,
  name,
  onCancel,
  onSave,
  ratio = 1,
}: Props) {
  const selectRef = useRef() as MutableRefObject<HTMLDivElement>
  const previewRef = useRef() as MutableRefObject<HTMLImageElement>
  const imgRef = useRef() as MutableRefObject<HTMLImageElement>
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectRef.current || !previewRef.current || !imgRef.current || loading)
      return

    const getScale = () =>
      imgRef.current.getBoundingClientRect().width / imgRef.current.offsetWidth

    const waitForZoom = () => {
      if (getScale() < 1) return requestAnimationFrame(waitForZoom)
      init()
    }
    waitForZoom()

    function init() {
      const img = imgRef.current.getBoundingClientRect()
      selectRef.current.style.width = `${Math.min(img.width, img.height)}px`
      selectRef.current.style.height = `${Math.min(
        img.width * ratio,
        img.height * ratio
      )}px`
      let select = selectRef.current.getBoundingClientRect()
      selectRef.current.style.left = `${
        img.left - select.left + (img.width - select.width) / 2
      }px`
      selectRef.current.style.top = `${
        img.top - select.top + (img.height - select.height) / 2
      }px`

      select = selectRef.current.getBoundingClientRect()
      previewRef.current.style.width = `${
        (1 / (selectRef.current.offsetWidth / imgRef.current.offsetWidth)) * 100
      }%`
      previewRef.current.style.transform = `translateX(-${Math.round(
        ((select.x - img.x) / img.width) * 100
      )}%) translateY(-${Math.round(((select.y - img.y) / img.height) * 100)}%)`
    }
  }, [selectRef, previewRef, imgRef, loading, ratio])

  function dragStart() {
    let dragPoint: { x: number; y: number }
    selectRef.current.dataset.grabbed = 'true'

    const img = imgRef.current.getBoundingClientRect()
    const container = (imgRef.current
      .parentNode as HTMLElement).getBoundingClientRect()
    const boundary = {
      left: img.x - container.x,
      width: container.width - (img.x - container.x),
      top: img.y - container.y,
      height: container.height - (img.y - container.y),
    }

    function onMove(e: MouseEvent) {
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

      previewRef.current.style.transform = `translateX(-${
        ((x - img.x) / img.width) * 100
      }%) translateY(-${((y - img.y) / img.height) * 100}%)`
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', onMove)
        selectRef.current.dataset.grabbed = 'false'
      },
      { once: true }
    )
  }

  function resize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    const node: Vt = Array.from(
      (e.target as any).parentNode.childNodes
    ).indexOf(e.target)
    const img = imgRef.current.getBoundingClientRect()

    function onMove(e: MouseEvent) {
      const select = selectRef.current
      const box = select.getBoundingClientRect()

      const dir =
        Math.abs(e.movementX) >= Math.abs(e.movementY) ? 'HOR' : 'VERT'

      let diff =
        dir === 'HOR'
          ? e.movementX *
            (node === Vt.TOP_RIGHT || node === Vt.BOTTOM_RIGHT ? 1 : -1)
          : e.movementY *
            (node === Vt.BOTTOM_LEFT || node === Vt.BOTTOM_RIGHT ? 1 : -1)

      const MIN_SIZE = 50
      if (box.width + diff < MIN_SIZE) diff = MIN_SIZE - box.width
      if (box.height + diff < MIN_SIZE) diff = MIN_SIZE - box.height

      if (diff === 0) return

      const is = {
        left: [Vt.TOP_LEFT, Vt.BOTTOM_LEFT].includes(node),
        right: [Vt.TOP_RIGHT, Vt.BOTTOM_RIGHT].includes(node),
        top: [Vt.TOP_LEFT, Vt.TOP_RIGHT].includes(node),
        bottom: [Vt.BOTTOM_LEFT, Vt.BOTTOM_RIGHT].includes(node),
      }

      // bound check adjustment
      if (is.right) diff -= Math.max(box.right + diff - img.right, 0)
      else if (is.left) diff -= Math.max(img.left - (box.left - diff), 0)
      if (is.bottom) diff -= Math.max(box.bottom + diff - img.bottom, 0)
      else if (is.top) diff -= Math.max(img.top - (box.top - diff), 0)

      // translate
      if (is.left) select.style.left = `${select.offsetLeft - diff}px`
      if (is.top) select.style.top = `${select.offsetTop - diff}px`

      // scale
      select.style.width = `${box.width + diff}px`
      select.style.height = `${box.height + diff}px`
      ;(select.firstChild as HTMLElement).setAttribute(
        'viewBox',
        `0 0 ${box.width + diff} ${box.height + diff}`
      )

      previewRef.current.style.width = `${
        (1 / (select.offsetWidth / imgRef.current.offsetWidth)) * 100
      }%`
      previewRef.current.style.transform = `translateX(-${
        ((box.x - img.x) / img.width) * 100
      }%) translateY(-${((box.y - img.y) / img.height) * 100}%)`
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener(
      'mouseup',
      () => window.removeEventListener('mousemove', onMove),
      { once: true }
    )
  }

  function crop() {
    const selectRect = selectRef.current.getBoundingClientRect()
    const imgRect = imgRef.current.getBoundingClientRect()
    const { naturalWidth, naturalHeight } = imgRef.current
    setLoading(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const resize = (scale = 1) => {
      canvas.width = (selectRect.width / imgRect.width) * naturalWidth * scale
      canvas.height =
        (selectRect.height / imgRect.height) * naturalHeight * scale

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          naturalWidth,
          naturalHeight,
          -((selectRect.left - imgRect.left) / imgRect.width) *
            naturalWidth *
            scale,
          -(
            ((selectRect.top - imgRect.top) / imgRect.height) *
            naturalHeight *
            scale
          ),
          naturalWidth * scale,
          naturalHeight * scale
        )
        let data = canvas.toDataURL()
        const size = new Blob([data]).size

        if (size > MAX_IMG_SIZE) {
          resize(scale * (1 / Math.sqrt(size / MAX_IMG_SIZE)) * 0.99)
        } else onSave(data)
      }
      img.src = photo
    }

    resize()
  }

  if (loading)
    return (
      <Modal title="Uploading your photo…">
        <Spinner />
      </Modal>
    )
  return (
    <Modal
      title="Crop you photo"
      actions={[
        <Button onClick={onCancel} key="cancel">
          Cancel
        </Button>,
        <Button filled onClick={crop} key="save">
          Save
        </Button>,
      ]}
      cstSize
    >
      <S.Frame>
        <S.Img src={photo} draggable={false} alt="original" ref={imgRef} />
        <S.Selection ref={selectRef} onMouseDown={dragStart}>
          <svg viewBox="0 0 400 400">
            <rect width="100%" height="100%" />
            <rect width="100%" height="100%" />
          </svg>
          <S.Vt onMouseDown={resize} />
          <S.Vt onMouseDown={resize} />
          <S.Vt onMouseDown={resize} />
          <S.Vt onMouseDown={resize} />
        </S.Selection>
      </S.Frame>
      <Title size={4}>Preview</Title>
      <S.Preview>
        <S.PreviewImgWrap>
          <img ref={previewRef} alt="preview" src={photo} />
        </S.PreviewImgWrap>
        <S.Name>{name}</S.Name>
      </S.Preview>
    </Modal>
  )
}

const S = {
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
    cursor: pointer;

    svg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      --dash-size: 5px;

      rect {
        fill: none;
        stroke: #fff;
        stroke-width: 2px;
        stroke-dasharray: var(--dash-size);
        animation: revolve-border 10s linear infinite;
      }

      rect:first-of-type {
        animation-name: revolve-border1;

        @keyframes revolve-border1 {
          to {
            stroke-dashoffset: calc(var(--dash-size) * 20);
          }
        }
      }

      rect:last-of-type {
        stroke: #0008;
        stroke-dashoffset: var(--dash-size);
        animation-name: revolve-border2;

        @keyframes revolve-border2 {
          from {
            stroke-dashoffset: var(--dash-size);
          }

          to {
            stroke-dashoffset: calc(var(--dash-size) * 21);
          }
        }
      }
    }

    &[data-grabbed='true'] {
      cursor: move;
    }
  `,

  Vt: styled.div`
    position: absolute;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    transform: translateX(-50%) translateY(-50%);

    &::after {
      content: '';
      position: absolute;
      display: block;

      --size: 0.6rem;

      width: var(--size);
      height: var(--size);
      left: calc((100% - var(--size)) / 2);
      top: calc((100% - var(--size)) / 2);
      background: var(--cl-secondary);
      border: 1px solid #fff;
      border-radius: 50%;
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
    border-radius: calc(var(--border-radius) / 2);
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
}
