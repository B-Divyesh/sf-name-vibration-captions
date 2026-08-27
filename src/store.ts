import type { Settings } from './types';

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

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadSettings(): Promise<Settings> {
  try {
    const database = await openDatabase();
    return await new Promise((resolve, reject) => {
      const request = database.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve({ ...defaultSettings, ...(request.result as Partial<Settings> | undefined) });
      request.onerror = () => reject(request.error);
    });
  } catch {
    const fallback = localStorage.getItem('name-tap:settings');
    return fallback ? { ...defaultSettings, ...(JSON.parse(fallback) as Partial<Settings>) } : defaultSettings;
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
  const parsed = JSON.parse(value) as { format?: string; settings?: Settings };
  if (parsed.format !== 'name-tap-settings' || !parsed.settings || !Array.isArray(parsed.settings.phrases)) {
    throw new Error('This is not a Name Tap settings file.');
  }
  return { ...defaultSettings, ...parsed.settings, updatedAt: Date.now() };
}
