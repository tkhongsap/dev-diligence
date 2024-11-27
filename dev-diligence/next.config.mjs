/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true
    },
    basePath: '',
    experimental: {
        appDir: true
    }
};

export default nextConfig;
