/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['metadata.ens.domains', 'ipfs.io', 'ipfs.infura.io', 'lens.infura-ipfs.io', 'ipfs://ipfs.io', 'ipfs://ipfs.infura.io', 'ipfs://lens.infura-ipfs.io', 'ipfs://*', 'ipfs://*#*', 'ipfs://*/*', 'ipfs://*/*#*', 'ipfs:*', 'ipfs:*#*', 'ipfs:*/*', 'ipfs:*/*#*'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '*',
    }, {
      protocol: 'https',
      hostname: 'ipfs',
    }],
  },
  // swcMinify: true,
  transpilePackages: ['@lens-protocol'],
};

module.exports = nextConfig;
