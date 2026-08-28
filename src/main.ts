import './style.css';
import { findMatch } from './matcher';
import { legalPage } from './legal';
import { LocalCaptioner, probeLocalSpeechSupport, type LocalSpeechSupport } from './speech';
import { defaultSettings, exportSettings, loadSettings, parseSettingsFile, saveSettings } from './store';
import type { CaptionLine, HapticPattern, Phrase, Settings } from './types';

const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) throw new Error('App root was not found.');
const app: HTMLDivElement = appElement;

const BUILD_ID = '1.2.0-polish2';
const SITE = 'https://name-vibration-captions.sociobot.in';
const knownPaths = new Set(['/', '/demo', '/privacy', '/terms', '/404']);
const demoPhrases: Phrase[] = [
  { id: 'demo-maya', label: 'Maya', variants: ['Maya', 'Maia'], pattern: 'tap', createdAt: 1 },
  { id: 'demo-help', label: 'I need help', variants: ['I need help', 'need help'], pattern: 'urgent', createdAt: 2 }
];

interface AppState {
  settings: Settings;
  stage: 'setup' | 'starting' | 'listening';
  support: LocalSpeechSupport;
  consent: boolean;
  online: boolean;
  notice: string;
  error: string;
  captions: CaptionLine[];
  lastMatch: Phrase | null;
  cueActive: boolean;
  removed: { phrase: Phrase; index: number } | null;
  updateReady: ServiceWorkerRegistration | null;
  demo: boolean;
}

let state: AppState;
let captioner: LocalCaptioner | null = null;
let routePath = window.location.pathname.replace(/\/$/, '') || '/';
let supportProbeVersion = 0;
const lastAlertAt = new Map<string, number>();

function demoRequested(): boolean {
  return routePath === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';
}

function freshDemoSettings(): Settings {
  return { ...defaultSettings, phrases: demoPhrases.map((phrase) => ({ ...phrase, variants: [...phrase.variants] })), updatedAt: 1 };
}

async function initialize(): Promise<void> {
  const demo = demoRequested();
  const loaded = demo
    ? { settings: freshDemoSettings(), recovered: false }
    : await loadSettings().catch(() => ({ settings: { ...defaultSettings, phrases: [] }, recovered: true }));
  state = {
    settings: loaded.settings,
    stage: 'setup', support: 'checking', consent: false, online: navigator.onLine,
    notice: loaded.recovered ? 'Saved settings were invalid and were reset. Add your phrases again.' : '',
    error: '', captions: [], lastMatch: null, cueActive: false, removed: null, updateReady: null, demo
  };
  render(false);
  if (routePath === '/' || routePath === '/demo') void refreshSupport(state.settings.language);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function setMeta(path: string): void {
  const data: Record<string, [string, string]> = {
    '/': ['Name Tap — alerts when your phrase is spoken', 'For hard-of-hearing people who want a private vibration when local captions match a chosen phrase.'],
    '/demo': ['Demo — Name Tap', 'Try Name Tap with isolated sample phrases and captions. Nothing is saved.'],
    '/privacy': ['Privacy — Name Tap', 'How Name Tap handles phrases, temporary captions, and web request logs.'],
    '/terms': ['Terms — Name Tap', 'Terms for using Name Tap as an assistive phrase alert.'],
    '/404': ['Page not found — Name Tap', 'This Name Tap page does not exist. Return home or try the sample.']
  };
  const key = knownPaths.has(path) ? path : '/404';
  const [title, description] = data[key] ?? data['/404']!;
  document.title = title;
  setMetaValue('meta[name="description"]', 'content', description);
  setMetaValue('link[rel="canonical"]', 'href', `${SITE}${key}`);
  setMetaValue('meta[property="og:title"]', 'content', title);
  setMetaValue('meta[property="og:description"]', 'content', description);
  setMetaValue('meta[property="og:url"]', 'content', `${SITE}${key}`);
  setMetaValue('meta[name="twitter:title"]', 'content', title);
  setMetaValue('meta[name="twitter:description"]', 'content', description);
}

function setMetaValue(selector: string, attribute: string, value: string): void {
  document.querySelector(selector)?.setAttribute(attribute, value);
}

function phraseMarkup(phrase: Phrase): string {
  const alternatives = phrase.variants.slice(1).map(escapeHtml).join(', ');
  return `<li class="phrase-row"><span class="phrase-grip" aria-hidden="true">●</span><span><strong>${escapeHtml(phrase.label)}</strong><small>${alternatives ? `Other spellings: ${alternatives}` : 'Checks similar-sounding caption text'}</small></span><button class="mini-button" type="button" data-action="test" data-id="${phrase.id}" aria-label="Test vibration for ${escapeHtml(phrase.label)}">Test vibration</button><button class="icon-button" type="button" data-action="remove" data-id="${phrase.id}" aria-label="Remove ${escapeHtml(phrase.label)}">×</button></li>`;
}

function supportMarkup(): string {
  if (state.support === 'checking') return '<span class="support" data-support="checking"><span aria-hidden="true">…</span> Checking local captions…</span>';
  if (state.support === 'ready') return '<span class="support good" data-support="ready"><span aria-hidden="true">✓</span> Local captions are available</span>';
  if (state.support === 'downloadable') return '<span class="support" data-support="downloadable"><span aria-hidden="true">↓</span> Local captions need a language download</span>';
  if (state.support === 'unavailable') return '<span class="support" data-support="unavailable"><span aria-hidden="true">!</span> Local captions are unavailable for this language</span>';
  if (state.support === 'missing') return '<span class="support" data-support="missing"><span aria-hidden="true">!</span> Use current Chrome on Android for local captions</span>';
  return '<span class="support" data-support="unknown"><span aria-hidden="true">?</span> This browser cannot confirm local captions</span>';
}

async function refreshSupport(language: string): Promise<void> {
  const version = ++supportProbeVersion;
  state.support = 'checking';
  render();
  const support = await probeLocalSpeechSupport(language);
  if (version !== supportProbeVersion || state.settings.language !== language) return;
  state.support = support;
  render();
}

function demoBanner(): string {
  if (!state.demo) return '';
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><div><button type="button" data-action="reset-demo">Reset demo</button><button type="button" data-action="start-real">Start for real</button></div></aside>`;
}

function demoSample(pageHeading = false): string {
  if (!state.demo) return '';
  const title = pageHeading
    ? '<h1 id="sample-title" tabindex="-1">Maya was heard</h1>'
    : '<h2 id="sample-title">Maya was heard</h2>';
  return `<section class="demo-sample section-width" id="sample" aria-labelledby="sample-title"><div class="sample-status"><span aria-hidden="true"></span> Sample session · local captions</div>${title}<div class="sample-caption" aria-label="Sample temporary captions"><p>Can Maia bring the blue folder?</p><strong>HEARD · MAYA</strong></div><p>The alternate spelling “Maia” matched the saved phrase “Maya.”</p><button class="start-button sample-replay" type="button" data-action="replay-demo"><span class="start-icon" aria-hidden="true">)))</span><span><strong>Replay sample alert</strong><small>Requests the vibration pattern and flashes this board.</small></span></button></section>`;
}

function setupMarkup(): string {
  const atLimit = state.settings.phrases.length >= 3;
  const firstScreen = state.demo
    ? demoSample(true)
    : '<section class="hero section-width" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="live-square" aria-hidden="true"></span> Private name alert</p><h1 id="hero-title" tabindex="-1">Feel a tap when someone says your name</h1><p class="lede">For hard-of-hearing people who want to follow group conversations without watching captions.</p><div class="hero-actions"><a class="primary-link" href="?demo=1">Try it with sample data</a><span>Loads a sample caption and name alert.</span></div><ul class="plain-facts"><li>Speech becomes local captions on your device.</li><li>No recording or account.</li><li>Three phrases are free.</li></ul></div><figure class="hero-art"><picture><source media="(max-width: 640px)" srcset="/assets/name-tap-hero-720.webp"><img src="/assets/name-tap-hero-1200.webp" width="1200" height="800" alt="A rugged phone receives speech shapes and sends out bold vibration waves" fetchpriority="high" decoding="async"></picture><figcaption><span>Speech nearby</span><span>Your private alert</span></figcaption></figure></section>';
  return `<main id="main" class="${state.demo ? 'demo-route' : ''}">${firstScreen}
    <section class="workbench" id="setup" aria-labelledby="setup-title"><div class="section-width setup-grid"><div class="setup-main"><p class="step-label">1 / Choose a phrase</p><h2 id="setup-title">Choose a name or urgent phrase</h2><p class="section-intro">Add a name, nickname, or urgent phrase. Add other spellings after commas.</p><form class="add-form" id="phrase-form"><label for="phrase">Name or phrase, with other spellings</label><div class="field-action"><input id="phrase" name="phrase" type="text" maxlength="100" autocomplete="off" placeholder="Maya, Maia" required ${atLimit ? 'disabled' : ''} aria-describedby="phrase-help"><button class="square-button" type="submit" ${atLimit ? 'disabled' : ''}>Add phrase</button></div><small id="phrase-help">The first entry becomes the label. Phrase settings stay on this device.</small></form>${state.settings.phrases.length ? `<ul class="phrase-list" aria-label="Saved phrases">${state.settings.phrases.map(phraseMarkup).join('')}</ul>` : `<div class="empty-state"><span class="empty-mark" aria-hidden="true">+</span><p><strong>No phrases yet.</strong><br>Add the phrase you most need to notice.</p></div>`}<div class="capacity"><span>${state.settings.phrases.length} / 3 phrases</span><span>Three phrases included</span></div></div>
      <aside class="session-board" aria-labelledby="listen-title"><p class="step-label">2 / Start a session</p><h2 id="listen-title">Start local listening</h2><label for="language">Conversation language</label><select id="language">${languageOptions(state.settings.language)}</select><div class="privacy-note"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z"/></svg><p><strong>Audio is not recorded.</strong> Name Tap turns speech into text on this device. It stops if local captions are unavailable.</p></div><label class="consent-check"><input id="consent" type="checkbox" ${state.consent ? 'checked' : ''}><span>I told people nearby that captions are on, and I follow local consent laws.</span></label><button class="start-button" type="button" data-action="start" ${!state.consent || !state.settings.phrases.length || state.stage === 'starting' ? 'disabled' : ''}><span class="start-icon" aria-hidden="true">${state.stage === 'starting' ? '…' : '▶'}</span><span><strong>${state.stage === 'starting' ? 'Preparing local captions…' : 'Start listening'}</strong><small>${state.settings.phrases.length ? `Watching for ${state.settings.phrases.length} phrase${state.settings.phrases.length === 1 ? '' : 's'}` : 'Add a phrase first'}</small></span></button>${supportMarkup()}${state.error ? `<div class="error-box" role="alert"><strong>Couldn’t start.</strong> ${escapeHtml(state.error)}</div>` : ''}</aside></div></section>
    <section class="how section-width" id="how" aria-labelledby="how-title"><p class="step-label">How it works</p><h2 id="how-title">Get an alert without watching captions</h2><ol class="how-list"><li><span>1</span><div><h3>Choose your phrases</h3><p>Add three phrases and the alternate spellings you know.</p></div></li><li><span>2</span><div><h3>Start local captions</h3><p>Listening starts only after you consent. Captions disappear when you stop.</p></div></li><li><span>3</span><div><h3>Feel the match</h3><p>Name Tap checks each caption against your phrases. Confirm important instructions yourself.</p></div></li></ol></section>${settingsMarkup()}<section class="limits section-width" aria-labelledby="limits-title"><p class="step-label">Clear limits</p><h2 id="limits-title">Not a recorder or emergency service</h2><p>Name Tap does not identify speakers. Speech recognition can miss or falsely match words.</p></section></main>`;
}

function listeningMarkup(): string {
  const phraseNames = state.settings.phrases.map((phrase) => escapeHtml(phrase.label)).join(' · ');
  return `${demoBanner()}<main id="main" class="listen-main"><section class="live-session ${state.cueActive ? 'cue-active' : ''}" aria-labelledby="live-title"><div class="session-top"><a class="wordmark compact" href="/" aria-label="Name Tap home"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a><span class="session-status"><i aria-hidden="true"></i> Listening locally</span></div><div class="cue-center" aria-live="assertive" aria-atomic="true"><div class="cue-rings" aria-hidden="true"><span></span><span></span><span></span></div><p class="eyebrow">Watching for</p><h1 id="live-title" tabindex="-1">${state.cueActive && state.lastMatch ? escapeHtml(state.lastMatch.label) : 'Listening…'}</h1><p>${state.cueActive ? 'Phrase heard — check who needs you.' : phraseNames}</p></div><div class="caption-window" aria-label="Temporary local captions"><div class="caption-heading"><span>Local captions</span><span>Not saved</span></div><div class="caption-lines" aria-live="polite">${state.captions.length ? state.captions.map((line) => `<p class="${line.matchedPhrase ? 'matched' : ''}">${escapeHtml(line.text)}${line.matchedPhrase ? '<strong>HEARD</strong>' : ''}</p>`).join('') : '<p class="caption-placeholder">Waiting for speech…</p>'}</div></div>${state.error ? `<div class="error-box session-error" role="alert">${escapeHtml(state.error)}</div>` : ''}<button class="stop-button" type="button" data-action="stop"><span aria-hidden="true">■</span> Stop listening</button><p class="session-fineprint">Recognition can miss words. Do not use it for emergencies.</p></section></main>`;
}

function settingsMarkup(): string {
  return `<section class="settings-zone" id="settings" aria-labelledby="settings-title"><div class="section-width settings-grid"><div><p class="step-label">Your controls</p><h2 id="settings-title">Choose your alerts</h2><p>Phrase settings stay on this device. Temporary captions never enter the settings file.</p></div><div class="settings-panel"><label class="toggle-row"><span><strong>Vibration alert</strong><small>Requests your device vibration motor</small></span><input id="haptic-toggle" type="checkbox" role="switch" ${state.settings.hapticCue ? 'checked' : ''}><i aria-hidden="true"></i></label><label class="toggle-row"><span><strong>High-contrast visual alert</strong><small>Flashes the matched phrase in black and bright green</small></span><input id="visual-toggle" type="checkbox" role="switch" ${state.settings.visualCue ? 'checked' : ''}><i aria-hidden="true"></i></label><div class="data-row"><span><strong>Move your saved phrases</strong><small>Temporary captions are excluded</small></span><div><button type="button" class="mini-button" data-action="export">Export settings</button><label class="mini-button file-button">Import settings<input id="import-file" type="file" accept="application/json"></label></div></div></div></div></section>`;
}

function languageOptions(selected: string): string {
  const languages: Array<[string, string]> = [['en-US','English (US)'],['en-IN','English (India)'],['en-GB','English (UK)'],['hi-IN','हिन्दी'],['bn-IN','বাংলা'],['ta-IN','தமிழ்'],['te-IN','తెలుగు'],['kn-IN','ಕನ್ನಡ'],['ml-IN','മലയാളം'],['mr-IN','मराठी'],['gu-IN','ગુજરાતી'],['es-ES','Español'],['fr-FR','Français'],['de-DE','Deutsch']];
  return languages.map(([value, label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('');
}

function headerMarkup(): string {
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Name Tap home"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a><nav aria-label="Main navigation"><a href="/?demo=1">Demo</a><a href="/#how">How it works</a><a href="/privacy">Privacy</a></nav><span class="network ${state.online ? '' : 'offline'}"><i aria-hidden="true"></i>${state.online ? 'Phrases stay on this device' : 'Offline'}</span></header>`;
}

function footerMarkup(): string {
  return `<footer class="site-footer"><div><a class="wordmark compact" href="/"><span class="logo-pulse" aria-hidden="true">)))</span><span>Name Tap</span></a><p>Get a private tap when someone says your chosen phrase.</p></div><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:support@sociobot.in">Support</a></nav><p class="made-note">Built by Param Factory · Build ${BUILD_ID}<br>Original generated illustration · MIT licensed</p></footer>`;
}

function notFoundMarkup(): string {
  return `<main id="main" class="not-found"><p class="eyebrow">Wrong frequency · 404</p><h1 tabindex="-1">Page not found</h1><p>This address does not point to a Name Tap page.</p><div><a class="primary-link" href="/">Back to Name Tap</a><a class="text-link" href="/?demo=1">Try sample data</a></div></main>`;
}

function render(preserveScroll = true): void {
  const scrollY = window.scrollY;
  routePath = window.location.pathname.replace(/\/$/, '') || '/';
  setMeta(demoRequested() ? '/demo' : routePath);
  const legal = legalPage(routePath);
  const isAppRoute = routePath === '/' || routePath === '/demo';
  const main = isAppRoute ? (state.stage === 'listening' ? listeningMarkup() : setupMarkup()) : (legal ?? notFoundMarkup());
  app.innerHTML = state.stage === 'listening' && isAppRoute ? main : `${demoBanner()}${headerMarkup()}${main}${footerMarkup()}<div class="toast ${state.notice ? 'show' : ''}" role="status" aria-live="polite"><span>${escapeHtml(state.notice)}</span>${state.removed ? '<button type="button" data-action="undo-remove">Undo</button>' : ''}${state.updateReady ? '<button type="button" data-action="apply-update">Update now</button>' : ''}</div><div class="sr-only" id="route-status" aria-live="polite" aria-atomic="true"></div>`;
  if (preserveScroll && state.stage !== 'listening' && scrollY > 0) requestAnimationFrame(() => window.scrollTo(0, scrollY));
}

function navigate(url: URL, replace = false): void {
  captioner?.stop(); captioner = null;
  if (replace) history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`); else history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  routePath = url.pathname.replace(/\/$/, '') || '/';
  app.innerHTML = '<main id="main" class="route-loading" aria-busy="true"><p>Loading page…</p></main>';
  void initialize().then(() => {
    if (url.hash) document.querySelector<HTMLElement>(url.hash)?.scrollIntoView(); else window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>('h1'); heading?.focus();
    const status = document.querySelector<HTMLElement>('#route-status'); if (status && heading) status.textContent = `${heading.textContent ?? ''} page loaded`;
  });
}

function bindEvents(): void {
  app.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (anchor && !event.defaultPrevented && !anchor.hasAttribute('download') && anchor.origin === window.location.origin) { const url = new URL(anchor.href); if (url.pathname !== window.location.pathname || url.search !== window.location.search) { event.preventDefault(); navigate(url); return; } }
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]'); if (!button) return;
    const action = button.dataset.action;
    if (action === 'start') void startListening(); if (action === 'stop') stopListening(); if (action === 'remove') void removePhrase(button.dataset.id ?? ''); if (action === 'undo-remove') void undoRemove(); if (action === 'test') testPhrase(button.dataset.id ?? ''); if (action === 'replay-demo') replayDemo(); if (action === 'reset-demo') void initialize(); if (action === 'start-real') navigate(new URL('/', window.location.origin)); if (action === 'export') exportSettings(state.settings); if (action === 'apply-update') applyUpdate();
  });
  app.addEventListener('submit', (event) => { event.preventDefault(); const form = event.target as HTMLFormElement; if (form.id === 'phrase-form') void addPhrase(new FormData(form).get('phrase')?.toString() ?? ''); });
  app.addEventListener('change', (event) => { const input = event.target as HTMLInputElement | HTMLSelectElement; if (input.id === 'consent') { state.consent = (input as HTMLInputElement).checked; render(); } if (input.id === 'language') void changeLanguage(input.value); if (input.id === 'haptic-toggle') void updateSetting({ hapticCue: (input as HTMLInputElement).checked }); if (input.id === 'visual-toggle') void updateSetting({ visualCue: (input as HTMLInputElement).checked }); if (input.id === 'import-file') void importFile((input as HTMLInputElement).files?.[0]); });
  window.addEventListener('popstate', () => { routePath = window.location.pathname.replace(/\/$/, '') || '/'; void initialize().then(focusRouteHeading); });
  window.addEventListener('online', () => { state.online = true; render(); }); window.addEventListener('offline', () => { state.online = false; state.notice = 'The app is offline. Saved phrases and the sample still work.'; render(); });
}

function focusRouteHeading(): void { const heading = document.querySelector<HTMLElement>('h1'); heading?.focus(); const status = document.querySelector<HTMLElement>('#route-status'); if (status && heading) status.textContent = `${heading.textContent ?? ''} page loaded`; }
async function persist(): Promise<void> { if (!state.demo) await saveSettings(state.settings); }
async function updateSetting(change: Partial<Settings>): Promise<void> { state.settings = { ...state.settings, ...change, updatedAt: Date.now() }; await persist(); render(); }
async function changeLanguage(language: string): Promise<void> { await updateSetting({ language }); void refreshSupport(language); }

async function addPhrase(value: string): Promise<void> {
  const variants = value.split(',').map((item) => item.trim()).filter(Boolean);
  if (!variants.length) { state.error = 'Type a name or phrase before adding it.'; render(); return; }
  if (state.settings.phrases.length >= 3) { state.notice = 'The phrase list is full. Remove one phrase before adding another.'; render(); return; }
  const duplicate = state.settings.phrases.some((phrase) => phrase.variants.some((variant) => variants.includes(variant))); if (duplicate) { state.notice = 'That phrase is already on your list.'; render(); return; }
  const phrase: Phrase = { id: crypto.randomUUID(), label: variants[0] ?? '', variants, pattern: 'tap', createdAt: Date.now() };
  state.settings = { ...state.settings, phrases: [...state.settings.phrases, phrase], updatedAt: Date.now() }; state.error = ''; state.removed = null; state.notice = `${phrase.label} added. Use Test vibration to check the alert.`; await persist(); render(); document.querySelector<HTMLInputElement>('#phrase')?.focus();
}

async function removePhrase(id: string): Promise<void> { const index = state.settings.phrases.findIndex((phrase) => phrase.id === id); const phrase = state.settings.phrases[index]; if (!phrase) return; state.removed = { phrase, index }; state.settings = { ...state.settings, phrases: state.settings.phrases.filter((item) => item.id !== id), updatedAt: Date.now() }; state.notice = `${phrase.label} removed.`; await persist(); render(); }
async function undoRemove(): Promise<void> { if (!state.removed) return; const { phrase, index } = state.removed; const phrases = [...state.settings.phrases]; phrases.splice(index, 0, phrase); state.settings = { ...state.settings, phrases, updatedAt: Date.now() }; state.removed = null; state.notice = `${phrase.label} restored.`; await persist(); render(); }
function testPhrase(id: string): void { const phrase = state.settings.phrases.find((item) => item.id === id); if (!phrase) return; pulse(phrase); state.notice = `Test vibration: ${phrase.label}.`; render(); }
function replayDemo(): void { const phrase = state.settings.phrases[0]; if (!phrase) return; pulse(phrase); state.notice = 'Sample alert replayed for Maya.'; render(); document.querySelector('.demo-sample')?.classList.add('cue-active'); }

async function startListening(): Promise<void> {
  if (!state.consent || !state.settings.phrases.length) return;
  if (state.demo) { state.stage = 'listening'; state.captions = [{ id: 'demo-1', text: 'Could Maia bring the blue folder?', final: true, matchedPhrase: state.settings.phrases[0] }]; state.lastMatch = state.settings.phrases[0] ?? null; state.cueActive = true; if (state.lastMatch) pulse(state.lastMatch); render(); return; }
  state.stage = 'starting'; state.error = ''; render(); captioner = new LocalCaptioner(handleCaption, (message) => { state.error = message; render(); }, () => { state.stage = 'setup'; state.error = 'The caption session ended. Press Start listening to resume.'; state.captions = []; state.consent = false; render(); });
  try { await captioner.start(state.settings.language); state.stage = 'listening'; state.captions = []; render(); } catch (error) { state.stage = 'setup'; state.error = error instanceof Error ? error.message : 'Could not start local captions.'; render(); }
}

function stopListening(): void { captioner?.stop(); captioner = null; state.stage = 'setup'; state.captions = []; state.lastMatch = null; state.consent = false; state.notice = 'Session stopped. Temporary captions were cleared.'; render(); requestAnimationFrame(() => document.querySelector<HTMLElement>('#setup')?.scrollIntoView()); }
function handleCaption(text: string, final: boolean): void { const match = findMatch(text, state.settings.phrases); const last = state.captions.at(-1); const line: CaptionLine = { id: crypto.randomUUID(), text, final, matchedPhrase: match }; if (last && !last.final) state.captions.splice(-1, 1, line); else state.captions.push(line); state.captions = state.captions.slice(-6); if (match && Date.now() - (lastAlertAt.get(match.id) ?? 0) > 1200) { lastAlertAt.set(match.id, Date.now()); pulse(match); } render(); }
function pulse(phrase: Phrase): void { state.lastMatch = phrase; state.cueActive = state.settings.visualCue; if (state.settings.hapticCue) { const patterns: Record<HapticPattern, number[]> = { tap: [220,90,320], knock: [120,80,120], urgent: [180,80,180,80,360] }; if (captioner) void captioner.vibrate(patterns[phrase.pattern]); else navigator.vibrate?.(patterns[phrase.pattern]); } window.setTimeout(() => { state.cueActive = false; if (state.stage === 'listening') render(); }, 900); }
async function importFile(file: File | undefined): Promise<void> { if (!file) return; try { const imported = parseSettingsFile(await file.text()); state.settings = { ...imported, phrases: imported.phrases.slice(0, 3) }; await persist(); state.notice = `Imported ${state.settings.phrases.length} phrase${state.settings.phrases.length === 1 ? '' : 's'}.`; state.error = ''; } catch (error) { state.error = error instanceof Error ? error.message : 'Could not read that settings file.'; } render(); }

function registerServiceWorker(): void { if (!('serviceWorker' in navigator)) return; const register = () => { void navigator.serviceWorker.register('/sw.js').then((registration) => { const announce = () => { if (registration.waiting && navigator.serviceWorker.controller) { state.updateReady = registration; state.notice = 'A Name Tap update is ready.'; render(); } }; announce(); registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', announce)); }).catch(() => { state.notice = 'Offline install is unavailable in this browser.'; render(); }); }; if (document.readyState === 'complete') register(); else window.addEventListener('load', register, { once: true }); }
function applyUpdate(): void { const registration = state.updateReady; if (!registration?.waiting) return; let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; window.location.reload(); } }, { once: true }); registration.waiting.postMessage({ type: 'SKIP_WAITING' }); }

bindEvents();
void initialize();
registerServiceWorker();
