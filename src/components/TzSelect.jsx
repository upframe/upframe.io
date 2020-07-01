import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import { feature } from 'topojson-client'

export default function TzSelect({
  currentTz,
  currentOffset,
  onInspect = () => {},
  onSelect = () => {},
  ...props
}) {
  const [mapData, setMapData] = useState()

  useEffect(() => {
    Promise.all(
      ['land', 'slices', 'tzs'].map(v =>
        fetch(`https://s3-eu-west-1.amazonaws.com/upframe.io-assets/${v}.json`)
          .then(res => res.json())
          .then(res => [v, res])
      )
    )
      .then(Object.fromEntries)
      .then(setMapData)
  }, [])

  useEffect(() => {
    if (!mapData) return

    const svg = d3.select('#tz-pick')

    const _svg = svg._groups[0][0]
    if (_svg.children.length) {
      Array.from(_svg.querySelectorAll('path')).forEach(e => {
        e.classList.remove(
          'current-slice',
          'current-tz',
          'active-slice',
          'active-tz'
        )
        if (!e.id) return
        if (parseFloat(e.id.slice(1).replace(/_/g, '.')) * 60 === currentOffset)
          e.classList.add('current-slice')
        else if (e.id === currentTz) e.classList.add('current-tz')
      })
      return
    }

    const path = d3
      .geoPath()
      .projection(d3.geoEquirectangular().translate([500, 235]))

    svg
      .append('g')
      .selectAll('path')
      .data(feature(mapData.land, mapData.land.objects.continent).features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', 'var(--cl-text-light)')

    svg
      .append('g')
      .selectAll('path')
      .data(feature(mapData.slices, mapData.slices.objects.tz).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', d =>
        d3.select(d)._groups[0][0].properties.ZONE === currentOffset / 60
          ? 'current-slice'
          : undefined
      )
      .attr(
        'id',
        d =>
          `z${d3
            .select(d)
            ._groups[0][0].properties.ZONE.toString()
            .replace(/\./g, '_')}`
      )
      .on('mouseover', function (d) {
        let zone = d.properties.ZONE.toString()
        if (!zone.startsWith('-')) zone = '+' + zone
        onInspect(`UTC ${zone}`)
        d3.select(this).classed('active-slice', true)
      })
      .on('mouseout', function () {
        onInspect()
        d3.select(this).classed('active-slice', false)
      })

    svg
      .append('g')
      .selectAll('path')
      .data(feature(mapData.tzs, mapData.tzs.objects.tzs).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', d =>
        ['tz', d.properties.id !== currentTz ? undefined : 'current-tz']
          .filter(Boolean)
          .join(' ')
      )
      .attr('id', d => d.properties.id)
      .on('mouseover', function (d) {
        d3.select(this).classed('active-tz', true)
        if (d.properties.id !== currentTz)
          onInspect(d.properties.id.replace(/_/g, ' '))
        const tz = d3.select(
          this.parentNode.previousSibling.querySelector(
            `#z${d.properties.off.toString().replace(/\./g, '_')}`
          )
        )
        if (tz) tz.classed('active-slice', true)
      })
      .on('mouseout', function (d) {
        if (d.properties.id !== currentTz)
          d3.select(this).classed('active-tz', false)
        onInspect()
        const tz = d3.select(
          this.parentNode.previousSibling.querySelector(
            `#z${d.properties.off.toString().replace(/\./g, '_')}`
          )
        )
        if (tz) tz.classed('active-slice', false)
      })
      .on('click', d => {
        onSelect({ variables: { tz: d.properties.id } })
      })
  }, [mapData, currentTz, currentOffset, onInspect, onSelect])

  return (
    <S.Map
      id="tz-pick"
      viewBox="0 0 1000 410"
      preserveAspectRatio="xMinYMin"
      {...props}
    ></S.Map>
  )
}

const S = {
  Map: styled.svg`
    width: 100%;

    path {
      fill: transparent;
      stroke: transparent;

      &.tz {
        cursor: pointer;
      }

      &.active-slice {
        stroke: #7778;
        fill: #eee4;
      }

      &.current-slice {
        stroke: #777a;
        fill: #eee4;
      }

      &.active-tz,
      &.current-tz {
        fill: #ff004b33;
      }

      &.current-tz {
        cursor: initial;
      }
    }
  `,
}
