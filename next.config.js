/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "media.mapgenie.io" },
            { hostname: "cdn.mapgenie.io" }
        ]
    }
}

module.exports = nextConfig
