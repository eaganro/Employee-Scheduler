module.exports = {
  entry: __dirname + "/client/dev/index.jsx",
  output: {
    path: __dirname + "/client/dist",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        test: /\.jsx$/,
        include: __dirname + '/client/dev',
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
};
