import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      let options = {};
      const url = new URL(request.url);
      const pathname = new URL(request.url).pathname;

      // Try to find the file, fallback to index.html for SPA routes
      if (pathname === '/' || !pathname.includes('.')) {
        options.mapRequestToAsset = (req) =>
          new Request(`${new URL(req.url).origin}/index.html`, req);
      }

      const asset = await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        options
      );

      // Set cache headers
      const response = new Response(asset, asset);
      response.headers.set('Cache-Control', 'public, max-age=3600');
      return response;
    } catch (e) {
      return new Response(`An error occurred: ${e.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
};
