// import path from 'path';
const path = require('path');


const withPWA = require("next-pwa");
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/USYD_Capstone_Project_CS01" : "";

function resolve (dir) {
  return path.join(__dirname, dir);
}


module.exports = withPWA({
  pwa: {
    // dest: "assets",
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "app-cache",
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  reactStrictMode: true,
  basePath: basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  alias: {
    '@/': resolve('./'),
  }
});
