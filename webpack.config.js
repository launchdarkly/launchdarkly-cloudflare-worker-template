module.exports = {
  entry: './index.js',
  target: 'webworker',
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
  },
}
