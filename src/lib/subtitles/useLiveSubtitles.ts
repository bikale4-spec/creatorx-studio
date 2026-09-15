import { useCallback, useEffect, useRef, useState } from 'react';
import { getSpeechProvider, getTranslationProvider, listSpeechProviders, listTranslationProviders } from './index';
import { requestMicrophoneAccess, checkMicPermission } from './microphone';
import { isSpeechRecognitionSupported } from './WebSpeechProvider';
import type { MicPermissionState, RecognitionSegment, RecognitionState, SubtitleSettings } from './types';
import type { SpeechRecognitionProvider } from './SpeechRecognitionProvider';
import type { TranslationProvider } from './TranslationProvider';

type Options = {
  settings: SubtitleSettings;
};

export function useLiveSubtitles({ settings }: Options) {
  const [state, setState] = useState<RecognitionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<RecognitionSegment[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [micPermission, setMicPermission] = useState<MicPermissionState>('unknown');
  const [micTestResult, setMicTestResult] = useState<string | null>(null);
  const [micTestSuccess, setMicTestSuccess] = useState<boolean | null>(null);

  const recognitionRef = useRef<SpeechRecognitionProvider | null>(null);
  const translationRef = useRef<TranslationProvider | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const speechProviderName = listSpeechProviders()[0] ?? null;
  const translationProviderName = listTranslationProviders()[0] ?? null;
  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    void (async () => {
      const perm = await checkMicPermission();
      if (perm !== 'unknown') setMicPermission(perm);
    })();
  }, []);

  const handleSegment = useCallback(async (segment: RecognitionSegment) => {
    const currentSettings = settingsRef.current;

    if (segment.isFinal) {
      setSegments((prev) => [...prev.slice(-49), segment]);
      setCurrentText(segment.text);

      if (currentSettings.translationEnabled && currentSettings.subtitleLanguage !== currentSettings.speechLanguage) {
        const translator = translationRef.current;
        if (translator) {
          try {
            const result = await translator.translate({
              text: segment.text,
              sourceLanguage: currentSettings.speechLanguage,
              targetLanguage: currentSettings.subtitleLanguage,
            });
            setTranslatedText(result.translatedText);
            setSegments((prev) =>
              prev.map((item) =>
                item.id === segment.id ? { ...item, translatedText: result.translatedText } : item
              )
            );
          } catch (err) {
            setError(`Translation failed: ${(err as Error).message}`);
          }
        }
      } else {
        setTranslatedText('');
      }
    } else {
      setCurrentText(segment.text);
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setMicTestResult(null);
    setMicTestSuccess(null);

    if (!speechSupported) {
      setState('unsupported');
      setError('Speech recognition is not available in this browser. Use Chrome, Edge, or Safari on desktop or Android for live speech-to-text.');
      return;
    }

    setState('requesting-permission');

    const micResult = await requestMicrophoneAccess();
    setMicPermission(micResult.permission);

    if (!micResult.success) {
      setState('error');
      setError(micResult.message);
      return;
    }

    if (!speechProviderName) {
      setState('unsupported');
      setError('No speech recognition provider is registered.');
      return;
    }

    const factory = getSpeechProvider(speechProviderName);
    if (!factory) {
      setState('unsupported');
      setError(`Provider "${speechProviderName}" not found.`);
      return;
    }

    if (translationProviderName) {
      const translationFactory = getTranslationProvider(translationProviderName);
      if (translationFactory) {
        translationRef.current = translationFactory({ onError: (message) => setError(message) });
      }
    }

    setState('starting');

    const provider = factory({
      language: settingsRef.current.speechLanguage,
      onSegment: (segment) => void handleSegment(segment),
      onError: (message) => {
        setError(message);
        setState('error');
      },
      onStateChange: (newState) => setState(newState),
    });

    recognitionRef.current = provider;

    setSegments([]);
    setCurrentText('');
    setTranslatedText('');

    await provider.start();
  }, [speechProviderName, translationProviderName, handleSegment, speechSupported]);

  const testMicrophone = useCallback(async () => {
    setMicTestResult(null);
    setMicTestSuccess(null);
    setError(null);

    const result = await requestMicrophoneAccess();
    setMicPermission(result.permission);
    setMicTestResult(result.message);
    setMicTestSuccess(result.success);

    if (!result.success) {
      setState('error');
      setError(result.message);
    }

    return result;
  }, []);

  const pause = useCallback(() => {
    recognitionRef.current?.pause();
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    recognitionRef.current?.resume();
    setState('listening');
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setState('stopped');
    setCurrentText('');
  }, []);

  const clearTranscript = useCallback(() => {
    setSegments([]);
    setCurrentText('');
    setTranslatedText('');
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const isListening = state === 'listening' || state === 'starting' || state === 'processing' || state === 'requesting-permission';
  const isPaused = state === 'paused';
  const isStopped = state === 'idle' || state === 'stopped';

  return {
    state,
    error,
    segments,
    currentText,
    translatedText,
    micPermission,
    micTestResult,
    micTestSuccess,
    start,
    pause,
    resume,
    stop,
    clearTranscript,
    testMicrophone,
    isListening,
    isPaused,
    isStopped,
    isSupported: speechSupported,
  };
}
