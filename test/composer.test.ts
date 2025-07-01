import { describe, it, expect } from 'vitest'
import {SVG, EPS} from '../src/utils'

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

  describe('EPS Image Composer', () => {
    it('should compose EPS image correctly', () => {
      const eps = new EPS(101, 102)

      const header = eps.header()
      expect(header).toMatch(/%!PS-Adobe-3.0 EPSF-3.0/)
      
      const path = eps.path(
        [[0, 0], [10, 0], [10, 1], [1, 1], [2, 1], [2, 0]], [0, 0, 0, 0])
      expect(path).toMatch(/rg.*l.*f/s)
      
      const footer = eps.footer()
      expect(footer).toMatch(/%%EOF/)
    })
  })
})
