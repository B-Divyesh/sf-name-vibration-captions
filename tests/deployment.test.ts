import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
    const finalizer = readFileSync(resolve('scripts/finalize-build.mjs'), 'utf8');
    for (const route of ['demo', 'privacy', 'terms', "'404'"]) expect(finalizer).toContain(route);
    expect(finalizer).toContain("new URL('not-found.html', dist)");
    for (const file of ['public/sw.js', 'public/manifest.webmanifest', 'public/staticwebapp.config.json']) expect(existsSync(resolve(file))).toBe(true);
    expect(config).toHaveProperty('responseOverrides.404.rewrite', '/not-found.html');
    expect(config).not.toHaveProperty('navigationFallback');
    if (existsSync(resolve('dist/sw.js'))) {
      expect(readFileSync(resolve('dist/sw.js'), 'utf8')).toMatch(/name-tap-shell-[a-f0-9]{12}/);
      expect(readFileSync(resolve('dist/sw.js'), 'utf8')).not.toContain('__BUILD_VERSION__');
    }
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

  it('keeps one uniquely tagged test for every registered claim', () => {
    const claims = JSON.parse(readFileSync(resolve('.factory/claims.json'), 'utf8')) as Array<{ id: string; test: string }>;
    const testSource = readdirSync(resolve('tests'), { recursive: true })
      .filter((entry) => typeof entry === 'string' && entry.endsWith('.ts'))
      .map((entry) => readFileSync(resolve('tests', entry), 'utf8'))
      .join('\n');
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const { id, test } of claims) {
      expect(test).toContain(`@claim:${id}`);
      expect(testSource.match(new RegExp(`@claim:${id}(?![a-z0-9-])`, 'g')) ?? [], id).toHaveLength(1);
    }
    const tagged = [...testSource.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(new Set(tagged)).toEqual(new Set(claims.map(({ id }) => id)));
  });

  it('keeps reviewed public copy and the catalog line plain', () => {
    const publicCopy = [readFileSync(resolve('README.md'), 'utf8'), readFileSync(resolve('src/legal.ts'), 'utf8'), readFileSync(resolve('src/main.ts'), 'utf8')].join('\n');
    for (const rejected of ['Full-screen visual alert', 'tap pattern', 'native vibration waveform', 'off origin', 'short security logs', 'Every public statement']) {
      expect(publicCopy).not.toContain(rejected);
    }
    const catalog = readFileSync(resolve('.factory/catalog-description.txt'), 'utf8').trim();
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^Feel\b/);
  });
});
