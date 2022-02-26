const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const StylelintPlugin = require("stylelint-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const config = {
  target: "web",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/[name].[fullhash].bundle.js",
    publicPath: "",
  },
  devtool: "eval-source-map",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devServer: {
    static: path.resolve(__dirname, "src"),
    historyApiFallback: true,
    port: 3000,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // reactVendor: {
        //   name: "reactVendor",
        //   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        //   chunks: "all",
        //   enforce: true,
        //   priority: 10,
        // },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          name: "vendors",
          enforce: true,
          priority: 20,
          reuseExistingChunk: true
        },
        styles: {
          test: /\.css$/,
          chunks: "all",
          enforce: true,
          priority: 10,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
            options: {
              // importLoaders: 2, // 2 => postcss-loader, sass-loader
              // modules: {
              //   localIdentName: "[name]__[local]___[hash:base64:5]",
              // },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      },
      {
        test: /\.svg$/i,
        type: "asset/inline"
      }
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "css/[name].[fullhash:3].css",
    // }),
    new HtmlWebpackPlugin({
      template: "./index.ejs",
      favicon: "./favicon.ico",
      templateParameters: {
        title: "Hardhat Dapp"
      },
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "favicon.ico", to: "favicon.ico" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "logo192.png", to: "logo192.png" },
      ],
    }),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 3001 }));
    config.plugins.push(new StylelintPlugin());
  } else {
    config.devtool = "source-map";
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  }

  // Improve build time performance
  const dllFiles = fs.readdirSync(path.resolve(__dirname, "dll"));
  dllFiles.forEach((file) => {
    if (/.*\.dll\.js$/.test(file)) {
      config.plugins.push(
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, "dll", file),
        })
      );
    } else if (/.*\.manifest\.json$/.test(file)) {
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context: path.resolve(__dirname, "dll"),
          manifest: path.resolve(__dirname, "dll", file),
        })
      );
    }
  });

  const smp = new SpeedMeasurePlugin();
  const configWithTimeMeasure = smp.wrap(config);
  configWithTimeMeasure.plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:3].css",
    })
  );
  return configWithTimeMeasure;
};
