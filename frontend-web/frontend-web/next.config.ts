import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Silencia el warning de workspace root con múltiples lockfiles
  turbopack: {
    root: __dirname,
  },

  // Permite acceso desde la IP de red local (evita el warning de cross-origin)
  allowedDevOrigins: ["192.168.33.1", "localhost", "127.0.0.1"],

  // El frontend se ejecuta en 3000 y el backend en 3001.
  // En desarrollo, /api/* se reescribe al backend para evitar CORS y para que la web use el mismo origen.
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
