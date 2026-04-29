import { describe, expect, it } from 'vitest'
import { PNG } from 'pngjs'
import { vectorizePng } from '../src/vectorize'
import type { Pixel } from '../src/utils'

function createPng (width: number, height: number, pixels: Pixel[]): PNG {
  const png = new PNG({ width, height })

  pixels.forEach((pixel, index) => {
    const offset = index * 4
    png.data[offset] = pixel[0]
    png.data[offset + 1] = pixel[1]
    png.data[offset + 2] = pixel[2]
    png.data[offset + 3] = pixel[3]
  })

  return png
}

describe('vectorizePng', () => {
  it('should export a filled square as one sharp SVG path', () => {
    const transparent: Pixel = [0, 0, 0, 0]
    const red: Pixel = [255, 0, 0, 255]
    const png = createPng(4, 4, [
      transparent, transparent, transparent, transparent,
      transparent, red, red, transparent,
      transparent, red, red, transparent,
      transparent, transparent, transparent, transparent
    ])

    const svg = vectorizePng(png, 'svg')
    const paths = svg.match(/<path/g) ?? []

    expect(paths).toHaveLength(1)
    expect(svg).toContain('shape-rendering="crispEdges"')
    expect(svg).toContain('fill-rule="evenodd"')
    expect(svg).toContain('fill:rgba(255, 0, 0, 255)')
    expect(svg).not.toMatch(/\sC\s/)
  })

  it('should preserve holes as subpaths in one same-color SVG path', () => {
    const transparent: Pixel = [0, 0, 0, 0]
    const red: Pixel = [255, 0, 0, 255]
    const png = createPng(3, 3, [
      red, red, red,
      red, transparent, red,
      red, red, red
    ])

    const svg = vectorizePng(png, 'svg')
    const paths = svg.match(/<path/g) ?? []
    const moves = svg.match(/M /g) ?? []

    expect(paths).toHaveLength(1)
    expect(moves).toHaveLength(2)
    expect(svg).toContain('fill-rule="evenodd"')
  })
})
