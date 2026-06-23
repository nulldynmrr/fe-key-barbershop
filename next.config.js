/** @type {import('next').NextConfig} */

// Derive the uploads image host from NEXT_PUBLIC_API_URL instead of hardcoding
// an IP/domain here, so no infra address ever needs to be committed to the repo.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
let apiHostPattern = null;
if (apiUrl) {
  const { protocol, hostname, port } = new URL(apiUrl);
  apiHostPattern = {
    protocol: protocol.replace(":", ""),
    hostname,
    ...(port ? { port } : {}),
    pathname: "/uploads/**",
  };
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      ...(apiHostPattern ? [apiHostPattern] : []),
    ],
  },
};

module.exports = nextConfig;