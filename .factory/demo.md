# Name Tap sample demo

Open <https://name-vibration-captions.sociobot.in/?demo=1> or `/demo`.

The first demo screen opens on the matched-caption board. It contains two bundled phrases: “Maya” with “Maia,” and “I need help.” A sample caption already shows the Maia → Maya match. **Replay sample alert** requests the vibration pattern and flashes the sample board.

Demo changes live only in JavaScript memory. Demo mode never opens the real `name-tap` IndexedDB database or writes a `demo:` key. **Reset demo** creates the original sample again. **Start for real** discards the sample and loads the normal `name-tap` storage namespace.

The service worker caches `/`, `/demo/`, and all sample assets. After one online visit, the same sample opens offline.
