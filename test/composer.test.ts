import { describe, it, expect } from 'vitest'
import {SVG, PDF} from '../src/utils'

describe('Image Composers', () => {
  describe('SVG Image Composer', () => {
    it('should compose SVG image correctly', () => {
      const svg = new SVG(101, 102)

      const header = svg.header()
      expect(header).toMatch(/<svg/)
      
      const queuedPath = svg.path(
        [[0, 0], [10, 0], [10, 1], [1, 1], [2, 1], [2, 0]], [0, 0, 0, 0])
      expect(queuedPath).toBe('')
      
      const footer = svg.footer()
      expect(footer).toMatch(/<path/)
      expect(footer).toMatch(/<\/svg>/)
    })

    it('should group same-color contours into one compound path', () => {
      const svg = new SVG(2, 2)

      svg.path([[0, 0], [0, 1], [1, 1], [1, 0]], [255, 0, 0, 255])
      svg.path([[1, 1], [1, 2], [2, 2], [2, 1]], [255, 0, 0, 255])
      svg.path([[0, 1], [0, 2], [1, 2], [1, 1]], [0, 0, 255, 255])

      const footer = svg.footer()
      const paths = footer.match(/<path/g) ?? []

      expect(paths).toHaveLength(2)
      expect(footer).toMatch(/fill:rgba\(255, 0, 0, 255\)/)
      expect(footer).toMatch(/fill:rgba\(0, 0, 255, 255\)/)
      expect(footer).toMatch(/fill-rule="evenodd"/)
    })
  })

  describe('PDF Image Composer', () => {
    it('should compose PDF image correctly', () => {
      const pdf = new PDF(101, 102)

      const header = pdf.header()
      expect(header).toMatch(/%PDF-1.4/)
      
      const path = pdf.path(
        [[0, 0], [10, 0], [10, 1], [1, 1], [2, 1], [2, 0]], [0, 0, 0, 0])
      expect(path).toBe('')
      
      const footer = pdf.footer()
      expect(footer).toMatch(/xref/)
      expect(footer).toMatch(/trailer/)
      expect(footer).toMatch(/%%EOF/)
    })
  })
})
