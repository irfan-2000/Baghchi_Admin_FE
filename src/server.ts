import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// -----------------------------
// Paths
// -----------------------------
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// -----------------------------
// Angular Engine (Modern API)
// -----------------------------
const angularAppEngine = new AngularAppEngine();

// -----------------------------
// Express App (for local dev)
// -----------------------------
const app = express();

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Handle all other requests with Angular SSR
app.use('/**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;
  
  angularAppEngine
    .handle(new Request(`${protocol}://${headers.host}${originalUrl}`), {
      // Add any context needed for your app
    })
    .then((response: Response | null) => {
      if (response) {
        // Convert Response to Express response
        res.status(response.status);
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        response.body?.pipeTo(new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          }
        }));
      } else {
        next();
      }
    })
    .catch(next);
});

// -----------------------------
// Netlify serverless handler
// -----------------------------
export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();

  // Example API endpoints can be defined here.
  // Uncomment and define endpoints as necessary.
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

// -----------------------------
// Export handlers
// -----------------------------
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);

// -----------------------------
// Start Express server if run directly
// -----------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}