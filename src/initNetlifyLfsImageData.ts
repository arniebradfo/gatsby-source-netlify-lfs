import { getImageData } from "gatsby-plugin-image"
import type { IGatsbyImageData, IGetImageDataArgs, IUrlBuilderArgs } from "gatsby-plugin-image"
import { FileName, ImageDatum } from './recordNetlifyLfsImageData'

export type IGetNetlifyLfsImageDataArgs = Omit<IGetImageDataArgs, ('urlBuilder' | 'baseUrl')> & {
    /** the publicURL of the file from graphql */
    publicURL: string, // getSrc()? https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#getsrc
    /** manually defined img sizes attribute */
    sizes?: string,
}
export type IGetNetlifyLfsImageDataDefaultArgs = Omit<IGetNetlifyLfsImageDataArgs, 'publicURL'> & {}

export const initNetlifyLfsImageData = (imageData?: ImageData, defaultArgs: IGetNetlifyLfsImageDataDefaultArgs = {}) => (
    (args: IGetNetlifyLfsImageDataArgs) => getNetlifyLfsImageData(imageData, { ...defaultArgs, ...args })
)
const getNetlifyLfsImageData = (imgDimensions: ImageData, args: IGetNetlifyLfsImageDataArgs): IGatsbyImageData => {

    const {
        publicURL: baseUrl,
        // imgDimensions
    } = args

    const imgFileName = basename(baseUrl)
    const imgFileType = fileType(imgFileName).toLowerCase()

    const imgDimension: ImageDatum | undefined = imgDimensions[imgFileName]
    if (imgDimension == null)
        return null // TODO

    const { h: sourceHeight, w: sourceWidth, p: placeholderURL, b: backgroundColor } = imgDimension

    const gatsbyImageData = getImageData({
        pluginName: `gatsby-source-netlify-lfs`,
        urlBuilder: netlifyLfsUrlBuilder,
        baseUrl,
        sourceHeight,
        sourceWidth,
        aspectRatio: sourceWidth / sourceHeight,
        placeholderURL,
        backgroundColor,
        ...args,
    })

    if (args.sizes) // a bit off
        gatsbyImageData.images.fallback.sizes = args.sizes

    // reset the src to the original
    gatsbyImageData.images.fallback.src = baseUrl

    // gifs don't retain their animation going through nf_resize // svgs don't need alternate sizes
    const shouldRemoveSrcSet = imgFileType == 'svg' || imgFileType == 'gif'
    if (shouldRemoveSrcSet)
        gatsbyImageData.images.fallback.srcSet = undefined

    return gatsbyImageData
}

export const netlifyLfsUrlBuilder = (args: IUrlBuilderArgs<any>): string => {
    const { baseUrl, height, width } = args
    return `${baseUrl}${nf_resize(width, height)}`
};

type nfResize = 'fit' | 'smartcrop';
function nf_resize(
    width: number = 0,
    height: number = 0,
    resize: nfResize = 'smartcrop',
): string {
    // https://docs.netlify.com/large-media/transform-images/#request-transformations
    if (!width && !height)
        return '';
    let urlParams = `?nf_resize=${resize}`
    if (width > 0)
        urlParams += `&w=${width}`
    if (height > 0)
        urlParams += `&h=${height}`
    return urlParams;
}

// TODO: rename


const basename = (path: string): FileName => path.split('/').pop();
const fileType = (fileName: FileName) => fileName.split('.').pop();