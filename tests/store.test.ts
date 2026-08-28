import { describe, expect, it } from 'vitest';
import { parseSettingsFile, validateSettings } from '../src/store';

const validSettings = {
  phrases: [{ id: 'maya', label: 'Maya', variants: ['Maya', 'Maia'], pattern: 'tap', createdAt: 1 }],
  language: 'en-US',
  visualCue: true,
  hapticCue: true,
  updatedAt: 1
};

describe('settings validation', () => {
  it('accepts a complete exported settings payload', () => {
    expect(parseSettingsFile(JSON.stringify({ format: 'name-tap-settings', version: 1, settings: validSettings })).phrases[0]?.variants).toEqual(['Maya', 'Maia']);
  });

  it('rejects the verifier’s malformed string variants before it can be saved', () => {
    const malformed = { format: 'name-tap-settings', settings: { phrases: [{ id: 'bad', label: 'Broken', variants: 'string', pattern: 'tap', createdAt: 1 }] } };
    expect(() => parseSettingsFile(JSON.stringify(malformed))).toThrow('invalid phrase data');
  });

  it('rejects corrupted persisted settings instead of returning a renderable broken shape', () => {
    expect(() => validateSettings({ ...validSettings, phrases: [{ ...validSettings.phrases[0], variants: null }] })).toThrow('invalid phrase data');
  });
});
