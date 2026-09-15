import type { LanguageCode, RecognitionSegment } from './types';

export type SpeechRecognitionConfig = {
  language: LanguageCode;
  onSegment: (segment: RecognitionSegment) => void;
  onError: (error: string) => void;
  onStateChange: (state: 'listening' | 'processing' | 'paused' | 'error' | 'unsupported') => void;
};

export interface SpeechRecognitionProvider {
  start(): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
  isSupported(): boolean;
}

export type SpeechRecognitionProviderFactory = (config: SpeechRecognitionConfig) => SpeechRecognitionProvider;

const registeredFactories: Record<string, SpeechRecognitionProviderFactory> = {};

export function registerSpeechProvider(name: string, factory: SpeechRecognitionProviderFactory) {
  registeredFactories[name] = factory;
}

export function getSpeechProvider(name: string): SpeechRecognitionProviderFactory | undefined {
  return registeredFactories[name];
}

export function listSpeechProviders(): string[] {
  return Object.keys(registeredFactories);
}
