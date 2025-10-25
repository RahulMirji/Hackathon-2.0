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

// Validate required environment variables at build time
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['AI_API_URL', 'AI_API_KEY', 'AI_MODEL']
  const missing = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or environment configuration.'
    )
  }
}

export default nextConfig
