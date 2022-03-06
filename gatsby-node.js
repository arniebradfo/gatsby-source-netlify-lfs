const fs = require('fs');

// TODO: this could be ts
exports.onPreInit = () => {
    // check to see if config exists and warn if it doesn't
    fs.stat(process.cwd() + '/src/netlifyLfs/netlifyLfsImageData.json', (err, stat) => {
        if (err && err.code === "ENOENT")
            console.warn("Plugin gatsby-source-netlify-lfs has no netlifyLfsImageData.json. Please Run `netlfs` to generate this file and commit it.");
    });
};
