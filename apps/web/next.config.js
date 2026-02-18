/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@postrestoran/shared"],
    output: 'standalone',
};

module.exports = nextConfig;
