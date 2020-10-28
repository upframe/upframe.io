import React from 'react'
import * as S from './styles'

export function drag(
  select: HTMLDivElement,
  img: HTMLImageElement,
  updatePreview?: (x: number, y: number) => void
) {
  select.dataset.grabbed = 'true'

  const iBox = img.getBoundingClientRect()
  const container = (img.parentNode as HTMLElement).getBoundingClientRect()

  let { x, y, width, height } = select.getBoundingClientRect()

  function onMove(e: MouseEvent) {
    let newX = x
    let newY = y

    if (e.x >= iBox.left && e.x <= iBox.right)
      newX = Math.min(Math.max(x + e.movementX, iBox.x), iBox.right - width)
    if (e.y >= iBox.top && e.y <= iBox.bottom)
      newY = Math.min(Math.max(y + e.movementY, iBox.y), iBox.bottom - height)

    select.style.transform = `translate3d(${Math.round(
      newX - iBox.x + (iBox.x - container.x)
    )}px, ${Math.round(newY - iBox.y + (iBox.y - container.y))}px, 0)`

    x = newX
    y = newY

    updatePreview?.((x - iBox.x) / iBox.width, (y - iBox.y) / iBox.height)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener(
    'mouseup',
    () => {
      window.removeEventListener('mousemove', onMove)
      select.dataset.grabbed = 'false'
    },
    { once: true }
  )
}

enum Vt {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

export function resize(
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  select: HTMLDivElement,
  img: HTMLImageElement,
  updatePreview?: (x: number, y: number, w: number, h: number) => void
) {
  e.stopPropagation()

  const siblings: HTMLElement[] = Array.from(
    (e.target as any).parentNode.childNodes
  )
  const vts = siblings.filter(node =>
    node.classList.contains(S.Vt.styledComponentId)
  )

  const node: Vt = vts.indexOf(e.target as HTMLElement)
  const imgBox = img.getBoundingClientRect()
  const container = (img.parentElement as HTMLElement).getBoundingClientRect()

  function onMove(e: MouseEvent) {
    const box = select.getBoundingClientRect()
    const dir = Math.abs(e.movementX) >= Math.abs(e.movementY) ? 'HOR' : 'VERT'

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
    if (is.right) diff -= Math.max(box.right + diff - imgBox.right, 0)
    else if (is.left) diff -= Math.max(imgBox.left - (box.left - diff), 0)
    if (is.bottom) diff -= Math.max(box.bottom + diff - imgBox.bottom, 0)
    else if (is.top) diff -= Math.max(imgBox.top - (box.top - diff), 0)

    // translate
    let x = box.x - imgBox.x + (imgBox.x - container.x)
    let y = box.y - imgBox.y + (imgBox.y - container.y)

    if (is.left) x -= diff
    if (is.top) y -= diff

    select.style.transform = `translate3d(${x}px, ${y}px, 0)`

    // scale
    select.style.width = `${box.width + diff}px`
    select.style.height = `${box.height + diff}px`
    ;(select.firstChild as HTMLElement).setAttribute(
      'viewBox',
      `0 0 ${box.width + diff} ${box.height + diff}`
    )

    const selectBox = select.getBoundingClientRect()
    updatePreview?.(
      (selectBox.x - imgBox.x) / imgBox.width,
      (selectBox.y - imgBox.y) / imgBox.height,
      1 / (select.offsetWidth / img.offsetWidth),
      1 / (select.offsetHeight / img.offsetHeight)
    )
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener(
    'mouseup',
    () => window.removeEventListener('mousemove', onMove),
    { once: true }
  )
}
