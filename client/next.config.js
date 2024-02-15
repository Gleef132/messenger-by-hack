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
    domains: ['messenger-by-hack-server.vercel.app'],
    loader: 'default',
    path: 'https://messenger-by-hack-server.vercel.app/static/',
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig