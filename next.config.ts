import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

export default nextConfig;

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4000/api/:path*', // Asegúrate de que este sea el puerto correcto para tu backend
        },
      ];
    },
};
