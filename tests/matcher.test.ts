import { describe, expect, it } from 'vitest';
import { editDistance, findMatch, normalize, phonetic } from '../src/matcher';
import type { Phrase } from '../src/types';

const maya: Phrase = { id: '1', label: 'Maya', variants: ['Maya', 'Maia'], pattern: 'tap', createdAt: 1 };
const needHelp: Phrase = { id: '2', label: 'I need help', variants: ['I need help'], pattern: 'urgent', createdAt: 2 };

describe('phrase matching', () => {
  it('normalizes accents, punctuation, and spacing', () => expect(normalize('  HÉLLO,   Maya! ')).toBe('hello maya'));
  it('finds a whole phrase inside captions', () => expect(findMatch('Could Maya come here?', [maya])?.id).toBe('1'));
  it('matches an explicit spelling variant', () => expect(findMatch('Hey Maia', [maya])?.id).toBe('1'));
  it('accepts one likely caption typo in a longer word', () => expect(findMatch('Meya are you there', [maya])?.id).toBe('1'));
  it('does not match short, unrelated fragments', () => expect(findMatch('May I come in', [maya])).toBeUndefined());
  it('matches multi-word urgent phrases', () => expect(findMatch('Sorry, I need help now', [needHelp])?.id).toBe('2'));
  it('produces stable phonetic keys', () => expect(phonetic('Steven')).toBe(phonetic('Stephen')));
  it('computes edit distance', () => expect(editDistance('maya', 'meya')).toBe(1));
});
