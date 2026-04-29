#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'fs'
import { PNG } from 'pngjs'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { isVectorFormat, vectorizePng } from './vectorize'

const pipelineAsync = promisify(pipeline)

async function main (): Promise<void> {
  const inputFileName = process.argv[2]
  const outputFileName: string = process.argv[3]

  if (process.argv.length < 4) {
    console.log(
    `usage: ${process.argv[1]} <input png image> <output svg|pdf vector>\n`)
    process.exit(1)
  }

  const extension = outputFileName.split('.').pop() ?? ''
  if (!isVectorFormat(extension)) {
    throw new Error('Unsupported file format ' + outputFileName)
  }

  try {
    const png = new PNG()
    await pipelineAsync(
      createReadStream(inputFileName),
      png
    )

    const vectorOut = createWriteStream(outputFileName)
    vectorOut.end(vectorizePng(png, extension))
  } catch (error) {
    console.error('Error processing image:', error)
    process.exit(1)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
