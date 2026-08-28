import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const nativePlugin = readFileSync(resolve('android/app/src/main/java/in/sociobot/namevibrationcaptions/LocalSpeechPlugin.java'), 'utf8');
const mainActivity = readFileSync(resolve('android/app/src/main/java/in/sociobot/namevibrationcaptions/MainActivity.java'), 'utf8');

describe('Android local speech bridge', () => {
  it('registers a native bridge that uses only Android’s on-device recognizer', () => {
    expect(mainActivity).toContain('registerPlugin(LocalSpeechPlugin.class)');
    expect(nativePlugin).toContain('createOnDeviceSpeechRecognizer');
    expect(nativePlugin).toContain('EXTRA_PREFER_OFFLINE, true');
    expect(nativePlugin).toContain('restartRecognition');
    expect(nativePlugin).toContain('RECORD_AUDIO');
  });

  it('emits caption events and provides an Android-native vibration cue', () => {
    expect(nativePlugin).toContain('notifyListeners("caption"');
    expect(nativePlugin).toContain('VibrationEffect.createWaveform');
  });
});
