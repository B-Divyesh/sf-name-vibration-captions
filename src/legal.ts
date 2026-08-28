export function legalPage(path: string): string | null {
  if (path === '/privacy') return `
    <main id="main" class="legal-shell">
      <p class="eyebrow">Plain-language policy · 28 August 2026</p>
      <h1 tabindex="-1">Privacy stays on your device</h1>
      <section><h2>When the microphone is used</h2><p>Name Tap uses the microphone only after you choose Start listening and confirm consent. It stops if local captions are unavailable.</p></section>
      <section><h2>What stays on your device</h2><p>Your phrases, language, alert choices, and license token stay in this browser or app. Temporary captions disappear when you stop.</p></section>
      <section><h2>What the demo does</h2><p>The demo uses bundled sample phrases in memory. It never opens or changes your saved phrase database.</p></section>
      <section><h2>What we collect</h2><p>Name Tap has no analytics, advertising, account, or tracking scripts. The web host may keep short security logs.</p><p>Sociobot receives a license token only when you restore a prior purchase. Audio, captions, and phrases are not included.</p></section>
      <section><h2>Your control</h2><p>Export or import settings in the app. Remove phrases there, or clear this site’s storage to erase all saved data.</p></section>
      <section><h2>Contact</h2><p>Email privacy questions to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section>
    </main>`;
  if (path === '/terms') return `
    <main id="main" class="legal-shell">
      <p class="eyebrow">Terms · 28 August 2026</p>
      <h1 tabindex="-1">Use Name Tap as an alert, not a guarantee</h1>
      <section><h2>Use of the app</h2><p>Speech recognition can miss, mishear, or falsely match words. Do not rely on Name Tap for emergencies or safety-critical instructions.</p></section>
      <section><h2>Conversation consent</h2><p>You must tell people nearby that captions are active. You must also follow local privacy, workplace, and consent laws.</p></section>
      <section><h2>Saved data</h2><p>Name Tap does not save recordings or transcripts. Phrase settings stay on your device until you remove them.</p></section>
      <section><h2>Acceptable use</h2><p>Do not use Name Tap to monitor people secretly, identify speakers, create recordings, or invade another person’s privacy.</p></section>
      <section><h2>Contact</h2><p>Email support questions to <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></section>
    </main>`;
  return null;
}
