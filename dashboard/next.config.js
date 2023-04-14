/** @type {import('next').NextConfig} */

// require('dotenv').config({ path: __dirname + '/../.env' })
// console.log(__dirname + '/../.env');
// const { parsed: myEnv } = require("dotenv").config({
//   path: "./env/local",
// });
// console.log('port env', myEnv);
const path = require('path')
const { parsed: localEnv } = require('dotenv').config({
  path: path.resolve(__dirname, `../.env`),
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["storage.googleapis.com", "lh3.googleusercontent.com"]
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    PORT: localEnv.PORT || 8020
  }
}

module.exports = nextConfig
