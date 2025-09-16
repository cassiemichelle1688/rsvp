// src/server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();

  // Example API endpoints (optional)
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

/**
 * The request handler used by Angular CLI during dev & build.
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);

/**
 * Function to provide parameters for prerendering dynamic routes
 * Return empty array to disable prerendering of dynamic routes
 */
export function getPrerenderParams(): Array<{name: string, id: string}> {
  // Return empty array to disable prerendering for dynamic routes like home/:name/:id
  return [];
  
  // If you want to prerender specific routes, return them like this:
  // return [
  //   { name: 'john', id: '123' },
  //   { name: 'jane', id: '456' }
  // ];
}