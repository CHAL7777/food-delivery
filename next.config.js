/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow development origins for Next.js dev server
  // This is required when using Supabase auth or other services
  // that need to communicate with the dev server
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
  ],
}

module.exports = nextConfig

