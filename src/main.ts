import './style.css';
import { findMatch } from './matcher';
import { checkoutUrl, initialLicenseState, removeLicense, saveLicense, verifyLicense, type LicenseState } from './license';
import { legalPage } from './legal';
import { LocalCaptioner, localSpeechSupport } from './speech';
import { defaultSettings, exportSettings, loadSettings, parseSettingsFile, saveSettings } from './store';
import type { CaptionLine, HapticPattern, Phrase, Settings } from './types';

const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) throw new Error('App root was not found.');
const app: HTMLDivElement = appElement;

const legal = legalPage(window.location.pathname);
if (legal) {
  document.title = window.location.pathname === '/privacy' ? 'Privacy — Name Tap' : 'Terms — Name Tap';
  app.innerHTML = legal;
  registerServiceWorker();
} else {
  void startApp();
}

interface AppState {
  settings: Settings;
  license: LicenseState;
  stage: 'setup' | 'starting' | 'listening';
  consent: boolean;
  online: boolean;
  notice: string;
  error: string;
  captions: CaptionLine[];
  lastMatch: Phrase | null;
  cueActive: boolean;
  removed: { phrase: Phrase; index: number } | null;
  updateReady: ServiceWorkerRegistration | null;
}

let state: AppState;
let captioner: LocalCaptioner | null = null;
const lastAlertAt = new Map<string, number>();

async function startApp(): Promise<void> {
  const loaded = await loadSettings().catch(() => ({ settings: { ...defaultSettings }, recovered: true }));
  state = {
    settings: loaded.settings,
    license: initialLicenseState(),
    stage: 'setup',
    consent: false,
    online: navigator.onLine,
    notice: loaded.recovered ? 'Saved settings were invalid and were reset. You can add your phrases again.' : '',
    error: '',
    captions: [],
    lastMatch: null,
    cueActive: false,
    removed: null,
    updateReady: null
  };

  render();
  bindEvents();
  registerServiceWorker();
  if (state.license.token && navigator.onLine) {
    state.license = { ...state.license, checking: true };
    render();
    state.license = await verifyLicense(state.license);
    render();
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character] ?? character);
}

function phraseMarkup(phrase: Phrase): string {
  const variants = phrase.variants.slice(1).map(escapeHtml).join(', ');
  return `<li class="phrase-row">
    <span class="phrase-grip" aria-hidden="true">●</span>
    <span><strong>${escapeHtml(phrase.label)}</strong>${variants ? `<small>Also hears: ${variants}</small>` : '<small>Uses fuzzy sound matching</small>'}</span>
    ${state.license.unlocked ? `<label class="sr-only" for="pattern-${phrase.id}">Vibration for ${escapeHtml(phrase.label)}</label><select class="pattern-select" id="pattern-${phrase.id}" data-id="${phrase.id}" aria-label="Vibration for ${escapeHtml(phrase.label)}"><option value="tap" ${phrase.pattern === 'tap' ? 'selected' : ''}>Tap</option><option value="knock" ${phrase.pattern === 'knock' ? 'selected' : ''}>Knock</option><option value="urgent" ${phrase.pattern === 'urgent' ? 'selected' : ''}>Urgent</option></select>` : ''}
    <button class="mini-button" type="button" data-action="test" data-id="${phrase.id}" aria-label="Test cue for ${escapeHtml(phrase.label)}">Test</button>
    <button class="icon-button" type="button" data-action="remove" data-id="${phrase.id}" aria-label="Remove ${escapeHtml(phrase.label)}">×</button>
  </li>`;
}

function supportMarkup(): string {
  const support = localSpeechSupport();
  if (support === 'ready') return '<span class="support good"><span aria-hidden="true">✓</span> On-device captions available</span>';
  if (support === 'missing') return '<span class="support"><span aria-hidden="true">!</span> Open in current Chrome on Android for live captions</span>';
  return '<span class="support"><span aria-hidden="true">!</span> This browser may not guarantee on-device captions</span>';
}

function setupMarkup(): string {
  const limit = state.license.unlocked ? Infinity : 3;
  const atLimit = state.settings.phrases.length >= limit;
  return `<main id="main">
    <section class="hero section-width" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="live-square" aria-hidden="true"></span> Local attention cue</p>
        <h1 id="hero-title">Feel your name.<br><span>Keep your eyes up.</span></h1>
        <p class="lede">Name Tap turns on-device captions into a private vibration when your name or an urgent phrase is spoken. No recording. No account.</p>
        <a class="text-link" href="#setup">Set your attention cue <span aria-hidden="true">↓</span></a>
      </div>
      <figure class="hero-art">
        <picture>
          <source media="(max-width: 640px)" srcset="/assets/name-tap-hero-720.webp">
          <img src="/assets/name-tap-hero-1200.webp" width="1200" height="800" alt="A rugged phone receives blank speech shapes and sends out bold chartreuse vibration waves" fetchpriority="high" decoding="async">
        </picture>
        <figcaption><span>Speech nearby</span><span>Your private cue</span></figcaption>
      </figure>
    </section>

    <section class="workbench" id="setup" aria-labelledby="setup-title">
      <div class="section-width setup-grid">
        <div class="setup-main">
          <p class="step-label">01 / Set your signal</p>
          <h2 id="setup-title">What should tap you?</h2>
          <p class="section-intro">Add your name, a nickname, or an urgent phrase. Comma-separated spellings help with names that captions often mishear.</p>
          <form class="add-form" id="phrase-form">
            <label for="phrase">Phrase and spelling variants</label>
            <div class="field-action">
              <input id="phrase" name="phrase" type="text" maxlength="100" autocomplete="off" placeholder="Maya, Maia" required ${atLimit ? 'disabled' : ''} aria-describedby="phrase-help">
              <button class="square-button" type="submit" ${atLimit ? 'disabled' : ''}>Add phrase</button>
            </div>
            <small id="phrase-help">First entry is the label. Nothing leaves this device.</small>
          </form>
          ${state.settings.phrases.length ? `<ul class="phrase-list" aria-label="Attention phrases">${state.settings.phrases.map(phraseMarkup).join('')}</ul>` : `
            <div class="empty-state">
              <span class="empty-mark" aria-hidden="true">+</span>
              <p><strong>No phrases yet.</strong><br>Add the name or words you most need to notice.</p>
            </div>`}
          <div class="capacity"><span>${state.settings.phrases.length} / ${state.license.unlocked ? '∞' : '3'} phrases</span><span>${state.license.unlocked ? 'Lifetime unlocked' : 'Free, always'}</span></div>
        </div>

        <aside class="session-board" aria-labelledby="listen-title">
          <p class="step-label">02 / Start a session</p>
          <h2 id="listen-title">Ready when you are.</h2>
          <label for="language">Conversation language</label>
          <select id="language">
            ${languageOptions(state.settings.language)}
          </select>
          <div class="privacy-note">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z"/></svg>
            <p><strong>Audio is not recorded.</strong> Name Tap requests on-device recognition and refuses remote caption mode.</p>
          </div>
          <label class="consent-check">
            <input id="consent" type="checkbox" ${state.consent ? 'checked' : ''}>
            <span>I have told people nearby that live captions are on, and I follow local consent laws.</span>
          </label>
          <button class="start-button" type="button" data-action="start" ${!state.consent || !state.settings.phrases.length || state.stage === 'starting' ? 'disabled' : ''}>
            <span class="start-icon" aria-hidden="true">${state.stage === 'starting' ? '…' : '▶'}</span>
            <span><strong>${state.stage === 'starting' ? 'Preparing offline captions…' : 'Start listening'}</strong><small>${state.settings.phrases.length ? `Watching for ${state.settings.phrases.length} phrase${state.settings.phrases.length === 1 ? '' : 's'}` : 'Add a phrase first'}</small></span>
          </button>
          ${supportMarkup()}
          ${state.error ? `<div class="error-box" role="alert"><strong>Couldn’t start.</strong> ${escapeHtml(state.error)}</div>` : ''}
        </aside>
      </div>
    </section>

    <section class="how section-width" id="how" aria-labelledby="how-title">
      <p class="step-label">How it works</p>
      <h2 id="how-title">Captions you don’t have to watch.</h2>
      <ol class="how-list">
        <li><span>1</span><div><h3>You choose the words</h3><p>Add up to three free phrases, with likely spelling variants.</p></div></li>
        <li><span>2</span><div><h3>Your device listens locally</h3><p>Only during a session you start. Captions disappear when you stop.</p></div></li>
        <li><span>3</span><div><h3>A match taps your phone</h3><p>Fuzzy sound matching catches close caption spellings. Always confirm important instructions.</p></div></li>
      </ol>
    </section>

    ${settingsMarkup()}
    ${unlockMarkup()}
  </main>`;
}

function listeningMarkup(): string {
  const phraseNames = state.settings.phrases.map((phrase) => escapeHtml(phrase.label)).join(' · ');
  return `<main id="main" class="listen-main">
    <section class="live-session ${state.cueActive ? 'cue-active' : ''}" aria-labelledby="live-title">
      <div class="session-top">
        <a class="wordmark compact" href="/" aria-label="Name Tap home"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a>
        <span class="session-status"><i aria-hidden="true"></i> Listening locally</span>
      </div>
      <div class="cue-center" aria-live="assertive" aria-atomic="true">
        <div class="cue-rings" aria-hidden="true"><span></span><span></span><span></span></div>
        <p class="eyebrow">Watching for</p>
        <h1 id="live-title">${state.cueActive && state.lastMatch ? escapeHtml(state.lastMatch.label) : 'Listening…'}</h1>
        <p>${state.cueActive ? 'Phrase heard — check who needs you.' : phraseNames}</p>
      </div>
      <div class="caption-window" aria-label="Temporary live captions">
        <div class="caption-heading"><span>Live captions</span><span>Not saved</span></div>
        <div class="caption-lines" aria-live="polite">
          ${state.captions.length ? state.captions.map((line) => `<p class="${line.matchedPhrase ? 'matched' : ''}">${escapeHtml(line.text)}${line.matchedPhrase ? '<strong>HEARD</strong>' : ''}</p>`).join('') : '<p class="caption-placeholder">Waiting for speech…</p>'}
        </div>
      </div>
      ${state.error ? `<div class="error-box session-error" role="alert">${escapeHtml(state.error)}</div>` : ''}
      <button class="stop-button" type="button" data-action="stop"><span aria-hidden="true">■</span> Stop listening</button>
      <p class="session-fineprint">Recognition can miss or falsely match words. Not for emergencies.</p>
    </section>
  </main>`;
}

function settingsMarkup(): string {
  return `<section class="settings-zone" id="settings" aria-labelledby="settings-title">
    <div class="section-width settings-grid">
      <div><p class="step-label">Your controls</p><h2 id="settings-title">Pocket rules.</h2><p>Settings live on this device. Live captions never enter the settings file.</p></div>
      <div class="settings-panel">
        <label class="toggle-row"><span><strong>Vibration cue</strong><small>Uses your device vibration motor</small></span><input id="haptic-toggle" type="checkbox" role="switch" ${state.settings.hapticCue ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="toggle-row"><span><strong>Full-screen visual cue</strong><small>High-contrast phrase alert</small></span><input id="visual-toggle" type="checkbox" role="switch" ${state.settings.visualCue ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <div class="data-row"><span><strong>Own your settings</strong><small>Move phrases between devices</small></span><div><button type="button" class="mini-button" data-action="export">Export</button><label class="mini-button file-button">Import<input id="import-file" type="file" accept="application/json"></label></div></div>
      </div>
    </div>
  </section>`;
}

function unlockMarkup(): string {
  return `<section class="unlock section-width" id="unlock" aria-labelledby="unlock-title">
    <div class="unlock-stamp" aria-hidden="true">ONE<br>TIME</div>
    <div class="unlock-copy"><p class="step-label">Optional lifetime unlock</p><h2 id="unlock-title">More signals. Same privacy.</h2><p>The free version gives you three phrases forever. Pay once to add unlimited phrases and extra vibration patterns as they arrive.</p><ul><li>Unlimited phrase list</li><li>Knock and urgent vibration patterns</li><li>No subscription or account</li></ul></div>
    <div class="price-card">
      <p><span>US</span><strong>$7</strong><small>one-time purchase</small></p>
      ${state.license.unlocked ? `<div class="unlocked-badge"><span aria-hidden="true">✓</span> Lifetime unlocked</div><button class="quiet-button" type="button" data-action="remove-license">Remove from this device</button>` : `<a class="buy-button" href="${checkoutUrl}">Buy lifetime unlock <span aria-hidden="true">↗</span></a>`}
      <details><summary>Have a license? Restore it</summary><form id="license-form"><label for="license-token">License token</label><input id="license-token" name="license" type="text" autocomplete="off" required><button class="mini-button" type="submit" aria-label="Verify pasted license">Verify license</button></form></details>
      ${state.license.notice ? `<p class="license-notice" role="status">${escapeHtml(state.license.notice)}</p>` : ''}
      <small>Checkout and refunds are handled by Sociobot/Dodo. <a href="/terms">Terms</a> apply.</small>
    </div>
  </section>`;
}

function languageOptions(selected: string): string {
  const languages: Array<[string, string]> = [
    ['en-US', 'English (US)'], ['en-IN', 'English (India)'], ['en-GB', 'English (UK)'],
    ['hi-IN', 'हिन्दी'], ['bn-IN', 'বাংলা'], ['ta-IN', 'தமிழ்'], ['te-IN', 'తెలుగు'],
    ['kn-IN', 'ಕನ್ನಡ'], ['ml-IN', 'മലയാളം'], ['mr-IN', 'मराठी'], ['gu-IN', 'ગુજરાતી'],
    ['es-ES', 'Español'], ['fr-FR', 'Français'], ['de-DE', 'Deutsch']
  ];
  return languages.map(([value, label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('');
}

function headerMarkup(): string {
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Name Tap home"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a><nav aria-label="Main navigation"><a href="#how">How it works</a><a href="#settings">Settings</a><a class="unlock-link" href="#unlock">Unlock <span aria-hidden="true">↗</span></a></nav><span class="network ${state.online ? '' : 'offline'}"><i aria-hidden="true"></i>${state.online ? 'On device' : 'Offline'}</span></header>`;
}

function footerMarkup(): string {
  return `<footer class="site-footer"><div><a class="wordmark compact" href="/"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a><p>Attention support for conversations.<br>Not an emergency or recording service.</p></div><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:support@sociobot.in">Support</a></nav><p class="made-note">Original generated illustration · No analytics<br>© 2026 Sociobot · MIT licensed</p></footer>`;
}

function render(): void {
  const scrollY = window.scrollY;
  app.innerHTML = state.stage === 'listening'
    ? listeningMarkup()
    : `${headerMarkup()}${setupMarkup()}${footerMarkup()}<div class="toast ${state.notice ? 'show' : ''}" role="status" aria-live="polite"><span>${escapeHtml(state.notice)}</span>${state.removed ? '<button type="button" data-action="undo-remove">Undo</button>' : ''}${state.updateReady ? '<button type="button" data-action="apply-update">Update now</button>' : ''}</div>`;
  if (state.stage !== 'listening' && scrollY > 0) requestAnimationFrame(() => window.scrollTo(0, scrollY));
}

function bindEvents(): void {
  app.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'start') void startListening();
    if (action === 'stop') stopListening();
    if (action === 'remove') removePhrase(button.dataset.id ?? '');
    if (action === 'undo-remove') void undoRemove();
    if (action === 'test') testPhrase(button.dataset.id ?? '');
    if (action === 'export') exportSettings(state.settings);
    if (action === 'remove-license') { state.license = removeLicense(); render(); }
    if (action === 'apply-update') applyUpdate();
  });

  app.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form.id === 'phrase-form') void addPhrase(new FormData(form).get('phrase')?.toString() ?? '');
    if (form.id === 'license-form') void restoreLicense(new FormData(form).get('license')?.toString() ?? '');
  });

  app.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    if (input.id === 'consent') { state.consent = (input as HTMLInputElement).checked; render(); }
    if (input.id === 'language') void updateSetting({ language: input.value });
    if (input.id === 'haptic-toggle') void updateSetting({ hapticCue: (input as HTMLInputElement).checked });
    if (input.id === 'visual-toggle') void updateSetting({ visualCue: (input as HTMLInputElement).checked });
    if (input.classList.contains('pattern-select')) void updatePattern(input.dataset.id ?? '', input.value as HapticPattern);
    if (input.id === 'import-file') void importFile((input as HTMLInputElement).files?.[0]);
  });

  window.addEventListener('online', () => { state.online = true; render(); });
  window.addEventListener('offline', () => { state.online = false; state.notice = 'Offline is okay — installed language packs still work.'; render(); });
}

async function updateSetting(change: Partial<Settings>): Promise<void> {
  state.settings = { ...state.settings, ...change, updatedAt: Date.now() };
  await saveSettings(state.settings);
  render();
}

async function addPhrase(value: string): Promise<void> {
  const variants = value.split(',').map((item) => item.trim()).filter(Boolean);
  if (!variants.length) { state.error = 'Type a name or phrase before adding it.'; render(); return; }
  if (!state.license.unlocked && state.settings.phrases.length >= 3) { state.notice = 'The free list is full. Remove one phrase or unlock unlimited phrases.'; render(); return; }
  const duplicate = state.settings.phrases.some((phrase) => phrase.variants.some((variant) => variants.includes(variant)));
  if (duplicate) { state.notice = 'That phrase is already on your list.'; render(); return; }
  const phrase: Phrase = { id: crypto.randomUUID(), label: variants[0] ?? '', variants, pattern: 'tap', createdAt: Date.now() };
  state.settings = { ...state.settings, phrases: [...state.settings.phrases, phrase], updatedAt: Date.now() };
  state.error = '';
  state.removed = null;
  state.notice = `${phrase.label} added. Use Test to feel the cue.`;
  await saveSettings(state.settings);
  render();
  document.querySelector<HTMLInputElement>('#phrase')?.focus();
}

async function removePhrase(id: string): Promise<void> {
  const index = state.settings.phrases.findIndex((phrase) => phrase.id === id);
  const phrase = state.settings.phrases[index];
  if (!phrase) return;
  state.removed = { phrase, index };
  state.settings = { ...state.settings, phrases: state.settings.phrases.filter((item) => item.id !== id), updatedAt: Date.now() };
  state.notice = `${phrase.label} removed.`;
  await saveSettings(state.settings);
  render();
}

async function undoRemove(): Promise<void> {
  if (!state.removed) return;
  const { phrase, index } = state.removed;
  const phrases = [...state.settings.phrases];
  phrases.splice(index, 0, phrase);
  state.settings = { ...state.settings, phrases, updatedAt: Date.now() };
  state.removed = null;
  state.notice = `${phrase.label} restored.`;
  await saveSettings(state.settings);
  render();
}

async function updatePattern(id: string, pattern: HapticPattern): Promise<void> {
  if (!state.license.unlocked) return;
  state.settings = {
    ...state.settings,
    phrases: state.settings.phrases.map((phrase) => phrase.id === id ? { ...phrase, pattern } : phrase),
    updatedAt: Date.now()
  };
  await saveSettings(state.settings);
  state.notice = 'Vibration pattern updated. Use Test to feel it.';
  render();
}

function testPhrase(id: string): void {
  const phrase = state.settings.phrases.find((item) => item.id === id);
  if (!phrase) return;
  pulse(phrase);
  state.notice = `Test cue: ${phrase.label}.`;
  render();
}

async function startListening(): Promise<void> {
  if (!state.consent || !state.settings.phrases.length) return;
  state.stage = 'starting';
  state.error = '';
  render();
  captioner = new LocalCaptioner(handleCaption, (message) => {
    state.error = message;
    render();
  }, () => {
    state.stage = 'setup';
    state.error = 'The caption session ended. Press start to resume.';
    state.captions = [];
    state.consent = false;
    render();
  });
  try {
    await captioner.start(state.settings.language);
    state.stage = 'listening';
    state.captions = [];
    render();
  } catch (error) {
    state.stage = 'setup';
    state.error = error instanceof Error ? error.message : 'Could not start on-device captions.';
    render();
  }
}

function stopListening(): void {
  captioner?.stop();
  captioner = null;
  state.stage = 'setup';
  state.captions = [];
  state.lastMatch = null;
  state.consent = false;
  state.notice = 'Session stopped. Temporary captions were cleared.';
  render();
  requestAnimationFrame(() => document.querySelector<HTMLElement>('#setup')?.scrollIntoView());
}

function handleCaption(text: string, final: boolean): void {
  const match = findMatch(text, state.settings.phrases);
  const last = state.captions.at(-1);
  const line: CaptionLine = { id: crypto.randomUUID(), text, final, matchedPhrase: match };
  if (last && !last.final) state.captions.splice(-1, 1, line);
  else state.captions.push(line);
  state.captions = state.captions.slice(-6);
  if (match && Date.now() - (lastAlertAt.get(match.id) ?? 0) > 1200) {
    lastAlertAt.set(match.id, Date.now());
    pulse(match);
  }
  render();
}

function pulse(phrase: Phrase): void {
  state.lastMatch = phrase;
  state.cueActive = state.settings.visualCue;
  if (state.settings.hapticCue) {
    const patterns: Record<HapticPattern, number | number[]> = { tap: [220, 90, 320], knock: [120, 80, 120], urgent: [180, 80, 180, 80, 360] };
    const pattern = patterns[phrase.pattern];
    const values = Array.isArray(pattern) ? pattern : [pattern];
    if (captioner) void captioner.vibrate(values);
    else if ('vibrate' in navigator) navigator.vibrate(values);
  }
  window.setTimeout(() => {
    state.cueActive = false;
    if (state.stage === 'listening') render();
  }, 900);
}

async function restoreLicense(token: string): Promise<void> {
  try {
    state.license = saveLicense(token);
    render();
    state.license = await verifyLicense(state.license, true);
    render();
  } catch (error) {
    state.license.notice = error instanceof Error ? error.message : 'Could not restore this license.';
    render();
  }
}

async function importFile(file: File | undefined): Promise<void> {
  if (!file) return;
  try {
    const imported = parseSettingsFile(await file.text());
    const maximum = state.license.unlocked ? imported.phrases.length : 3;
    state.settings = { ...imported, phrases: imported.phrases.slice(0, maximum) };
    await saveSettings(state.settings);
    state.notice = `Imported ${state.settings.phrases.length} phrase${state.settings.phrases.length === 1 ? '' : 's'}.`;
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Could not read that settings file.';
  }
  render();
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const register = () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      const announceUpdate = () => {
        if (registration.waiting && navigator.serviceWorker.controller && state) {
          state.updateReady = registration;
          state.notice = 'A Name Tap update is ready.';
          render();
        }
      };
      announceUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller && state) {
            announceUpdate();
          }
        });
      });
    }).catch(() => {
      if (state) { state.notice = 'Offline install is unavailable in this browser.'; render(); }
    });
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

function applyUpdate(): void {
  const registration = state.updateReady;
  if (!registration?.waiting) return;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloaded) { reloaded = true; window.location.reload(); }
  }, { once: true });
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
}
