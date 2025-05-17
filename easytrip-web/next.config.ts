const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ml/:path*',
        destination: 'http://localhost:8000/ml/:path*',
      },
    ];
  },
};

export default nextConfig;