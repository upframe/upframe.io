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

    function onScroll() {
      if (!scroller) return
      const ot = (node.scrollTop / itemPx) | 0

      const { frame, off } = scroller.read(ot)
      setChildren(frame)
      setOffTop(ot - (2 - off))
      setOffBottom(
        scroller.max - (ot - (2 - off) + scroller.view + 2 * scroller.buffer)
      )
    }

    node.addEventListener('scroll', onScroll)
    return () => node.removeEventListener('scroll', onScroll)
  }, [ref, scroller, itemPx])

  useEffect(() => {
    if (!height) return
    const heightPx = parseSize(itemHeight)

    const scroller = new Scroller(
      i => <Child key={i} {...props(i)} />,
      Math.ceil(height / heightPx),
      buffer,
      min,
      max
    )
    setScroller(scroller)

    const { frame, off } = scroller.read(startAt)
    setChildren(frame)
    const scroll = (buffer - off) * itemPx
    setOffTop(0)
    setOffBottom(max - (startAt + Math.ceil(height / heightPx) + 2 * buffer))
    if (scroll) ref.current.scrollTo({ top: scroll })
  }, [height, itemHeight, buffer, min, max, props, startAt, itemPx])

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
