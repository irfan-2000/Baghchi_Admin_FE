import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip SSR for WebRTC route
  if (pathname.startsWith('/webrtc') || pathname === '/webrtc') {
    const filePath = resolve(browserDistFolder, 'index.html');
    const html = await fs.readFile(filePath, 'utf-8');
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  try {
    const context = getContext();
    const result = await angularAppEngine.handle(request, context);
    return result || new Response('Not found', { status: 404 });
  } catch {
    // Fallback to CSR if SSR fails
    const filePath = resolve(browserDistFolder, 'index.html');
    const html = await fs.readFile(filePath, 'utf-8');
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);