const path = require('path');
const glob = require('glob');       //Glob is required for importing all required files

// Creating separate entries for each JS file
const jsEntries = {};
glob.sync(path.join(__dirname, 'public/js/**/*.js')).forEach((file) => {
  const name = path.basename(file, '.js');
  jsEntries[name] = file;
});

// Creating separate entries for each SCSS file
const cssEntries = {};
glob.sync(path.join(__dirname, 'public/assets/scss/**/*.scss')).forEach((file) => {
  const name = path.basename(file, '.scss');
  cssEntries[name] = file;
});

//Webpack plugins required for minification
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const options = {
    fileName: 'manifest.json',
    map: (file) => {
      if (file.name.endsWith('.js')) {
        // JS files get a 'js' basePath
        let nm = file.name;
        file.name = `/js/${nm}`;
      } else if (file.name.endsWith('.css')) {
        // CSS files get a 'css' basePath
        let nm = file.name;
        file.name = `/assets/css/${nm}`;
      } else if (file.isAsset) {
        console.log("ImageFILE");
        let nm = file.name;
        file.name = `/assets/${nm}`;
      }
      return file;
    },
  };
  
  
module.exports = {
    mode: 'production',
    entry: {
        ...cssEntries,
        ...jsEntries,
    },
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: 'js/[name]-[contenthash].min.js',
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.js$/,

                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                exclude: /\/assets\/scss\/(modules|partials|variables)\//,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
                ]
              },
              {
                test: /\.scss$/,
                include: /\/assets\/scss\/(modules|partials|variables)\//,
                use: [
                  'null-loader'
                ]
              },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: "responsive-loader",
                        options: {
                            name: '[name]-[hash]-[width].[ext]',
                            adapter: require('responsive-loader/sharp'),
                            placeholder: true,
                            placeholderSize: 20,
                            quality: 90,
                            format: 'webp',
                            outputPath: 'images/',
                        }
                    }
                ],
                type: 'javascript/auto',
                parser: {
                    dataUrlCondition: {
                        maxSize: 3 * 1024, // Convert images < 3kb to base64 strings
                    },
                },

            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash].min.css',
        }),
        new WebpackManifestPlugin(options),
        new CleanWebpackPlugin(),
        new FixStyleOnlyEntriesPlugin({ extensions: ['scss'] }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false, // removes comments from js files
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                },
            }),
        ]
    },
};