/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Server-only environment variables (not exposed to client)
  serverRuntimeConfig: {
    AI_API_URL: process.env.AI_API_URL,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_PROVIDER: process.env.AI_PROVIDER,
  },
}

// Note: Environment variables should be set in Vercel project settings
// Build will continue with missing vars and fail at runtime if accessed

export default nextConfig
