import { describe, it, expect } from 'vitest'
import { ContourTracing } from '../src/contour-tracing'
import { Coord, Path, PNGImageData } from '../src/utils'

describe('ContourTracing', () => {
  it('should trace contours of sample image correctly', () => {
    const imageData = [
      0.0, 0.0, 0.2, 0.0, 0.0,
      0.1, 0.2, 0.2, 0.2, 0.0,
      0.1, 0.0, 0.2, 0.0, 0.0,
      0.1, 0.3, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0
    ]

    const image = new MockedImage(imageData, 5, 5) as any as PNGImageData

    const ct = new ContourTracing(image)
    let foundContours = 0

    ct.traceContours((contour) => {
      foundContours++
      expect(isStraightContour(contour)).toBe(true)
    })

    expect(foundContours).toBe(3)
  })

  it('should trace outer and inner boundaries for a shape with a hole', () => {
    const imageData = [
      1, 1, 1,
      1, 0, 1,
      1, 1, 1
    ]

    const image = new MockedImage(imageData, 3, 3) as any as PNGImageData
    const ct = new ContourTracing(image)
    const contours: Path[] = []

    ct.traceContours((contour) => {
      contours.push(contour)
      expect(isStraightContour(contour)).toBe(true)
    })

    expect(contours).toHaveLength(2)
    expect(contours.map(contour => contour.length).sort()).toEqual([4, 4])
  })
})

function isStraight (point1: Coord, point2: Coord) {
  const yChange = point1[0] !== point2[0]
  const xChange = point1[1] !== point2[1]
  return yChange !== xChange
}

function isStraightContour (contour: Path) {
  for (let i = 0; i < contour.length - 1; i++) {
    if (!isStraight(contour[i], contour[i + 1])) { return false }
  }

  if (!isStraight(contour[contour.length - 1], contour[0])) { return false }

  return true
}

class MockedImage {
  private readonly image: number[]
  private readonly height: number
  private readonly width: number

  constructor (imageArray: number[], height: number, width: number) {
    this.image = imageArray
    this.height = height
    this.width = width
  }
  
  private getOffset (y: number, x: number) {
    return y * this.width + x
  }

  comparePixels (y1: number, x1: number, y2: number, x2: number) {
    return this.image[this.getOffset(y1, x1)] === this.image[this.getOffset(y2, x2)]
  }

  getPixel (y: number, x: number) {
    const value = this.image[this.getOffset(y, x)]
    const gray = 255 * value
    return [gray, gray, gray, value === 0 ? 0 : 255]
  }
}
