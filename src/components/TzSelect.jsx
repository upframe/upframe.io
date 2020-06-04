import React, { useEffect } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import tz from '../tzMap.json'
import map from '../land.json'

export default function TzSelect({
  currentOffset = new Date().getTimezoneOffset(),
  ...props
}) {
  useEffect(() => {
    if (!map) return

    const svg = d3.select('#tz-pick')
    const path = d3
      .geoPath()
      .projection(d3.geoEquirectangular().translate([500, 235]))

    svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(map, map.objects.continent).features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', 'var(--cl-text-light)')

    svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(tz, tz.objects.tz).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'tz')
      .attr('class', d =>
        d3.select(d)._groups[0][0].properties.ZONE === -currentOffset / 60
          ? 'current'
          : undefined
      )
      .on('mouseover', function(d) {
        console.log(d3.select(d)._groups[0][0].properties.ZONE)
        d3.select(this).classed('active', true)
      })
      .on('mouseout', function() {
        d3.select(this).classed('active', false)
      })
  }, [])

  return <S.Map id="tz-pick" viewBox="0 0 1000 410" {...props}></S.Map>
}

const S = {
  Map: styled.svg`
    width: 100%;

    path {
      fill: transparent;
      stroke: transparent;

      &.tz {
        stroke: transparent;
      }

      &.active {
        stroke: #7778;
        fill: #eee4;
      }

      &.current {
        stroke: #777a;
        fill: #eee4;
      }
    }
  `,
}
