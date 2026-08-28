import type { HapticPattern, Phrase, Settings } from './types';

const DATABASE = 'name-tap';
const STORE = 'settings';
const KEY = 'current';

export const defaultSettings: Settings = {
  phrases: [],
  language: 'en-US',
  visualCue: true,
  hapticCue: true,
  updatedAt: Date.now()
};

const supportedLanguages = new Set([
  'en-US', 'en-IN', 'en-GB', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'kn-IN',
  'ml-IN', 'mr-IN', 'gu-IN', 'es-ES', 'fr-FR', 'de-DE'
]);
const patterns = new Set<HapticPattern>(['tap', 'knock', 'urgent']);

export interface LoadedSettings {
  settings: Settings;
  recovered: boolean;
}

function settingsError(message = 'That settings file has invalid phrase data.'): never {
  throw new Error(message);
}

function validatePhrase(value: unknown): Phrase {
  if (!value || typeof value !== 'object') settingsError();
  const phrase = value as Partial<Phrase>;
  if (typeof phrase.id !== 'string' || !phrase.id.trim() || phrase.id.length > 128) settingsError();
  if (typeof phrase.label !== 'string' || !phrase.label.trim() || phrase.label.length > 100) settingsError();
  if (!Array.isArray(phrase.variants) || !phrase.variants.length || phrase.variants.length > 12) settingsError();
  const variants = phrase.variants.map((variant) => {
    if (typeof variant !== 'string' || !variant.trim() || variant.length > 100) settingsError();
    return variant.trim();
  });
  if (!variants.includes(phrase.label.trim())) settingsError('Each phrase label must be included in its spelling variants.');
  if (!patterns.has(phrase.pattern as HapticPattern)) settingsError();
  if (typeof phrase.createdAt !== 'number' || !Number.isFinite(phrase.createdAt) || phrase.createdAt < 0) settingsError();
  return {
    id: phrase.id,
    label: phrase.label.trim(),
    variants,
    pattern: phrase.pattern as HapticPattern,
    createdAt: phrase.createdAt
  };
}

/** Validates every persisted field before it can be rendered or saved again. */
export function validateSettings(value: unknown): Settings {
  if (!value || typeof value !== 'object') settingsError('Saved settings are not valid.');
  const settings = value as Partial<Settings>;
  if (!Array.isArray(settings.phrases) || settings.phrases.length > 100) settingsError();
  if (typeof settings.language !== 'string' || !supportedLanguages.has(settings.language)) settingsError('That settings file has an unsupported conversation language.');
  if (typeof settings.visualCue !== 'boolean' || typeof settings.hapticCue !== 'boolean') settingsError();
  if (settings.updatedAt !== undefined && (typeof settings.updatedAt !== 'number' || !Number.isFinite(settings.updatedAt))) settingsError();
  const phrases = settings.phrases.map(validatePhrase);
  if (new Set(phrases.map((phrase) => phrase.id)).size !== phrases.length) settingsError('Each imported phrase needs its own identifier.');
  return {
    phrases,
    language: settings.language,
    visualCue: settings.visualCue,
    hapticCue: settings.hapticCue,
    updatedAt: Date.now()
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteStoredSettings(): Promise<void> {
  localStorage.removeItem('name-tap:settings');
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const request = database.transaction(STORE, 'readwrite').objectStore(STORE).delete(KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // localStorage has already been cleared; IndexedDB recovery is best effort.
  }
}

export async function loadSettings(): Promise<LoadedSettings> {
  try {
    const database = await openDatabase();
    const stored = await new Promise<unknown>((resolve, reject) => {
      const request = database.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (stored === undefined) return { settings: { ...defaultSettings }, recovered: false };
    try {
      return { settings: validateSettings(stored), recovered: false };
    } catch {
      await deleteStoredSettings();
      return { settings: { ...defaultSettings }, recovered: true };
    }
  } catch {
    const fallback = localStorage.getItem('name-tap:settings');
    if (!fallback) return { settings: { ...defaultSettings }, recovered: false };
    try {
      return { settings: validateSettings(JSON.parse(fallback)), recovered: false };
    } catch {
      localStorage.removeItem('name-tap:settings');
      return { settings: { ...defaultSettings }, recovered: true };
    }
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  const value = { ...settings, updatedAt: Date.now() };
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const request = database.transaction(STORE, 'readwrite').objectStore(STORE).put(value, KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.setItem('name-tap:settings', JSON.stringify(value));
  }
}

export function exportSettings(settings: Settings): void {
  const clean = { format: 'name-tap-settings', version: 1, exportedAt: new Date().toISOString(), settings };
  const url = URL.createObjectURL(new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' }));
  const anchor = Object.assign(document.createElement('a'), { href: url, download: 'name-tap-settings.json' });
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseSettingsFile(value: string): Settings {
  const parsed = JSON.parse(value) as { format?: string; version?: number; settings?: unknown };
  if (parsed.format !== 'name-tap-settings' || (parsed.version !== undefined && parsed.version !== 1) || !parsed.settings) {
    throw new Error('This is not a Name Tap settings file.');
  }
  return validateSettings({ ...defaultSettings, ...(parsed.settings as object) });
}
