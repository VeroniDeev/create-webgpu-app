const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const config = {
  mode: "production",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.wgsl$/,
        use: {
          loader: "ts-shader-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  devServer: {
    port: 3000,
  },
};

module.exports = config;
