# Gatsby Netlify LFS Source Plugin
Host image-heavy [Gatsby](https://www.gatsbyjs.com/) sites on [Netlify](https://www.netlify.com/with/gatsby/) for _free_[\*](https://www.netlify.com/pricing/#add-ons-large-media) using [Git LFS](https://git-lfs.github.com/) & [Netlify Large Media](https://docs.netlify.com/large-media/setup/).

## How it works

### The Problem
One of Gatsby's primary draws is how it [handles images](https://using-gatsby-image.gatsbyjs.org/) with [`gatsby-plugin-image`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/). Gatsby can also be [deployed for free from a git repo via Netlify](https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/). Unfortunately, git repos cannot contain large numbers of image or binary files required for an image-heavy Gatsby site. Image-heavy Gatsby sites would then require a content management system (like [Netlify CMS](https://github.com/netlify-templates/gatsby-starter-netlify-cms), or other [Headless CMS](https://www.gatsbyjs.com/docs/how-to/sourcing-data/headless-cms/)s) and possibly _paid_ hosting.

### Netlify Hosting with Git LFS
This plugin solves the above problem by storing large files (images and other media) using [Git LFS (**L**arge **F**ile  **S**torage)](https://git-lfs.github.com/), and serving those large image files to a Gatsby site via [Netlify Large Media](https://docs.netlify.com/large-media/setup/). It replaces the need for `gatsby-plugin-sharp` and `gatsby-transformer-sharp` with the Netlify LFS [Transform Images API](https://docs.netlify.com/large-media/transform-images/) by providing an alternate method of creating the `image` prop for the `<GatsbyImage/>` component.

### Drawbacks
The `gastby build` command [doesn't have access to the git LFS images at build time](https://github.com/gatsbyjs/gatsby/issues/12438#issuecomment-474113335). This limitation requires us to preprocess all the build-time data we need from our lfs images, and then commit that data as a file. This file must be regenerated _every time_ an image is added or removed from the LFS tracked repo.

## Getting Started

### 1. Configure Git LFS and Netlify
1. [Configure Git LFS](https://git-lfs.github.com/) by following the "Getting Started" instructions on the linked page.
2. [Setup Netlify Large Media](https://docs.netlify.com/large-media/setup/) by following the instructions on the linked page.

### 2. Configure the Gatsby Plugin
1. install the plugin
    ```bash
    npm install gatsby-source-netlify-lfs
    ```
2. Optionally - create a plugins config in `gatsby-config.js`. This plugin will work without this config, but this is where overrides can be providied to the `netlfs` script.
    ```js
    module.exports = {
      plugins: [
        {
          resolve: 'gatsby-source-netlify-lfs',
          options: {
            // 'paths' defaults to include all 'gatsby-source-filesystem' config paths, but they can be manually overridden here
            paths: [
              `${__dirname}/src/blog/images`,
              `${__dirname}/content/images`,
            ],

            // limit the formats that are included
            // formats: ['jpg', 'png'], //: ('jpg' | 'jpeg' | 'png' | 'svg' | 'gif')[]
            
            // placeholder type
            // placeholder: 'blurred',  //: 'dominantColor' | 'blurred' | 'none';
            // blurredOptions: {
            //   width: 40,
            //   toFormat: 'jpg',
            // }
          }
        }
      ],
    }
    ```
3. Setup a npm script in your `package.json` to run the `netlfs` preprocess cli script
    ```json
    {
      "scripts":{
        "netlfs": "netlfs"
      }
    }
    ```
4. `npm run netlfs` to generate the `./src/netlifyLfs/netlifyLfsImageData.json` and **commit this file**. It's required by gatsby build when deployed to netlify. __This file must be regenerated _every time_ an image is added or removed from the LFS tracked repo.__ You may want to add this as a pre-commit hook or as part of a watch command.


### 3. Use with `<GatsbyImage/>` in React
1. Create a file `./src/netlifyLfs/getNetlifyLfsImage.js` that is some version of the example below:
    ```js
    import { initNetlifyLfsImageData } from "gatsby-source-netlify-lfs";
    import imageData from "./netlifyLfsImageData.json";

    /** default IGetNetlifyLfsImageArgs */
    const defaultArgs = {
        // backgroundColor: 'hsl(0deg 0% 1%)',
    };

    /** use in place of getImage() from "gatsby-plugin-image" */
    export const getNetlifyLfsImage = initNetlifyLfsImageData(imageData, defaultArgs);
    ```
2. Use the exported `getNetlifyLfsImage()` in place of `getImage()`
    ```jsx
    const ImageExample = (props) => {
      // get the publicURL of the desired image
      const data = useStaticQuery(graphql`{
        exampleImage: file(absolutePath: { regex: "/ExampleImageName.png/" }) { publicURL })
      }`);
      const image = getNetlifyLfsImage({
        publicURL: data.exampleImage.publicURL
        backgroundColor: 'hsl(0deg 0% 1%)',
        // other options - see 'getNetlifyLfsImage args' below
      })
      return (
        <GatsbyImage image={image} alt={'Netlify LFS Example Image'}/>
      )
    }
    ```

## Docs
### `gatsby-config.js` Options
...later, the only currently supported option is the optional `paths` array mentioned above. Future options will look like the interface [GatsbySourceNetlifyLfsConfig](./src/defaultConfig.ts#L1) 

### `getNetlifyLfsImage` args
...later, see linked typescript def in the meantime: [IGetNetlifyLfsImageDataArgs](./src/initNetlifyLfsImageData.ts#L4)

## Contributing
PRs welcome.

[TODOs](./TODO.md)
