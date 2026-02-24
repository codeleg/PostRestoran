const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/shared"],
    output: 'standalone',
    experimental: {
        // Trace dependencies across the entire monorepo
        outputFileTracingRoot: path.join(__dirname, '../../'),
    },
};

module.exports = nextConfig;
