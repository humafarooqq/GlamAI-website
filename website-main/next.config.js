const { API_CONFIG } = require('./config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: API_CONFIG.IMAGE_DOMAINS,
  },
}

module.exports = nextConfig
