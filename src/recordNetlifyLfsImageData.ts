import * as fs from 'fs'
import * as path from 'path'
import glob from 'glob'
import sizeOf from 'image-size'
import { defaultConfig, GatsbySourceNetlifyLfsConfig } from './defaultConfig'
import { generateBase64 } from './generateBase64'
import { ImageData } from './initNetlifyLfsImageData'

const gatsbyConfigFilePath = path.resolve('./gatsby-config')
const netlifyLfsImageDataPath = path.resolve('./src/netlifyLfs/netlifyLfsImageData.json')

// create config object
const gatsbyConfig = require(gatsbyConfigFilePath)
let config: GatsbySourceNetlifyLfsConfig = {
    ...defaultConfig,
    ...(gatsbyConfig.plugins.find(plugin => plugin.resolve === 'gatsby-source-netlify-lfs') || {}).options
}

// create default paths if not defined
if (config.paths == null) {
    config.paths = gatsbyConfig.plugins
        .filter(plugin => plugin.resolve === 'gatsby-source-filesystem')
        .map(sourceFilesystem => sourceFilesystem.options.path)
}

const globPaths = config.paths.length > 1
    ? `{${config.paths.join(',')}}`
    : config.paths[0]

glob(
    // glob find all files and create images
    `${globPaths}/*.{${config.formats.join(',')}}`,
    // generate image data
    async (error, matches) => {
        console.log(`Recording LFS Data of ${matches.length} files from directories:`, config.paths);
        
        // TODO: https://www.npmjs.com/package/cli-progress

        const imageData: ImageData = {}
        await Promise.all(matches.map(async (file) => {
            var fileName = path.basename(file)
            const test = await generateBase64({ file })

            var dimensions = sizeOf(file)

            if (imageData[`${fileName}`] != null)
                console.warn(`All media files must have a unique name. '${fileName}' is duplicated and is being overwritten`)

            imageData[`${fileName}`] = {
                h: dimensions.height,
                w: dimensions.width,
                p: test.src
            };
        }))

        fs.writeFileSync(netlifyLfsImageDataPath, JSON.stringify(imageData), 'utf-8')

        console.log(
            `DONE! Mapped dimensions for ${Object.keys(imageData).length} media files in:\n`,
            path.resolve(netlifyLfsImageDataPath), `\n`,
            `Please commit this file.`
        )
    }
);
