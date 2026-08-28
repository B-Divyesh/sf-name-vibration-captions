# Name Tap sample demo

Open <https://name-vibration-captions.sociobot.in/?demo=1> or `/demo`.

The first demo screen contains two bundled phrases: “Maya” with “Maia,” and “I need help.” A sample caption already shows the Maia → Maya match. **Replay sample alert** requests the tap vibration and flashes the sample board.

Demo changes live only in JavaScript memory. Demo mode never opens the real `name-tap` IndexedDB database, reads the real license keys, or writes a `demo:` key. **Reset demo** creates the original sample again. **Start for real** discards the sample and loads the normal `name-tap` storage namespace.

The service worker caches `/`, `/demo/`, and all sample assets. After one online visit, the same sample opens offline.
