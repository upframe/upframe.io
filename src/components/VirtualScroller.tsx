import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { parseSize } from '../utils/css'
import Scroller from '../utils/scroller'

interface Props {
  itemHeight: string
  Child(...args: any[]): JSX.Element
  props(index: number): any
  min?: number
  max?: number
  buffer?: number
  startAt?: number
}

const VirtualScroller: React.FunctionComponent<Props> = ({
  itemHeight,
  Child,
  props,
  min = -Infinity,
  max = Infinity,
  buffer = 2,
  startAt = min === -Infinity ? 0 : min,
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [height, setHeight] = useState<number>()
  const [children, setChildren] = useState<ReturnType<Props['Child']>[]>([])
  const [offTop, setOffTop] = useState(0)
  const [offBottom, setOffBottom] = useState(0)
  const [itemPx] = useState(parseSize(itemHeight))

  const [scroller, setScroller] = useState<
    Scroller<ReturnType<Props['Child']>>
  >()

  useEffect(() => {
    if (!ref.current) return
    setHeight(ref.current.offsetHeight)
  }, [ref, itemPx])

  useEffect(() => {
    if (!ref.current || !scroller) return
    const node = ref.current
    let lastPos = node.scrollTop
    let lastScroll = performance.now()
    let animFrame: number

    function checkScroll() {
      if (!scroller) return
      animFrame = requestAnimationFrame(checkScroll)
      if (node.scrollTop === lastPos) return

      lastPos = node.scrollTop
      lastScroll = performance.now()

      const ot = Math.floor(node.scrollTop / itemPx)
      const { frame, off } = scroller.read(ot + min)
      setChildren(frame)
      setOffTop(ot - (scroller.buffer - off))
      setOffBottom(
        scroller.max -
          scroller.min -
          ot -
          scroller.view -
          (scroller.buffer / 2 + off)
      )
    }

    let timeoutId: number

    function checkScrollStop() {
      if (performance.now() - lastScroll > 100) {
        cancelAnimationFrame(animFrame)
        listenScrollStart()
      } else timeoutId = setTimeout(checkScrollStop, 500)
    }

    function onScrollStart() {
      checkScroll()
      timeoutId = setTimeout(checkScrollStop, 500)
    }

    const listenScrollStart = () =>
      node.addEventListener('scroll', onScrollStart, {
        passive: true,
        once: true,
      })

    listenScrollStart()

    return () => {
      node.removeEventListener('scroll', onScrollStart)
      cancelAnimationFrame(animFrame)
      clearTimeout(timeoutId)
    }
  }, [ref, scroller, itemPx, min])

  useEffect(() => {
    if (!height || scroller) return
    const heightPx = parseSize(itemHeight)

    const _scroller = new Scroller(
      i => <Child key={i} {...props(i)} />,
      Math.ceil(height / heightPx),
      buffer,
      min,
      max
    )
    setScroller(_scroller)

    const { frame, off } = _scroller.read(startAt)
    setChildren(frame)
    const scroll = (buffer - off) * itemPx
    setOffTop(0)
    setOffBottom(
      max - min - (startAt + Math.ceil(height / heightPx) + 2 * buffer)
    )
    if (scroll) ref.current.scrollTo({ top: scroll })
  }, [height, itemHeight, buffer, min, max, props, startAt, itemPx, scroller])

  useEffect(() => {
    if (!scroller) return
    if (min !== undefined && min !== scroller.min) {
      const top = (scroller.min - min) * itemPx
      scroller.min = min
      ref.current.scrollBy({ top })
    }
    if (max !== undefined && max !== scroller.max) scroller.max = max
  }, [min, max, scroller, offTop, itemPx, offBottom])

  return (
    <S.Scroller
      ref={ref}
      paddTop={offTop}
      paddBottom={offBottom}
      itemSize={itemHeight}
    >
      {children}
    </S.Scroller>
  )
}

interface ScScrollProps {
  paddTop: number
  paddBottom: number
  itemSize: string
}

const S = {
  Scroller: styled.div.attrs((p: ScScrollProps) => ({
    style: {
      '--padd-top': `calc(${p.paddTop} * ${p.itemSize})`,
      '--padd-bottom': `calc(${p.paddBottom} * ${p.itemSize})`,
    },
  }))<ScScrollProps>`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    width: 30rem;
    margin: auto;
    height: 70vh;
    overflow-y: auto;

    & > * {
      transform: translateY(var(--padd-top));
    }

    & > *:last-child {
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(VirtualScroller, { sc: S.Scroller })
