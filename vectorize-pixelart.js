'use strict';

var fs = require('fs'),
    PNG = require('pngjs').PNG,
    SVG = require('svgjs');

let pixelMultiplier = 4;
let inputFileName = process.argv[2];
let outputFileName = process.argv[3];

// TODO check files exists
let vectorOut = fs.createWriteStream(outputFileName);

function writeSVGHeader(height, width) {
    vectorOut.write(
`<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${width * pixelMultiplier}" height="${height * pixelMultiplier}" xmlns="http://www.w3.org/2000/svg">
`);
}

function writeSVGFooter() {
    vectorOut.write("</svg>\n");
}

function writeSVGPixel(y, x, red, green, blue, alpha) {
    if (alpha < 255)
        return;

    vectorOut.write(
`    <rect x="${x * pixelMultiplier}" y="${y * pixelMultiplier}" width="${1 * pixelMultiplier}" height="${1 * pixelMultiplier}" style="fill:rgb(${red}, ${green}, ${blue})" />
`);
}

fs.createReadStream(inputFileName)
    .pipe(new PNG())
    .on('parsed', function() {

        writeSVGHeader(this.height, this.width);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                writeSVGPixel(y, x, this.data[idx], this.data[idx+1],this.data[idx+2], this.data[idx+3]);
            }
        }

        writeSVGFooter();
    });
