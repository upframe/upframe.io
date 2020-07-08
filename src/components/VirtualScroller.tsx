import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { DynamicScroller } from 'utils/scroller'
import Cache from 'utils/sumCache'

interface Props {
  size(index: number): number
  Child(...args: any[]): JSX.Element
  props(index: number): any
  min?: number
  max?: number
  buffer?: number
  startAt?: number
}

const VirtualScroller: React.FunctionComponent<Props> = ({
  size,
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
  const [cache, setCache] = useState(new Cache(size))

  useEffect(() => {
    setCache(new Cache(size))
  }, [size])

  const [scroller, setScroller] = useState<
    DynamicScroller<ReturnType<Props['Child']>>
  >()

  useEffect(() => {
    if (!ref.current) return
    setHeight(ref.current.offsetHeight)
  }, [ref])

  useEffect(() => {
    if (!ref.current || !scroller) return
    const node = ref.current
    let lastPos = node.scrollTop
    let lastScroll = performance.now()
    let animFrame: number

    function getOffset(n: number): number {
      if (n === min) return 0
      return cache.sum(min, n - 1)
    }

    function checkScroll() {
      if (!scroller || !cache) return
      animFrame = requestAnimationFrame(checkScroll)
      if (node.scrollTop === lastPos) return

      lastPos = node.scrollTop
      lastScroll = performance.now()

      const i = cache.searchSum(node.scrollTop, min)

      const ot = Math.max(i - 1, 0)
      const { frame, off } = scroller.read(ot + min)
      setChildren(frame)

      const offTop = getOffset(ot - (scroller.buffer - off))

      setOffTop(offTop)

      const buffBottStart = ot + frame.length + off - scroller.buffer

      setOffBottom(
        buffBottStart > max ? 0 : cache.sum(Math.min(buffBottStart, max), max)
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
  }, [ref, scroller, min, max, cache])

  useEffect(() => {
    if (!height || scroller || !cache) return

    const _scroller = new DynamicScroller(
      i => <Child key={i} {...props(i)} />,
      cache,
      buffer,
      height,
      min,
      max
    )
    setScroller(_scroller)

    const { frame } = _scroller.read(startAt)
    setChildren(frame)
    const scroll = 0
    setOffTop(0)
    setOffBottom(100)
    if (scroll) ref.current.scrollTo({ top: scroll })
  }, [height, buffer, min, max, props, startAt, scroller, size, cache])

  return (
    <S.Scroller
      ref={ref}
      paddTop={offTop}
      paddBottom={offBottom}
      itemSize="3rem"
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
      '--padd-top': `${p.paddTop}px`,
      '--padd-bottom': `${p.paddBottom}px`,
    },
  }))<ScScrollProps>`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    width: 30rem;
    max-width: 100vw;
    margin: auto;
    height: 80vh;
    overflow-y: auto;
    box-sizing: border-box;
    overscroll-behavior: contain;

    & > * {
      transform: translateY(var(--padd-top));
    }

    & > *:last-child {
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(VirtualScroller, { sc: S.Scroller })
