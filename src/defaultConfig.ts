export interface GatsbySourceNetlifyLfsConfig {
    /** Folders to include in lfsImageData. Defaults to paths from 'gatsby-source-filesystem' */
    paths?: string[];
    /** Image formats to include in lfsImageData */
    formats?: ImageFormat[];
    /** Which placeholder to create for each image */
    placeholder?: Placeholder;
    /** Options for the low-resolution placeholder image */
    blurredOptions?: {
        //**  https://github.com/gatsbyjs/gatsby/blob/4a765b5c62208d58f0bd7fd59558160c0b9feed3/packages/gatsby-plugin-image/src/image-utils.ts#L53 */
        /** [base64Width](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/#toformatbase64) */
        width?: number;
        /** [toFormatBase64](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/#toformatbase64) */
        toFormat?: "jpg" | "png" | "";
    };
    /** [Potrace Parameters](https://www.npmjs.com/package/potrace#parameters) */
    tracedSVGOptions?: Record<string, any>;
    /** the filetype of the output netlifyLfsImageData file */
    dataFileFormat?: 'js' | 'ts' | 'json';
}

export type ImageFormat = "jpg" | "jpeg" | "png" | "svg" | "gif";
const defaultFormats: ImageFormat[] = ["jpg", "jpeg", "png", "svg", "gif"];

export type Placeholder = "dominantColor" | "blurred" | "tracedSVG" | "none";

export const defaultConfig: GatsbySourceNetlifyLfsConfig = {
    // paths: [], // Defaults to paths from 'gatsby-source-filesystem'
    formats: defaultFormats,
    placeholder: "none",
    blurredOptions: {
        width: 20,
        toFormat: "",
    },
    tracedSVGOptions: {},
    dataFileFormat: "json"
};
