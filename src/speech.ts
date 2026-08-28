import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';

interface RecognitionAlternativeLike { transcript: string; confidence: number }
interface RecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: RecognitionAlternativeLike;
}
interface RecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: { readonly length: number; [index: number]: RecognitionResultLike };
}
interface RecognitionErrorLike extends Event { error: string; message?: string }
interface RecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  processLocally?: boolean;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: RecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface RecognitionConstructor {
  new (): RecognitionLike;
  available?: (options: { langs: string[]; processLocally: boolean }) => Promise<string>;
  install?: (options: { langs: string[] }) => Promise<boolean>;
}

type CaptionCallback = (text: string, final: boolean) => void;

interface NativeSpeechStatus { available: boolean; reason?: string }
interface NativeCaption { text: string; final: boolean }
interface NativeSpeechError { message: string }
interface NativeSpeechPlugin {
  getStatus(): Promise<NativeSpeechStatus>;
  start(options: { language: string }): Promise<void>;
  stop(): Promise<void>;
  vibrate(options: { pattern: number[] }): Promise<void>;
  addListener(eventName: 'caption', listenerFunc: (event: NativeCaption) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'error', listenerFunc: (event: NativeSpeechError) => void): Promise<PluginListenerHandle>;
}

const NativeSpeech = registerPlugin<NativeSpeechPlugin>('LocalSpeech');

function usesNativeAndroidBridge(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

function constructor(): RecognitionConstructor | undefined {
  const speechWindow = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

export function localSpeechSupport(): 'ready' | 'missing' | 'unknown' {
  if (usesNativeAndroidBridge()) return 'ready';
  const Speech = constructor();
  if (!Speech) return 'missing';
  const probe = new Speech();
  return 'processLocally' in probe ? 'ready' : 'unknown';
}

const errorMessages: Record<string, string> = {
  'not-allowed': 'Microphone access was blocked. Allow it in site settings, then try again.',
  'audio-capture': 'No microphone was found. Connect one, then try again.',
  'language-not-supported': 'This offline language pack is not installed yet.',
  'network': 'The browser could not start local recognition. Check that the offline language pack is installed.',
  'no-speech': 'No speech heard yet. Name Tap is still listening.'
};

export class LocalCaptioner {
  private recognition: RecognitionLike | null = null;
  private nativeListeners: PluginListenerHandle[] = [];
  private native = false;
  private intentionalStop = false;

  constructor(
    private readonly onCaption: CaptionCallback,
    private readonly onError: (message: string) => void,
    private readonly onEndedUnexpectedly: () => void
  ) {}

  async start(language: string): Promise<void> {
    if (usesNativeAndroidBridge()) {
      const status = await NativeSpeech.getStatus();
      if (!status.available) throw new Error(status.reason ?? 'On-device captions are unavailable on this Android device.');
      this.native = true;
      this.intentionalStop = false;
      this.nativeListeners = [
        await NativeSpeech.addListener('caption', ({ text, final }) => {
          if (text.trim()) this.onCaption(text.trim(), final);
        }),
        await NativeSpeech.addListener('error', ({ message }) => {
          if (!this.intentionalStop) this.onError(message);
        })
      ];
      try {
        await NativeSpeech.start({ language });
      } catch (error) {
        this.removeNativeListeners();
        this.native = false;
        throw error;
      }
      return;
    }
    const Speech = constructor();
    if (!Speech) throw new Error('Live captions are not available in this browser. Use current Chrome on Android.');
    const recognition = new Speech();
    if (!('processLocally' in recognition)) {
      throw new Error('This browser cannot guarantee on-device captions, so Name Tap will not send audio. Use a Chrome version with on-device speech recognition.');
    }

    if (Speech.available) {
      const availability = await Speech.available({ langs: [language], processLocally: true });
      if (availability === 'downloadable' && Speech.install) {
        const installed = await Speech.install({ langs: [language] });
        if (!installed) throw new Error('The offline language pack was not installed. Free some storage and try again.');
      } else if (availability === 'unavailable') {
        throw new Error('On-device captions are not available for this language on this device.');
      }
    }

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.processLocally = true;
    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result?.[0]?.transcript.trim();
        if (text) this.onCaption(text, Boolean(result?.isFinal));
      }
    };
    recognition.onerror = (event) => {
      if (event.error !== 'aborted') this.onError(errorMessages[event.error] ?? `Captions stopped (${event.error}). Try again.`);
    };
    recognition.onend = () => {
      if (!this.intentionalStop) this.onEndedUnexpectedly();
    };
    this.intentionalStop = false;
    this.recognition = recognition;
    recognition.start();
  }

  stop(): void {
    this.intentionalStop = true;
    if (this.native) {
      void NativeSpeech.stop();
      this.removeNativeListeners();
      this.native = false;
      return;
    }
    this.recognition?.stop();
    this.recognition = null;
  }

  async vibrate(pattern: number[]): Promise<void> {
    if (usesNativeAndroidBridge()) {
      try { await NativeSpeech.vibrate({ pattern }); } catch { /* A visual cue still works if hardware haptics fail. */ }
      return;
    }
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }

  private removeNativeListeners(): void {
    for (const listener of this.nativeListeners) void listener.remove();
    this.nativeListeners = [];
  }
}
