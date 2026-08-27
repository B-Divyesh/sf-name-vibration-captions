export function legalPage(path: string): string | null {
  if (path === '/privacy') return `
    <main id="main" class="legal-shell">
      <a class="back-link" href="/">← Back to Name Tap</a>
      <p class="eyebrow">Plain-language policy · 27 August 2026</p>
      <h1>Privacy stays in your pocket.</h1>
      <section><h2>What Name Tap handles</h2><p>Your microphone is used only after you press “Start listening” and confirm that people nearby know captions are on. Name Tap requests on-device speech recognition and refuses to fall back to a remote speech service.</p></section>
      <section><h2>What stays on your device</h2><p>Your phrases, spelling variants, language, cue preferences, and license token are stored locally in your browser or app. Live caption text is held only for the current session and disappears when you stop or close the app.</p></section>
      <section><h2>What we collect</h2><p>Name Tap has no analytics, advertising, account, or tracking scripts. The web host may retain short-lived security logs such as an IP address and request time. Sociobot receives a license token when the app verifies a purchase. Audio, captions, and phrases are never sent to Sociobot.</p></section>
      <section><h2>Your control</h2><p>Export or import settings from the app. Remove phrases individually or clear this site’s storage to erase all local data. Browser microphone permission can be revoked in site settings.</p></section>
      <section><h2>Payments</h2><p>Sociobot/Dodo is the merchant of record and handles payment details on its hosted checkout. Name Tap never sees or stores card information.</p></section>
      <section><h2>Contact</h2><p>Privacy questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section>
    </main>${legalFooter()}`;
  if (path === '/terms') return `
    <main id="main" class="legal-shell">
      <a class="back-link" href="/">← Back to Name Tap</a>
      <p class="eyebrow">Terms · 27 August 2026</p>
      <h1>A cue, not a guarantee.</h1>
      <section><h2>Use of the service</h2><p>Name Tap is an assistive attention cue. Speech recognition can miss, mishear, or falsely match words. Do not rely on it for emergencies, safety-critical instructions, medical decisions, or dispatch.</p></section>
      <section><h2>Conversation consent</h2><p>You are responsible for telling people nearby that live captions are active and for following local recording, workplace, and consent laws. Name Tap does not save recordings or transcripts.</p></section>
      <section><h2>Lifetime unlock</h2><p>The US$7 one-time purchase unlocks unlimited phrases and extra vibration patterns for this product version. Core detection, three phrases, export, and safety information remain free. Sociobot/Dodo is the merchant of record. Refunds are handled through the receipt provider; a refund revokes the license.</p></section>
      <section><h2>Availability</h2><p>On-device recognition depends on a compatible Android browser and an installed language pack. The software is provided “as is” without a promise of perfect recognition or uninterrupted availability.</p></section>
      <section><h2>Acceptable use</h2><p>Do not use Name Tap to secretly monitor people, identify speakers, create recordings, or violate another person’s privacy.</p></section>
      <section><h2>Contact</h2><p>Questions can be sent to <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></section>
    </main>${legalFooter()}`;
  return null;
}

function legalFooter(): string {
  return '<footer class="site-footer"><span>Name Tap by Sociobot</span><span>Built for attention, not surveillance.</span></footer>';
}
