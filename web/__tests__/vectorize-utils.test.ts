import { describe, it, expect } from 'vitest';
import { SVG, EPS } from '../src/lib/vectorize/utils';

describe('SVG Image Composer', () => {
  it('should create valid SVG header', () => {
    const svg = new SVG(100, 200, 2);
    const header = svg.header();
    
    expect(header).toContain('<svg width="400" height="200"');
    expect(header).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should create valid SVG path', () => {
    const svg = new SVG(100, 100);
    const path = svg.path(
      [[10, 10], [20, 10], [20, 20], [10, 20]], 
      [255, 0, 0, 255]
    );
    
    expect(path).toContain('<path d="M 10 10');
    expect(path).toContain('style="fill:rgba(255, 0, 0, 255)"');
  });

  it('should return empty string for empty contour', () => {
    const svg = new SVG(100, 100);
    const path = svg.path([], [255, 0, 0, 255]);
    
    expect(path).toBe('');
  });

  it('should create valid SVG footer', () => {
    const svg = new SVG(100, 100);
    const footer = svg.footer();
    
    expect(footer).toBe('</svg>\n');
  });
});

describe('EPS Image Composer', () => {
  it('should create valid EPS header', () => {
    const eps = new EPS(100, 200, 1.5);
    const header = eps.header();
    
    expect(header).toContain('%!PS-Adobe-3.0 EPSF-3.0');
    expect(header).toContain('%%BoundingBox: 0 0 300 150');
  });

  it('should create valid EPS path', () => {
    const eps = new EPS(100, 100);
    const path = eps.path(
      [[10, 10], [20, 10], [20, 20], [10, 20]], 
      [255, 0, 0, 255]
    );
    
    expect(path).toContain('1.000 0.000 0.000  rg');
    expect(path).toContain('10 90 m');
  });

  it('should return empty string for empty contour', () => {
    const eps = new EPS(100, 100);
    const path = eps.path([], [255, 0, 0, 255]);
    
    expect(path).toBe('');
  });

  it('should create valid EPS footer', () => {
    const eps = new EPS(100, 100);
    const footer = eps.footer();
    
    expect(footer).toContain('showpage');
    expect(footer).toContain('%%EOF');
  });
}); 