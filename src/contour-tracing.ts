import { Coord, Path, Pixel, PNGImageData } from './utils'

type Direction = Coord
type ContourFoundCb = (contour: Path, pixel: Pixel) => void

const DIRECTIONS: Direction[] = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1]
]

const DIRECTION_VERTEX: Direction[] = [
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 1]
]

const D_MOD = DIRECTIONS.length

export class ContourTracing {
  private readonly image: PNGImageData
  private readonly visitedPixels: boolean[]

  constructor (image: PNGImageData) {
    this.image = image
    this.visitedPixels = new Array(image.width * image.height)
    this.visitedPixels.fill(false)
  }

  private isSignificantPixel(pixel: Pixel): boolean {
    // Check if pixel is not transparent (alpha > 0)
    // Include all non-transparent pixels, including black (RGB = 0,0,0)
    const [r, g, b, a] = pixel
    return a > 0
  }

  findNeighborbood (y: number, x: number): number | undefined {
    for (let d = 0; d < DIRECTIONS.length; d++) {
      const y1 = y + DIRECTIONS[d][0]
      const x1 = x + DIRECTIONS[d][1]

      if (this.image.comparePixels(y, x, y1, x1)) {
        if (!this.visitedPixels[y1 * this.image.width + x1]) {
          return d
        }
      }
    }
  }

  addMoveVertexes (contour: Path, y: number, x: number, directionMove: number, directionPrevious: number): void {
    for (let direction = directionPrevious; direction !== directionMove; direction = (direction + 1) % D_MOD) {
      const v = DIRECTION_VERTEX[direction]
      contour.push([y + v[0], x + v[1]])
    }

    if (directionMove === directionPrevious) { contour.pop() }

    const v = DIRECTION_VERTEX[directionMove]
    contour.push([y + v[0], x + v[1]])
  }

  addRotationVertexes (contour: Path, y: number, x: number, currentDirection: number, targetDirection: number): void {
    for (let direction = currentDirection; direction !== targetDirection; direction = (direction + 1) % D_MOD) {
      const v = DIRECTION_VERTEX[direction]
      contour.push([y + v[0], x + v[1]])
    }
  }

  addContour (contour: Path, y: number, x: number, startDirection: number, endDirection: number): void {
    if (startDirection === endDirection) { return }

    for (let direction = (startDirection + D_MOD - 1) % D_MOD, firstRun = true; firstRun || direction !== endDirection; direction = (direction + 1) % D_MOD, firstRun = false) {
      const v = DIRECTION_VERTEX[direction]
      contour.push([y + v[0], x + v[1]])
    }
  }

  traceContour (y0: number, x0: number): Path {
    const image = this.image
    const width = this.image.width
    const height = this.image.height

    const contour: Path = []

    const neighborhoodDirection = this.findNeighborbood(y0, x0)

    if (neighborhoodDirection === undefined) {
      this.visitedPixels[y0 * width + x0] = true
      this.addMoveVertexes(contour, y0, x0, D_MOD - 1, 0)
      return contour
    }

    this.addContour(contour, y0, x0, 0, neighborhoodDirection)

    let lastDirection = neighborhoodDirection
    let ylast = y0 + DIRECTIONS[neighborhoodDirection][0]
    let xlast = x0 + DIRECTIONS[neighborhoodDirection][1]

    const trace = [y0 * width + x0, ylast * width + xlast]

    do {
      const oppositeDirection = (lastDirection + D_MOD / 2) % D_MOD
      const startDirection = (oppositeDirection + 1) % D_MOD
      for (let newDirection = startDirection; ; newDirection = (newDirection + 1) % D_MOD) {
        const y = ylast + DIRECTIONS[newDirection][0]
        const x = xlast + DIRECTIONS[newDirection][1]

        if (y < 0 || y >= height || x < 0 || x >= width) { continue }

        if (image.comparePixels(ylast, xlast, y, x)) {
          if (!this.visitedPixels[y * width + x]) {
            trace.push(y * width + x)

            this.addContour(contour, ylast, xlast, lastDirection, newDirection)
            ylast = y
            xlast = x
            lastDirection = newDirection
            break
          }
        }
      }
    } while (!(ylast === y0 && xlast === x0))

    this.addContour(contour, y0, x0, lastDirection, neighborhoodDirection)

    for (const pos of trace) {
      this.visitedPixels[pos] = true
    }

    return contour
  }

  traceContours (cb: ContourFoundCb): void {
    for (let i = 0; i < this.visitedPixels.length; i++) {
      if (this.visitedPixels[i]) { continue }

      const y0 = Math.floor(i / this.image.width)
      const x0 = i % this.image.width
      const pixel = this.image.getPixel(y0, x0)
      
      // Skip transparent/background pixels
      if (!this.isSignificantPixel(pixel)) {
        this.visitedPixels[i] = true
        continue
      }
      
      const contour = this.traceContour(y0, x0)
      if (contour !== undefined) { cb(contour, pixel) }
    }
  }
}
