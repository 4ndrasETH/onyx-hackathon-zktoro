/** @type {import('next').NextConfig} */
module.exports = {
    async headers() {
      return [
        {
          source: '/api/vp',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store', // Matched parameters can be used in the value
            },
          ],
        },
      ]
    },
  }
