import type { PNG } from 'pngjs'

const DEFAULT_MULTIPLIER = 1

export type Pixel = [number, number, number, number]
export type Coord = [number, number]
export type Path = Coord[]

abstract class Image {
  protected readonly height: number
  protected readonly width: number
  protected readonly multiplier: number

  constructor (height: number, width: number, _multiplier = DEFAULT_MULTIPLIER) {
    this.height = height
    this.width = width
    this.multiplier = _multiplier == null ? 1 : _multiplier
  }

  abstract header (): string
  abstract footer (): string
  abstract path (contour: Path, pixel: Pixel): string
}

export class SVG extends Image {
  header (): string {
    return `\
<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${this.width * this.multiplier}" height="${this.height * this.multiplier}" xmlns="http://www.w3.org/2000/svg">
`
  }

  footer (): string {
    return '</svg>\n'
  }

  path (contour: Path, pixel: Pixel): string {
    const m = this.multiplier
    const rgba = pixel.join(', ')

    const move = contour[0]
    let path = `  <path d="M ${move[1] * m} ${move[0] * m}`
    for (let i = 1; i < contour.length; i++) {
      path += ` L${contour[i][1] * m} ${contour[i][0] * m}`
    }
    path += ` Z" style="fill:rgba(${rgba})" />\n`

    return path
  }
}

export class PDF extends Image {
  private contentStream: string = ''

  header (): string {
    const width = this.width * this.multiplier
    const height = this.height * this.multiplier
    
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${width} ${height}]
/Contents 4 0 R
/Resources <<
>>
>>
endobj

`
  }

  footer (): string {
    const contentLength = Buffer.byteLength(this.contentStream, 'utf8')
    
    // Write content object with correct length
    const contentObj = `4 0 obj
<<
/Length ${contentLength}
>>
stream
${this.contentStream}endstream
endobj

`
    
    // Calculate xref offset
    const headerLength = Buffer.byteLength(this.header(), 'utf8')
    const contentObjLength = Buffer.byteLength(contentObj, 'utf8')
    const xrefOffset = headerLength + contentObjLength
    
    return contentObj + `xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
${this.padOffset(headerLength)} 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${xrefOffset}
%%EOF
`
  }

  private padOffset(offset: number): string {
    return offset.toString().padStart(10, '0')
  }

  path (contour: Path, pixel: Pixel): string {
    if (contour.length === 0) return ''
    
    const m = this.multiplier
    const height = this.height * m
    
    // Convert RGB values to PDF color format (0-1 range)
    const r = (pixel[0] / 255).toFixed(3)
    const g = (pixel[1] / 255).toFixed(3)
    const b = (pixel[2] / 255).toFixed(3)
    
    let path = `${r} ${g} ${b} rg\n` // Set fill color
    
    // Start path
    const move = contour[0]
    path += `${(move[1]) * m} ${height - (move[0]) * m} m\n` // moveto
    
    // Add line segments
    for (let i = 1; i < contour.length; i++) {
      const point = contour[i]
      path += `${(point[1]) * m} ${height - (point[0]) * m} l\n` // lineto
    }
    
    path += 'f\n' // fill
    
    this.contentStream += path
    return ''
  }
}

const BYTES_PER_PIXEL = 4

export class PNGImageData {
  private readonly data: Buffer

  readonly width: number
  readonly height: number

  constructor (png: PNG) {
    this.width = png.width
    this.height = png.height
    this.data = png.data
  }

  comparePixels (y1: number, x1: number, y2: number, x2: number): boolean {
    const pixels = this.data
    const offset1 = (y1 * this.width + x1) * BYTES_PER_PIXEL
    const offset2 = (y2 * this.width + x2) * BYTES_PER_PIXEL

    for (let i = 0; i < BYTES_PER_PIXEL; i++) {
      if (pixels[offset1 + i] !== pixels[offset2 + i]) { return false }
    }

    return true
  }

  getPixel (y: number, x: number): Pixel {
    const offset = (y * this.width + x) * BYTES_PER_PIXEL
    return [this.data[offset], this.data[offset + 1], this.data[offset + 2], this.data[offset + 3]]
  }
}
