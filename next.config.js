/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.google.com *.gstatic.com;
              style-src 'self' 'unsafe-inline' *.googleapis.com *.google.com;
              img-src 'self' data: blob: *.googleapis.com *.gstatic.com *.google.com;
              font-src 'self' data: *.gstatic.com;
              frame-src 'self' *.google.com;
              connect-src 'self' *.googleapis.com *.google.com firestore.googleapis.com *.firebaseio.com;
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
