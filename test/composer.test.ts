import { describe, it, expect } from 'vitest'
import {SVG, PDF} from '../src/utils'

describe('Image Composers', () => {
  describe('SVG Image Composer', () => {
    it('should compose SVG image correctly', () => {
      const svg = new SVG(101, 102)

      const header = svg.header()
      expect(header).toMatch(/<svg/)
      
      const path = svg.path(
        [[0, 0], [10, 0], [10, 1], [1, 1], [2, 1], [2, 0]], [0, 0, 0, 0])
      expect(path).toMatch(/<path/)
      
      const footer = svg.footer()
      expect(footer).toMatch(/<\/svg>/)
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
