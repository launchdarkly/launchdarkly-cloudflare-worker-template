const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "webworker",
  output: { path: path.resolve(__dirname, "worker"), filename: "script.js" },
  resolve: {
    fallback: {
      assert: false,
      crypto: false,
      fs: false,
      http: false,
      https: false,
      net: false,
      os: false,
      tls: false,
      url: false,
      util: false,
      yaml: false,
    },
  },
};
