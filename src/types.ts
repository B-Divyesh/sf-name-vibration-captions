export type HapticPattern = 'tap' | 'knock' | 'urgent';

export interface Phrase {
  id: string;
  label: string;
  variants: string[];
  pattern: HapticPattern;
  createdAt: number;
}

export interface Settings {
  phrases: Phrase[];
  language: string;
  visualCue: boolean;
  hapticCue: boolean;
  updatedAt: number;
}

export interface CaptionLine {
  id: string;
  text: string;
  final: boolean;
  matchedPhrase?: Phrase;
}
