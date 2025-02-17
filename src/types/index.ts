export interface ExtractedText {
  text: string;
  confidence: number;
}
export interface TranslationEntry {
  key: string;
  value: string;
}
export interface TranslationFile {
  [key: string]: string;
}