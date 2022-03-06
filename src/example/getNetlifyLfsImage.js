import { initNetlifyLfsImageData } from "gatsby-source-netlify-lfs";
import imageData from "./netlifyLfsImageData.json";

/** default IGetNetlifyLfsImageDataArgs */
const defaultArgs = {
    // backgroundColor: 'hsl(0deg 0% 1%)',
};

/** use in place of getImage() from "gatsby-plugin-image" */
export const getNetlifyLfsImage = initNetlifyLfsImageData(imageData, defaultArgs);