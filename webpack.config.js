const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./index.js",
  target: "webworker",
  output: { path: path.resolve(__dirname, "worker"), filename: "script.js" },
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      yaml: false,
    },
  },
};
