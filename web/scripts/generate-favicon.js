import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function generateFavicon() {
  try {
    // Read the existing SVG favicon
    const svgPath = path.join(process.cwd(), 'public', 'favicon.svg');
    const svgBuffer = await fs.readFile(svgPath);

    // Create ICO with multiple sizes
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];

    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer)
        .resize(size, size, {
          kernel: 'nearest', // Use nearest neighbor for pixelart style
          fit: 'fill'
        })
        .png()
        .toBuffer();
      pngBuffers.push(pngBuffer);
    }

    // Create ICO file (using 32x32 as base)
    const icoBuffer = await sharp(pngBuffers[1]) // 32x32
      .png()
      .toBuffer();

    // Save ICO file
    const icoPath = path.join(process.cwd(), 'public', 'favicon.ico');
    await fs.writeFile(icoPath, icoBuffer);

    console.log('✅ Favicon.ico generated successfully!');
    
    // Also generate PNG versions for different sizes
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const pngPath = path.join(process.cwd(), 'public', `favicon-${size}x${size}.png`);
      await sharp(svgBuffer)
        .resize(size, size, {
          kernel: 'nearest', // Use nearest neighbor for pixelart style
          fit: 'fill'
        })
        .png()
        .toFile(pngPath);
    }

    console.log('✅ PNG favicons generated for all sizes!');

    // Generate a larger version for Apple touch icon
    const appleTouchPath = path.join(process.cwd(), 'public', 'favicon-180x180.png');
    await sharp(svgBuffer)
      .resize(180, 180, {
        kernel: 'nearest',
        fit: 'fill'
      })
      .png()
      .toFile(appleTouchPath);

    console.log('✅ Apple touch icon generated!');

  } catch (error) {
    console.error('❌ Error generating favicon:', error);
  }
}

generateFavicon(); 