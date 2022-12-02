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
      }
    ]
  }
}

/* TO REMOVE the annoying enableUndici NodeJS 18 warn spam in stdout:
  node_modules/next/dist/server/config.js
  line 196
    Log.warn(`\`enableUndici\` option is unnecessary in Node.js v${NODE_18_VERSION} or greater.`);
  delete that shit; thank me later
  or I guess I'm thanking myself...
  I had a good 30 minutes digging through node_modules/next to find this and
  silence this horrifically annoying warning (it's a NextJS 18 bug and there
  is no helpful info online about it due to NextJS 18 being new/experimental 
  so I had to brute force it like this)
*/

module.exports = nextConfig;