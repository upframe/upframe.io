import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import * as S from './styles'
import * as interact from './interact'

interface Props {
  photo: string
  ratio?: number
  previewRef?: MutableRefObject<HTMLImageElement>
}

export default function PhotoCrop({ photo, ratio = 1, previewRef }: Props) {
  const selectRef = useRef() as MutableRefObject<HTMLDivElement>
  const imgRef = useRef() as MutableRefObject<HTMLImageElement>

  const zoomDone = useWaitForZoom(imgRef)
  useInitSelection({ imgRef, selectRef, previewRef, ratio, skip: !zoomDone })

  const update = previewRef?.current
    ? (x: number, y: number, w?: number, h?: number) =>
        updatePreview(previewRef.current, x, y, w, h)
    : undefined

  function drag() {
    if (!selectRef.current || !imgRef.current) return
    interact.drag(selectRef.current, imgRef.current, update)
  }

  function resize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!selectRef.current || !imgRef.current) return
    interact.resize(e, selectRef.current, imgRef.current, update)
  }

  return (
    <S.Frame>
      <S.Img src={photo} draggable={false} alt="original" ref={imgRef} />
      <S.Selection ref={selectRef} onMouseDown={drag}>
        <svg viewBox={`0 0 400 ${ratio * 400}`}>
          <rect width="100%" height="100%" />
          <rect width="100%" height="100%" />
        </svg>
        <S.Vt onMouseDown={resize} />
        <S.Vt onMouseDown={resize} />
        <S.Vt onMouseDown={resize} />
        <S.Vt onMouseDown={resize} />
      </S.Selection>
    </S.Frame>
  )
}

function useWaitForZoom(imgRef: MutableRefObject<HTMLImageElement>) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!imgRef.current) return

    const getScale = () =>
      imgRef.current.getBoundingClientRect().width / imgRef.current.offsetWidth

    let frameId: number

    const waitForZoom = () => {
      if (getScale() < 1) return (frameId = requestAnimationFrame(waitForZoom))
      setDone(true)
    }
    waitForZoom()

    return () => cancelAnimationFrame(frameId)
  }, [imgRef])

  return done
}

function useInitSelection({
  imgRef,
  selectRef,
  previewRef,
  ratio = 1,
  skip = false,
}: {
  imgRef: MutableRefObject<HTMLImageElement>
  selectRef: MutableRefObject<HTMLDivElement>
  previewRef?: MutableRefObject<HTMLImageElement>
  ratio?: number
  skip?: boolean
}) {
  const [initialized, setInit] = useState(false)

  useEffect(() => {
    if (skip || !selectRef.current || !imgRef.current) return

    const img = imgRef.current.getBoundingClientRect()
    selectRef.current.style.width = `${Math.min(img.width, img.height)}px`
    selectRef.current.style.height = `${Math.min(
      img.width * ratio,
      img.height * ratio
    )}px`
    let select = selectRef.current.getBoundingClientRect()
    const x = img.left - select.left + (img.width - select.width) / 2
    const y = img.top - select.top + (img.height - select.height) / 2
    selectRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`

    select = selectRef.current.getBoundingClientRect()

    setInit(true)
  }, [selectRef, imgRef, ratio, skip])

  useEffect(() => {
    if (
      !initialized ||
      !previewRef?.current ||
      !selectRef.current ||
      !imgRef.current
    )
      return

    const select = selectRef.current.getBoundingClientRect()
    const img = imgRef.current.getBoundingClientRect()

    updatePreview(
      previewRef.current,
      (select.x - img.x) / img.width,
      (select.y - img.y) / img.height,
      1 / (selectRef.current.offsetWidth / imgRef.current.offsetWidth),
      1 / (selectRef.current.offsetHeight / imgRef.current.offsetHeight)
    )
  }, [initialized, previewRef, selectRef, imgRef])
}

function updatePreview(
  preview: HTMLImageElement | undefined,
  offX: number,
  offY: number,
  width?: number,
  height?: number
) {
  if (!preview) return

  preview.style.transform = `translateX(-${Math.round(
    offX * 100
  )}%) translateY(-${Math.round(offY * 100)}%)`
  if (width) preview.style.width = `${width * 100}%`
  if (height) preview.style.height = `${height * 100}%`
}
