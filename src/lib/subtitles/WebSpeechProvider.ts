import type { LanguageCode, RecognitionSegment } from './types';
import type { SpeechRecognitionConfig, SpeechRecognitionProvider } from './SpeechRecognitionProvider';

const LANGUAGE_MAP: Record<LanguageCode, string> = {
  en: 'en-US', fa: 'fa-IR', ar: 'ar-SA', tr: 'tr-TR', de: 'de-DE',
  fr: 'fr-FR', es: 'es-ES', it: 'it-IT', pt: 'pt-BR', ru: 'ru-RU',
  ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN',
};

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
  length: number;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResult };
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const target = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return target.SpeechRecognition ?? target.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionConstructor() !== null;
}

export function createWebSpeechProvider(config: SpeechRecognitionConfig): SpeechRecognitionProvider {
  const Constructor = getRecognitionConstructor();
  let recognition: SpeechRecognitionLike | null = null;
  let stopped = false;
  let paused = false;
  let restartTimeout: ReturnType<typeof setTimeout> | null = null;

  function clearRestartTimeout() {
    if (restartTimeout) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }
  }

  return {
    isSupported() {
      return Constructor !== null;
    },

    async start() {
      if (!Constructor) {
        config.onStateChange('unsupported');
        config.onError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
        return;
      }

      recognition = new Constructor();
      recognition.lang = LANGUAGE_MAP[config.language] ?? 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (!paused) {
          config.onStateChange('listening');
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (paused) return;
        for (let index = event.resultIndex; index < event.results.length; index++) {
          const result = event.results[index];
          const transcript = result[0]?.transcript ?? '';
          if (!transcript) continue;

          config.onStateChange('processing');

          const segment: RecognitionSegment = {
            id: `${Date.now()}-${index}`,
            text: transcript.trim(),
            language: config.language,
            timestamp: Date.now(),
            isFinal: result.isFinal,
          };
          config.onSegment(segment);

          if (result.isFinal) {
            config.onStateChange('listening');
          }
        }
      };

      recognition.onerror = (event: { error: string }) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          stopped = true;
          config.onError('Microphone access was blocked by the browser. Allow microphone permission and try again.');
          config.onStateChange('error');
          return;
        }

        if (event.error === 'audio-capture') {
          stopped = true;
          config.onError('No microphone was found. Connect a microphone and try again.');
          config.onStateChange('error');
          return;
        }

        if (event.error === 'network') {
          config.onError('Network error during speech recognition. The browser may not have a connection to the speech service.');
          return;
        }

        config.onError(`Recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        if (stopped || paused) return;
        clearRestartTimeout();
        restartTimeout = setTimeout(() => {
          if (!stopped && !paused && recognition) {
            try {
              recognition.start();
            } catch {
              // already started — ignore
            }
          }
        }, 100);
      };

      stopped = false;
      paused = false;
      try {
        recognition.start();
      } catch (error) {
        const message = (error as Error).message;
        if (message.includes('already started')) return;
        config.onError(`Failed to start recognition: ${message}`);
        config.onStateChange('error');
      }
    },

    pause() {
      paused = true;
      clearRestartTimeout();
      if (recognition) {
        try { recognition.stop(); } catch { /* noop */ }
      }
      config.onStateChange('paused');
    },

    resume() {
      if (!recognition || stopped) return;
      paused = false;
      try {
        recognition.start();
        config.onStateChange('listening');
      } catch {
        try {
          recognition.abort();
          recognition = null;
          void this.start();
        } catch { /* noop */ }
      }
    },

    stop() {
      stopped = true;
      paused = false;
      clearRestartTimeout();
      if (recognition) {
        try { recognition.abort(); } catch { /* noop */ }
        recognition = null;
      }
      config.onStateChange('stopped');
    },
  };
}
