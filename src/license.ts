const SLUG = 'name-vibration-captions';
const STORAGE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${STORAGE_KEY}:verdict`;
const VERIFY_AFTER = 24 * 60 * 60 * 1000;

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

interface CachedVerdict {
  valid: boolean;
  checkedAt: number;
}

export interface LicenseState {
  token: string | null;
  unlocked: boolean;
  checking: boolean;
  notice: string;
}

function cache(): CachedVerdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as CachedVerdict | null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): string | null {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license')?.trim() ?? null;
  if (!token) return localStorage.getItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return token;
}

export function initialLicenseState(): LicenseState {
  const token = captureReturnedLicense();
  const saved = cache();
  return {
    token,
    unlocked: Boolean(token && (!saved || saved.valid)),
    checking: false,
    notice: ''
  };
}

export async function verifyLicense(state: LicenseState, force = false): Promise<LicenseState> {
  if (!state.token) return { ...state, unlocked: false, checking: false };
  const saved = cache();
  if (!force && saved && Date.now() - saved.checkedAt < VERIFY_AFTER) {
    return { ...state, unlocked: saved.valid, checking: false };
  }
  try {
    const endpoint = `https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(state.token)}`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Verification is temporarily unavailable.');
    const result = (await response.json()) as { valid: boolean; reason?: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return {
      ...state,
      unlocked: result.valid,
      checking: false,
      notice: result.valid ? 'Lifetime unlock active on this device.' : 'This license is no longer active.'
    };
  } catch {
    return {
      ...state,
      checking: false,
      notice: state.unlocked
        ? 'Offline — using the last license check.'
        : 'Could not verify while offline. Your free phrases still work.'
    };
  }
}

export function saveLicense(token: string): LicenseState {
  const clean = token.trim();
  if (!clean) throw new Error('Paste the license from your receipt.');
  localStorage.setItem(STORAGE_KEY, clean);
  localStorage.removeItem(VERDICT_KEY);
  return { token: clean, unlocked: true, checking: true, notice: 'Checking your license…' };
}

export function removeLicense(): LicenseState {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERDICT_KEY);
  return { token: null, unlocked: false, checking: false, notice: 'License removed from this device.' };
}
