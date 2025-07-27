#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'fs'
import { PNG } from 'pngjs'
import { SVG, PDF, PNGImageData, Path, Pixel } from './utils'
import { ContourTracing } from './contour-tracing'
import { promisify } from 'util'
import { pipeline } from 'stream'

const pipelineAsync = promisify(pipeline)

const OutputFileFormats: { [key: string]: any } = {
  svg: SVG,
  pdf: PDF
}

async function main () {
  const targetSize = 2 ** 23
  const inputFileName = process.argv[2]
  const outputFileName: string = process.argv[3]

  if (process.argv.length < 4) {
    console.log(
    `usage: ${process.argv[1]} <input png image> <output svg|pdf vector>\n`)
    process.exit(1)
  }

  const extension = outputFileName.split('.').pop() ?? ''
  const VectorFormatterClass = OutputFileFormats[extension]
  if (VectorFormatterClass == null) { throw new Error('Unsupported file format ' + outputFileName) }

  try {
    const png = new PNG()
    await pipelineAsync(
      createReadStream(inputFileName),
      png
    )

    const vectorOut = createWriteStream(outputFileName)

    const pixelMultiplier = Math.sqrt(targetSize / (png.height * png.width))

    const image = new PNGImageData(png)

    const vectorFormatter = new VectorFormatterClass(png.height, png.width, pixelMultiplier)
    vectorOut.write(vectorFormatter.header())

    const tracer = new ContourTracing(image)
    tracer.traceContours((contour: Path, pixel: Pixel) => {
      vectorOut.write(vectorFormatter.path(contour, pixel))
    })

    vectorOut.write(vectorFormatter.footer())
    vectorOut.end()
  } catch (error) {
    console.error('Error processing image:', error)
    process.exit(1)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})