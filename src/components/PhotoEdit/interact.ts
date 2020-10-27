import React from 'react'
import * as S from './styles'

export function drag(
  select: HTMLDivElement,
  img: HTMLImageElement,
  updatePreview?: (x: number, y: number) => void
) {
  let dragPoint: { x: number; y: number }
  select.dataset.grabbed = 'true'

  const imgBox = img.getBoundingClientRect()
  const container = (img.parentNode as HTMLElement).getBoundingClientRect()
  const boundary = {
    left: imgBox.x - container.x,
    width: container.width - (imgBox.x - container.x),
    top: imgBox.y - container.y,
    height: container.height - (imgBox.y - container.y),
  }

  function onMove(e: MouseEvent) {
    const { x, y } = select.getBoundingClientRect()
    if (!dragPoint) dragPoint = { x: e.x - x, y: e.y - y }

    if (e.movementX > 0 ? e.x >= x + dragPoint.x : e.x <= x + dragPoint.x)
      select.style.left = `${Math.min(
        Math.max(select.offsetLeft + e.movementX, boundary.left),
        boundary.width - select.offsetWidth
      )}px`
    if (e.movementY > 0 ? e.y >= y + dragPoint.y : e.y <= y + dragPoint.y)
      select.style.top = `${Math.min(
        Math.max(select.offsetTop + e.movementY, boundary.top),
        boundary.height - select.offsetHeight
      )}px`

    updatePreview?.(
      (x - imgBox.x) / imgBox.width,
      (y - imgBox.y) / imgBox.height
    )
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
    if (is.left) select.style.left = `${select.offsetLeft - diff}px`
    if (is.top) select.style.top = `${select.offsetTop - diff}px`

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
