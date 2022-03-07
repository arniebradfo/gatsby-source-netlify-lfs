# TODO

## Release
- use typescript to compile 
- alias this as a yarn package to test properly
- make the lfs-img cli inputs work
- make an npm cli script that works
- plan architecture for extension
  - add gatsby-config.js settings
- rename things
- –––
- write instructions
- release and test cli


## Improve
- automatically create `getNetlifyLfsImage.js` if it doesn't exist
  - provide commented defaultArgs based on: [default options](https://www.gatsbyjs.com/plugins/gatsby-plugin-image#customizing-the-default-options)
- support options in `gatsby-config.js` related to
  - `gatsby-plugin-image`
    - [default options](https://www.gatsbyjs.com/plugins/gatsby-plugin-image#customizing-the-default-options)?
  - `gatsby-plugin-sharp`
    - [placeholderOptions](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#placeholder)
      - [base64](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp#toformatbase64)
      - [tracedSVG](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp#tracedsvg)
      - dominantColor
      - none
    - [transformOptions](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#transformoptions) with css filters
      - [grayscale](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp#grayscale) 
      - [duotone](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp#duotone)
- `resolve: 'gatsby-source-netlify-lfs` should check during gatsby-build to see if `netlifyLfsImageDimensions.json` exists
  - in the short term, it should just log something...


## Notes
- images with lfs
  - gatsby-v2-image-netlify-lfs doesn't rehydrate correctly? YES IT DOES! Fucking Gastby devs: https://github.com/gatsbyjs/gatsby/discussions/27950#discussioncomment-129499 - spent soo long trying to fix this "error"
  - videos are absent after netlify build...
  - gifs don't retain after being passed through the api
  - netlify gatsby build doesn't have access to image data: https://github.com/gatsbyjs/gatsby/issues/12438#issuecomment-474113335
  - write a replacement for `gatsby-plugin-sharp` and `gatsby-transformer-sharp` that uses netlify [Netlify Large Media Image Transforms](https://docs.netlify.com/large-media/transform-images/#request-transformations)
  - preprocess all image files into a `media-dimensions.json` object with height width and aspect ratio
    - look in `gatsby-config.js` for plugins `gatsby-source-filesystem` options.path and builds source folders based on that
    - commit the `media-dimensions.json` config file and netlify gatsby build looks at it during build time to generate request transforms responsive images
  - uses native `gatsby-image`/`<GatsbyImage/>` component
    - https://www.gatsbyjs.com/docs/images-and-files/
    - https://www.gatsbyjs.com/plugins/gatsby-image/
    - https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/
    - https://www.gatsbyjs.com/plugins/gatsby-transformer-sharp/