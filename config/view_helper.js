const path = require('path');
const manifest = require('../public/dist/manifest.json');
const env = require('./environment');

module.exports = (app) => {
    app.locals.getAssetPath = function (filename) {
        if (env.name == 'development'){
            return filename;
        }

        if (manifest[filename]) {
          return path.join('/dist', manifest[filename]);
        }
        throw new Error(`The file ${filename} is not found in manifest.`);
      }
}