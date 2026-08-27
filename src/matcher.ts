import type { Phrase } from './types';

const soundGroups: Array<[RegExp, string]> = [
  [/[bfpv]/g, '1'],
  [/[cgjkqsxz]/g, '2'],
  [/[dt]/g, '3'],
  [/[l]/g, '4'],
  [/[mn]/g, '5'],
  [/[r]/g, '6']
];

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function phonetic(value: string): string {
  const clean = normalize(value).replace(/[^a-z]/g, '');
  if (!clean) return normalize(value).replace(/\s/g, '');
  const first = clean[0] ?? '';
  let rest = clean.slice(1);
  for (const [pattern, digit] of soundGroups) rest = rest.replace(pattern, digit);
  return (first + rest.replace(/[aeiouyhw]/g, '').replace(/(.)\1+/g, '$1')).slice(0, 6);
}

export function editDistance(a: string, b: string): number {
  const left = Array.from(a);
  const right = Array.from(b);
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (current[j - 1] ?? 0) + 1,
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost
      );
    }
    previous = current;
  }
  return previous[right.length] ?? left.length;
}

function variantMatches(transcript: string, variant: string): boolean {
  const wanted = normalize(variant);
  if (!wanted) return false;
  const heard = normalize(transcript);
  if (` ${heard} `.includes(` ${wanted} `)) return true;

  const wantedWords = wanted.split(' ');
  const heardWords = heard.split(' ');
  const windowSize = wantedWords.length;
  for (let index = 0; index <= heardWords.length - windowSize; index += 1) {
    const candidate = heardWords.slice(index, index + windowSize).join(' ');
    const maxDistance = wanted.length >= 8 ? 2 : wanted.length >= 5 ? 1 : 0;
    if (editDistance(candidate, wanted) <= maxDistance) return true;
    if (windowSize === 1 && wanted.length >= 4 && candidate.length >= 4 && phonetic(candidate) === phonetic(wanted)) return true;
  }
  return false;
}

export function findMatch(transcript: string, phrases: Phrase[]): Phrase | undefined {
  return phrases.find((phrase) => phrase.variants.some((variant) => variantMatches(transcript, variant)));
}
