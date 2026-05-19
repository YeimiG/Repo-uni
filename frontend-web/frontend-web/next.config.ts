import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Silencia el warning de workspace root con múltiples lockfiles
  turbopack: {
    root: __dirname,
  },

  // Permite acceso desde la IP de red local (evita el warning de cross-origin)
  allowedDevOrigins: ["192.168.33.1", "localhost", "127.0.0.1"],

  // Proxy: redirige /api/* al backend en 3001 — elimina problemas de CORS en dev
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
