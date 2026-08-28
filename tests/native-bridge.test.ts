import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const nativePlugin = readFileSync(resolve('android/app/src/main/java/in/sociobot/namevibrationcaptions/LocalSpeechPlugin.java'), 'utf8');
const mainActivity = readFileSync(resolve('android/app/src/main/java/in/sociobot/namevibrationcaptions/MainActivity.java'), 'utf8');

describe('Android local speech bridge', () => {
  it('@claim:native-caption-bridge registers a bridge that uses only Android’s on-device recognizer', () => {
    expect(mainActivity).toContain('registerPlugin(LocalSpeechPlugin.class)');
    expect(nativePlugin).toContain('createOnDeviceSpeechRecognizer');
    expect(nativePlugin).toContain('EXTRA_PREFER_OFFLINE, true');
    expect(nativePlugin).toContain('restartRecognition');
    expect(nativePlugin).toContain('RECORD_AUDIO');
  });

  it('@claim:android-package includes caption events, native vibration, permissions, and the expected application ID', () => {
    expect(nativePlugin).toContain('notifyListeners("caption"');
    expect(nativePlugin).toContain('VibrationEffect.createWaveform');
    const build = readFileSync(resolve('android/app/build.gradle'), 'utf8');
    const manifest = readFileSync(resolve('android/app/src/main/AndroidManifest.xml'), 'utf8');
    expect(build).toContain('applicationId "in.sociobot.namevibrationcaptions"');
    expect(manifest).toContain('android.permission.RECORD_AUDIO');
    expect(manifest).toContain('android.permission.VIBRATE');
  });
});
