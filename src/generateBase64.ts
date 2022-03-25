import sharp, { Sharp } from "sharp";
import * as fs from 'fs'
import { GatsbySourceNetlifyLfsConfig } from './defaultConfig'

/** [gatsbyPluginSharp Docs](../node_modules/gatsby-plugin-sharp/index.js)  */
export async function processImage(
  file: string,
  options: GatsbySourceNetlifyLfsConfig
) {

  let pipeline: Sharp;

  try {
    pipeline = sharp()
    fs.createReadStream(file).pipe(pipeline);
  } catch (err) {
    console.warn(`Failed to process image ${file}`);
    return null;
  }

  const {
    width,
    height,
    density,
    format
  } = await pipeline.metadata();

  pipeline.resize({
    width: options.blurredOptions.width,
    // height: options.height,
    // position: options.cropFocus,
    // fit: options.fit,
    // background: options.background
  }).png({
    // compressionLevel: options.pngCompressionLevel,
    adaptiveFiltering: false,
    force: options.blurredOptions.toFormat === `png`
  }).jpeg({
    // quality: options.jpegQuality || options.quality,
    // progressive: options.jpegProgressive,
    force: options.blurredOptions.toFormat === `jpg`
  })


  let buffer: Buffer;
  let info: sharp.OutputInfo;
  let dominant: RGB;

  try {
    const result = await pipeline.toBuffer({
      resolveWithObject: true
    });
    buffer = result.data;
    info = result.info;
    const stats = await sharp(result.data).stats()
    dominant = stats.dominant
  } catch (err) {
    console.warn(`Failed to process image ${file}. It is probably corrupt, so please try replacing it.`);
    return null;
  }

  const dominantColor = dominant ? rgbToHex(dominant.r, dominant.g, dominant.b) : `rgba(0,0,0,0.5)`;
  const src = `data:image/${info.format};base64,${buffer.toString(`base64`)}`
  const originalName = file

  const base64output = {
    src,
    width,
    height,
    density,
    format,
    originalName,
    dominantColor
  };

  // console.log(base64output);
  return base64output;
}

function rgbToHex(red, green, blue) {
  return `#${(blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1)}`;
}

type RGB = {
  r: number;
  g: number;
  b: number;
}