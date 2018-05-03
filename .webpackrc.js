const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      define: {
        GATEWAY_PATH: process.env.NO_PROXY === 'true'? 'http://127.0.0.1:8080': '',
        IMG_SERVER_PATH: process.env.NO_PROXY === 'true'? 'http://127.0.0.1:8080': '',
      },
    },
    production: {
      define: {
        GATEWAY_PATH: 'https://www.herton.com',
        IMG_SERVER_PATH: 'https://www.herton.com',
      },
    }
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
