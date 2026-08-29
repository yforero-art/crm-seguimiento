import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Los adjuntos de clientes (cotizaciones, actas, fotos) se sirven desde Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: {
      // Adjuntos de seguimiento y documentos (cotizaciones/contratos) pueden pesar varios MB
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
