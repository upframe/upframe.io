import React, { useState, useEffect, useRef, useReducer } from 'react'
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
  anchorBottom?: boolean
  update?: number[]
  onUpdate?(i: number): void
}

const VirtualScroller: React.FunctionComponent<Props> = ({
  size,
  Child,
  props,
  min = -Infinity,
  max = Infinity,
  buffer = 2,
  startAt,
  anchorBottom = false,
  update,
  onUpdate,
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [height, setHeight] = useState<number>()
  const [children, setChildren] = useState<ReturnType<Props['Child']>[]>([])
  const [offTop, setOffTop] = useState(0)
  const [offBottom, setOffBottom] = useState(0)
  const [cache, setCache] = useState(new Cache(size))
  const [preScrollDone, setPreScrollDone] = useReducer(() => true, false)
  const [upCount, forceUpdate] = useReducer((_, off) => ({ off }), { off: 0 })

  useEffect(() => {
    setCache(new Cache(size))
  }, [size])

  const [scroller, setScroller] = useState<
    DynamicScroller<ReturnType<Props['Child']>>
  >()

  useEffect(() => {
    if (!scroller) return
    scroller.max = max
  }, [max, scroller])

  useEffect(() => {
    if (!scroller) return
    scroller.getCursor = i => <Child key={i} {...props(i)} />
  }, [props, scroller])

  useEffect(() => {
    if (!ref.current?.parentElement) return
    setHeight(ref.current.parentElement.offsetHeight)
  }, [ref])

  useEffect(() => {
    if (!ref.current || !scroller || !preScrollDone) return
    const node = ref.current
    let lastPos = node.scrollTop
    let lastScroll = performance.now()
    let animFrame: number

    function getOffset(n: number): number {
      if (n === min) return 0
      return cache.sum(min, n - 1)
    }

    function checkScroll(force = false) {
      if (!scroller || !cache) return
      animFrame = requestAnimationFrame(() => checkScroll())
      if (node.scrollTop === lastPos && !force) return

      lastPos = node.scrollTop
      lastScroll = performance.now()

      const i = cache.searchSum(node.scrollTop, min)

      const ot = Math.max(i - 1, min)
      let { frame, off } = scroller.read(ot)
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

    checkScroll(true)
    if (upCount.off)
      requestAnimationFrame(() => ref.current.scrollBy({ top: upCount.off }))

    return () => {
      node.removeEventListener('scroll', onScrollStart)
      cancelAnimationFrame(animFrame)
      clearTimeout(timeoutId)
    }
  }, [ref, scroller, min, max, cache, preScrollDone, upCount])

  useEffect(() => {
    if (!update?.length || !scroller) return
    const i = update[0]
    if (onUpdate) onUpdate(i)
    const ci = cache.searchSum(ref.current.scrollTop, min)
    const dv = scroller.update(i)
    forceUpdate(ci > i ? dv : 0)
  }, [update, onUpdate, scroller])

  useEffect(() => {
    if (!height || !cache) return

    if ((scroller as any)?.sizeCache === cache) return

    const _scroller = new DynamicScroller(
      i => <Child key={i} {...props(i)} />,
      cache,
      buffer,
      height,
      min,
      max
    )
    setScroller(_scroller)

    if (typeof startAt === 'number')
      ref.current.scrollTo({ top: cache.sum(min, startAt - 1) })
    else if (anchorBottom)
      ref.current.scrollTo({
        top: cache.sum(min, max) - ref.current.offsetHeight,
      })

    setPreScrollDone()
  }, [size, cache, height])

  return (
    <S.Wrap>
      <S.Scroller
        ref={ref}
        paddTop={offTop}
        paddBottom={offBottom}
        itemSize="3rem"
      >
        {children}
        <S.Placeholder />
      </S.Scroller>
    </S.Wrap>
  )
}

interface ScScrollProps {
  paddTop: number
  paddBottom: number
  itemSize: string
}

const S = {
  Wrap: styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `,

  Scroller: styled.div.attrs((p: ScScrollProps) => ({
    style: {
      '--padd-top': `${p.paddTop}px`,
      '--padd-bottom': `${p.paddBottom}px`,
    },
  }))<ScScrollProps>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
    overscroll-behavior: contain;
    max-height: 100%;

    & * {
      overflow-anchor: none;
    }

    & > * {
      transform: translateY(var(--padd-top));
    }
  `,

  Placeholder: styled.div`
    height: 0;
    margin-top: 20000px;
    position: relative;

    * + & {
      margin-top: 0;
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(VirtualScroller, { sc: S.Wrap })
