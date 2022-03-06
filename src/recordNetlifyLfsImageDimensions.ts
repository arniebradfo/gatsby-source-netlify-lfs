import * as fs from 'fs'
import * as path from 'path'
import glob from 'glob'
import sizeOf from 'image-size'

console.log([
    process.argv.slice(2),
    process.cwd()
])

//here

const [
    _inFilePath, 
    _outFilePath
] = process.argv.slice(2)

const cwd = process.cwd()
const inFilePath = _inFilePath || `${cwd}/gatsby-config`
const outFilePath = _outFilePath || `${cwd}/src/netlifyLfs/netlifyLfsImageDimensions.json`

const imageTypes = [
    'jpg',
    'jpeg',
    'png',
    'svg',
    'gif'
]

const gatsbyConfig = require(inFilePath) 
const filesystemSources = gatsbyConfig.plugins.filter(plugin => plugin.resolve === 'gatsby-source-filesystem')
const sourceDirectories = filesystemSources.map(filesystemSource => {
    const projectRoot = path.resolve('./')
    const filesystemSourcePath = path.resolve(filesystemSource.options.path)
    const relativeFilesystemSourcePath = '.' + filesystemSourcePath.substring(projectRoot.length)
    // return [projectRoot, filesystemSourcePath, relativeFilesystemSourcePath]
    return relativeFilesystemSourcePath
})
console.log(`Searching gatsby-source-filesystem directories:`, sourceDirectories);

const globPattern = `{${sourceDirectories.join(',')}}/*.{${imageTypes.join(',')}}`
// console.log('Reading glob pattern: ', globPattern);

const imgDimensions = {}
const callback = (er, files) => {
    files.forEach((file, index) => {
        // var fileSize = fs.statSync(file).size // we can't use this during netlify's gatsby build
        var fileName = path.basename(file)
        var dimensions = sizeOf(file)
        if (imgDimensions[`${fileName}`] != null)
            console.warn(`All media files must have a unique name. '${fileName}' is duplicated and is being overwritten`)
        imgDimensions[`${fileName}`] = {
            h: dimensions.height,
            w: dimensions.width,
            // aspectRatio: dimensions.width / dimensions.height,
        };
    })
    fs.writeFileSync(outFilePath, JSON.stringify(imgDimensions), 'utf-8')
    console.log(
        `DONE! Mapped dimensions for ${Object.keys(imgDimensions).length} media files in:\n`,
        path.resolve(outFilePath), `\n`,
        `Please commit this file.`
    )
}

glob(globPattern, callback) // RUN IT!
