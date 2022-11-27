const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ogqlzchzftdqgeolrbzc.supabase.co',
        // port: '',
        // pathname: '/storage/v1/object/public/avatar/**'
      }
    ]
  }
}

module.exports = nextConfig;
