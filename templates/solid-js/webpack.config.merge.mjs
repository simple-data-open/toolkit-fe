export default {
  resolve: {
    extensions: ['.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              presets: [['solid', { generate: 'dom', hydratable: true }]],
            },
          },
          'ts-loader',
          {
            loader: 'source-map-loader',
          },
        ],
      },
    ],
  },
};
