import sharp, { Sharp } from "sharp";
import * as fs from 'fs'
import { defaultConfig, GatsbySourceNetlifyLfsConfig } from './defaultConfig'

/** [gatsbyPluginSharp Docs](../node_modules/gatsby-plugin-sharp/index.js)  */
export async function processImage({
  file,
  options,
  // reporter
}: {
  file: string,
  options?: GatsbySourceNetlifyLfsConfig,
}) {

  options = {
    ...options,
    ...defaultConfig
  }

  // const pluginOptions = getPluginOptions();
  // const options = healOptions(pluginOptions, args, file.extension, {
  //   // Should already be set to base64Width by `fluid()`/`fixed()` methods
  //   // calling `generateBase64()`. Useful in Jest tests still.
  //   width: args.base64Width || pluginOptions.base64Width
  // }); 
  let pipeline: Sharp;

  try {
    pipeline = sharp()

    // if (!options.rotate) {
    //   pipeline.rotate();
    // } 

    // fs.createReadStream(file.absolutePath).pipe(pipeline);
    fs.createReadStream(file).pipe(pipeline);
  } catch (err) {
    // reportError(`Failed to process image ${file.absolutePath}`, err, reporter);
    return null;
  }

  const {
    width,
    height,
    density,
    format
  } = await pipeline.metadata();

  // if (options.trim) {
  //   pipeline = pipeline.trim(options.trim);
  // }

  // const changedBase64Format = options.toFormatBase64 || pluginOptions.forceBase64Format;

  // if (changedBase64Format) {
  //   options.toFormat = changedBase64Format;
  // }

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
  })//.webp({
  //   quality: options.webpQuality || options.quality,
  //   force: options.toFormat === `webp`
  // }); // grayscale

  // if (options.grayscale) {
  //   pipeline = pipeline.grayscale();
  // } // rotate


  // if (options.rotate && options.rotate !== 0) {
  //   pipeline = pipeline.rotate(options.rotate);
  // } // duotone


  // if (options.duotone) {
  //   if (options.duotone.highlight && options.duotone.shadow) {
  //     pipeline = await duotone(options.duotone, options.toFormat, pipeline);
  //   } else {
  //     reporter.warn(`Invalid duotone option specified for ${file.absolutePath}, ignoring. Please pass an object to duotone with the keys "highlight" and "shadow" set to the corresponding hex values you want to use.`);
  //   }
  // }

  // const {
  //   dominant
  // } = await pipeline.stats(); // Fallback in case sharp doesn't support dominant

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


  const base64output = {
    src: `data:image/${info.format};base64,${buffer.toString(`base64`)}`,
    width,
    height,
    density,
    format,
    originalName: file,
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