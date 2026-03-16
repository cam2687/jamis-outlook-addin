const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    taskpane: "./src/taskpane/taskpane.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/taskpane/taskpane.html",
      filename: "taskpane.html",
      chunks: ["taskpane"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.xml", to: "manifest.xml" },
        { from: "assets", to: "assets" },
      ],
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
