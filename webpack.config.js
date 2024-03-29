const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "webworker",
  output: { path: path.resolve(__dirname, "worker"), filename: "script.js" },
  node: {
    fs: "empty",
    tls: "empty",
    net: "empty",
  },
};
