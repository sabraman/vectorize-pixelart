import type { PNG } from 'pngjs'
import { ContourTracing } from './contour-tracing'
import { PDF, PNGImageData, SVG, type Path, type Pixel } from './utils'

export type VectorFormat = 'svg' | 'pdf'

const TARGET_SIZE = 2 ** 23

interface VectorFormatter {
  header: () => string
  path: (contour: Path, pixel: Pixel) => string
  footer: () => string
}

type VectorFormatterConstructor = new (
  height: number,
  width: number,
  multiplier?: number
) => VectorFormatter

const OUTPUT_FORMATS: Record<VectorFormat, VectorFormatterConstructor> = {
  svg: SVG,
  pdf: PDF
}

export function isVectorFormat (format: string): format is VectorFormat {
  return format === 'svg' || format === 'pdf'
}

export function getPixelMultiplier (png: Pick<PNG, 'height' | 'width'>): number {
  return Math.sqrt(TARGET_SIZE / (png.height * png.width))
}

export function vectorizePng (png: PNG, format: VectorFormat): string {
  const VectorFormatterClass = OUTPUT_FORMATS[format]
  const image = new PNGImageData(png)
  const vectorFormatter = new VectorFormatterClass(
    png.height,
    png.width,
    getPixelMultiplier(png)
  )

  let output = vectorFormatter.header()
  const tracer = new ContourTracing(image)

  tracer.traceContours((contour, pixel) => {
    output += vectorFormatter.path(contour, pixel)
  })

  return output + vectorFormatter.footer()
}
