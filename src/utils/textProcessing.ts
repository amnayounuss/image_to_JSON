import { ExtractedText, TranslationEntry, TranslationFile } from '../types';

export const processExtractedText = (extractedText: ExtractedText): TranslationEntry[] => {
  // Split text into lines and create translation entries
  return extractedText.text
    .split('\n')
    .filter(line => line.trim())
    .map(line => ({
      key: createTranslationKey(line),
      value: line.trim()
    }));
};

export const createTranslationKey = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
};

export const generateJsonFile = (entries: TranslationEntry[]): TranslationFile => {
  return entries.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as TranslationFile);
};

export const downloadJson = (data: TranslationFile, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};