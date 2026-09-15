export type LanguageCode =
  | 'en' | 'fa' | 'ar' | 'tr' | 'de' | 'fr' | 'es' | 'it'
  | 'pt' | 'ru' | 'ja' | 'ko' | 'zh';

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  rtl: boolean;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', rtl: false },
  { code: 'fa', label: 'Persian', nativeLabel: 'فارسی', rtl: true },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', rtl: true },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', rtl: false },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', rtl: false },
  { code: 'fr', label: 'French', nativeLabel: 'Français', rtl: false },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', rtl: false },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', rtl: false },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', rtl: false },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', rtl: false },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', rtl: false },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', rtl: false },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', rtl: false },
];

export function languageLabel(code: LanguageCode): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === code)?.label ?? code;
}

export function languageNativeLabel(code: LanguageCode): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === code)?.nativeLabel ?? code;
}

export function isRtl(code: LanguageCode): boolean {
  return LANGUAGE_OPTIONS.find((option) => option.code === code)?.rtl ?? false;
}

export type RecognitionState =
  | 'idle'
  | 'requesting-permission'
  | 'starting'
  | 'listening'
  | 'processing'
  | 'paused'
  | 'stopped'
  | 'error'
  | 'unsupported';

export type MicPermissionState = 'unknown' | 'granted' | 'denied' | 'unavailable';

export type RecognitionSegment = {
  id: string;
  text: string;
  translatedText?: string;
  language: LanguageCode;
  timestamp: number;
  isFinal: boolean;
};

export type SubtitleSettings = {
  enabled: boolean;
  speechLanguage: LanguageCode;
  subtitleLanguage: LanguageCode;
  translationEnabled: boolean;
  autoPunctuation: boolean;
  fontSize: number;
  fontFamily: string;
  position: 'bottom-center' | 'bottom-left' | 'top-center';
  alignment: 'center' | 'left' | 'right';
  backgroundOpacity: number;
  maxLines: number;
  animation: 'fade' | 'slide' | 'none';
  outline: 'none' | 'shadow' | 'outline';
  delayMs: number;
};

export const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
  enabled: true,
  speechLanguage: 'fa',
  subtitleLanguage: 'en',
  translationEnabled: true,
  autoPunctuation: true,
  fontSize: 24,
  fontFamily: 'Inter, sans-serif',
  position: 'bottom-center',
  alignment: 'center',
  backgroundOpacity: 70,
  maxLines: 2,
  animation: 'fade',
  outline: 'shadow',
  delayMs: 0,
};
