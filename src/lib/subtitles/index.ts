import { createWebSpeechProvider } from './WebSpeechProvider';
import { registerSpeechProvider } from './SpeechRecognitionProvider';
import { registerTranslationProvider } from './TranslationProvider';
import type { TranslationProviderConfig, TranslationProvider, TranslationRequest, TranslationResult } from './TranslationProvider';

registerSpeechProvider('web-speech', createWebSpeechProvider);

const mockTranslationFactory = (_config: TranslationProviderConfig): TranslationProvider => ({
  isSupported: () => true,
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    return {
      translatedText: `[${request.targetLanguage}] ${request.text}`,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
    };
  },
});

registerTranslationProvider('mock', mockTranslationFactory);

export { LANGUAGE_OPTIONS, DEFAULT_SUBTITLE_SETTINGS } from './types';
export type {
  LanguageCode, LanguageOption, RecognitionSegment, RecognitionState, SubtitleSettings,
} from './types';
export type { SpeechRecognitionProvider, SpeechRecognitionConfig } from './SpeechRecognitionProvider';
export type { TranslationProvider, TranslationRequest, TranslationResult } from './TranslationProvider';
export {
  registerSpeechProvider, getSpeechProvider, listSpeechProviders,
} from './SpeechRecognitionProvider';
export {
  registerTranslationProvider, getTranslationProvider, listTranslationProviders,
} from './TranslationProvider';
