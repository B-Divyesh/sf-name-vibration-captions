import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('static deployment policy', () => {
  const config = JSON.parse(readFileSync(resolve('public/staticwebapp.config.json'), 'utf8')) as {
    globalHeaders: Record<string, string>;
    mimeTypes: Record<string, string>;
    routes: Array<{ route: string; headers: Record<string, string> }>;
  };

  it('sets restrictive microphone, framing, and script response policies', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('microphone=(self)');
    expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
  });

  it('marks hashed assets immutable and the manifest with its correct media type', () => {
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers['Cache-Control']).toContain('immutable');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.routes.find((route) => route.route === '/manifest.webmanifest')?.headers['Content-Type']).toBe('application/manifest+json');
  });

  it('@claim:build-artifacts creates every named static route and versioned offline file', () => {
    for (const file of ['dist/index.html', 'dist/demo/index.html', 'dist/privacy/index.html', 'dist/terms/index.html', 'dist/404.html', 'dist/sw.js', 'dist/manifest.webmanifest', 'dist/staticwebapp.config.json']) expect(existsSync(resolve(file))).toBe(true);
    expect(readFileSync(resolve('dist/sw.js'), 'utf8')).toMatch(/name-tap-shell-[a-f0-9]{12}/);
    expect(readFileSync(resolve('dist/sw.js'), 'utf8')).not.toContain('__BUILD_VERSION__');
    expect(config).toHaveProperty('responseOverrides.404.rewrite', '/404.html');
    expect(config).not.toHaveProperty('navigationFallback');
    expect(config.routes.find((route) => route.route === '/404')?.statusCode).toBe(404);
  });

  it('@claim:asset-provenance keeps the generated source, prompt, and public derivative', () => {
    expect(existsSync(resolve('assets/src/name-tap-hero.png'))).toBe(true);
    expect(existsSync(resolve('assets/src/name-tap-hero.png.json'))).toBe(true);
    expect(existsSync(resolve('public/assets/name-tap-social.webp'))).toBe(true);
    expect(readFileSync(resolve('.factory/design.md'), 'utf8')).toContain('Azure OpenAI image generation');
  });

  it('@claim:license-file ships the MIT license named by the footer and package docs', () => {
    const license = readFileSync(resolve('LICENSE'), 'utf8');
    expect(license).toContain('Permission is hereby granted');
    expect(license).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
    expect(readFileSync(resolve('README.md'), 'utf8')).toContain('MIT');
  });
});
