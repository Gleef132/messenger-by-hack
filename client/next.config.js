/** @type {import('next').NextConfig} */
// const dns = require("dns");
// dns.setDefaultResultOrder("ipv4first")
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  images: {
    domains: ['localhost'],
    loader: 'default',
    path: 'http://localhost:5000/static/',
  },
}

module.exports = nextConfig