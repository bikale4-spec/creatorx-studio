import type { LanguageCode } from './types';

export type TranslationRequest = {
  text: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export type TranslationResult = {
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export type TranslationProviderConfig = {
  onError: (error: string) => void;
};

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  isSupported(): boolean;
}

export type TranslationProviderFactory = (config: TranslationProviderConfig) => TranslationProvider;

const registeredFactories: Record<string, TranslationProviderFactory> = {};

export function registerTranslationProvider(name: string, factory: TranslationProviderFactory) {
  registeredFactories[name] = factory;
}

export function getTranslationProvider(name: string): TranslationProviderFactory | undefined {
  return registeredFactories[name];
}

export function listTranslationProviders(): string[] {
  return Object.keys(registeredFactories);
}
