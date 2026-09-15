import { useState } from 'react';
import { AlertCircle, Captions, Check, Circle, Languages, Loader2, Mic, MicOff, Pause, Play, Radio, RotateCcw, Square, Trash2, X } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import SubtitleOverlay from '@/components/subtitles/SubtitleOverlay';
import SubtitleSettingsPanel from '@/components/subtitles/SubtitleSettingsPanel';
import { useSubtitleSettings } from '@/lib/subtitles/useSubtitleSettings';
import { useLiveSubtitles } from '@/lib/subtitles/useLiveSubtitles';
import { LANGUAGE_OPTIONS, languageLabel, type LanguageCode, type RecognitionState } from '@/lib/subtitles/types';

const STATUS_CONFIG: Record<RecognitionState, { label: string; color: string; dotColor: string; pulse: boolean }> = {
  idle: { label: 'Stopped', color: 'text-gray-500', dotColor: 'bg-gray-600', pulse: false },
  'requesting-permission': { label: 'Requesting mic', color: 'text-yellow-300', dotColor: 'bg-yellow-400', pulse: true },
  starting: { label: 'Starting', color: 'text-yellow-300', dotColor: 'bg-yellow-400', pulse: true },
  listening: { label: 'Listening', color: 'text-green-300', dotColor: 'bg-green-400', pulse: true },
  processing: { label: 'Processing', color: 'text-cyan-300', dotColor: 'bg-cyan-400', pulse: true },
  paused: { label: 'Paused', color: 'text-yellow-300', dotColor: 'bg-yellow-400', pulse: false },
  stopped: { label: 'Stopped', color: 'text-gray-500', dotColor: 'bg-gray-600', pulse: false },
  error: { label: 'Error', color: 'text-red-400', dotColor: 'bg-red-500', pulse: false },
  unsupported: { label: 'Unsupported', color: 'text-red-400', dotColor: 'bg-red-500', pulse: false },
};

export default function LiveSubtitlesView() {
  const { settings, update, reset, loaded } = useSubtitleSettings();
  const { state, error, segments, currentText, translatedText, micPermission, micTestResult, micTestSuccess, start, pause, resume, stop, clearTranscript, testMicrophone, isListening, isPaused, isStopped, isSupported } = useLiveSubtitles({ settings });
  const [showHistory, setShowHistory] = useState(true);
  const [testingMic, setTestingMic] = useState(false);

  const status = STATUS_CONFIG[state] ?? STATUS_CONFIG.idle;
  const displayOriginal = currentText || (segments.length > 0 ? segments[segments.length - 1].text : '');
  const displayTranslated = translatedText || (settings.translationEnabled ? segments.find((s) => s.translatedText)?.translatedText ?? '' : '');

  async function handleTestMic() {
    setTestingMic(true);
    await testMicrophone();
    setTestingMic(false);
  }

  return (
    <div className="space-y-7 animate-fade-in-up">
      <SectionHeader
        eyebrow="Accessibility + reach"
        title="Live AI subtitles"
        description="Real-time speech recognition and translation. Speak in your language — your audience reads in theirs."
        action={
          <div className={`flex items-center gap-2 text-xs ${status.color}`}>
            <span className="relative flex">
              <Circle className={`w-2.5 h-2.5 fill-current ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
            </span>
            {status.label}
          </div>
        }
      />

      {state === 'unsupported' && (
        <div className="glass-card p-5 flex items-start gap-4 border-red-500/20">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <MicOff className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-300">Speech recognition unavailable</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Your browser does not support the Web Speech Recognition API. Use Chrome, Edge, or Safari on desktop or Android for live speech-to-text. All other subtitle features — customization, overlay preview, and settings — remain fully functional.
            </p>
          </div>
        </div>
      )}

      {error && state !== 'unsupported' && (
        <div className="glass-card p-4 flex items-start gap-3 border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{error}</p>
            {micPermission === 'denied' && (
              <p className="text-xs text-gray-600 mt-1">
                Click the microphone icon in your browser's address bar to allow access, then try again.
              </p>
            )}
          </div>
        </div>
      )}

      {micTestResult && (
        <div className={`glass-card p-4 flex items-start gap-3 ${micTestSuccess ? 'border-green-500/20' : 'border-red-500/20'}`}>
          {micTestSuccess ? (
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          ) : (
            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${micTestSuccess ? 'text-green-300' : 'text-red-300'}`}>{micTestResult}</p>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <Captions className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Subtitle preview</h3>
                  <p className="text-xs text-gray-600">Exactly what your viewers will see</p>
                </div>
              </div>
              <button
                onClick={() => update({ enabled: !settings.enabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-cyan-400' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <SubtitleOverlay
              settings={settings}
              originalText={displayOriginal}
              translatedText={displayTranslated}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {isStopped || state === 'error' ? (
                <button
                  onClick={() => void start()}
                  disabled={!isSupported}
                  className="neon-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm disabled:opacity-50"
                >
                  <Play className="w-4 h-4" /> Start listening
                </button>
              ) : isListening ? (
                <button
                  onClick={pause}
                  className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              ) : isPaused ? (
                <button
                  onClick={resume}
                  className="neon-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                >
                  <Play className="w-4 h-4" /> Resume
                </button>
              ) : null}

              {(isListening || isPaused) && (
                <button
                  onClick={stop}
                  className="bg-red-500/15 text-red-300 border border-red-500/30 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                >
                  <Square className="w-4 h-4 fill-current" /> Stop
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resume}
                  className="neon-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Restart
                </button>
              )}

              <button
                onClick={() => void handleTestMic()}
                disabled={testingMic || isListening}
                className="neon-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm disabled:opacity-50"
              >
                {testingMic ? <><Loader2 className="w-4 h-4 animate-spin" /> Testing...</> : <><Mic className="w-4 h-4" /> Test microphone</>}
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <div className={`flex items-center gap-2 text-xs ${status.color}`}>
                <span className={`w-2 h-2 rounded-full ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
                {status.label}
              </div>
              {micPermission === 'denied' && (
                <span className="text-xs text-red-400">Microphone access denied</span>
              )}
              {micPermission === 'granted' && (isListening || isPaused) && (
                <span className="text-xs text-green-400">Microphone active</span>
              )}
              {micPermission === 'granted' && isStopped && (
                <span className="text-xs text-gray-500">Microphone ready</span>
              )}
              {micPermission === 'unavailable' && (
                <span className="text-xs text-red-400">No microphone found</span>
              )}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-4 h-4 text-cyan-300" />
              <h3 className="text-sm font-semibold">Language pipeline</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-xs text-gray-500">
                Original speech language
                <select
                  value={settings.speechLanguage}
                  onChange={(event) => update({ speechLanguage: event.target.value as LanguageCode })}
                  className="input-field w-full mt-2 px-3 py-2.5 text-sm"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label} — {lang.nativeLabel}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-gray-500">
                Subtitle language
                <select
                  value={settings.subtitleLanguage}
                  onChange={(event) => update({ subtitleLanguage: event.target.value as LanguageCode })}
                  className="input-field w-full mt-2 px-3 py-2.5 text-sm"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label} — {lang.nativeLabel}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Radio className="w-3.5 h-3.5" />
                {languageLabel(settings.speechLanguage)} → {languageLabel(settings.subtitleLanguage)}
              </div>
              <button
                onClick={() => update({ translationEnabled: !settings.translationEnabled })}
                className={`relative w-10 h-5 rounded-full transition-colors ${settings.translationEnabled ? 'bg-cyan-400' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.translationEnabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {loaded && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Live transcript</h3>
                <div className="flex items-center gap-3">
                  {segments.length > 0 && (
                    <button
                      onClick={clearTranscript}
                      className="text-[11px] text-gray-600 hover:text-red-300 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory((value) => !value)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {showHistory ? 'Hide' : 'Show'} history
                  </button>
                </div>
              </div>
              {segments.length === 0 && !currentText ? (
                <div className="py-8 text-center">
                  <Mic className={`w-6 h-6 mx-auto mb-2 ${isListening ? 'text-cyan-400 animate-pulse' : 'text-gray-700'}`} />
                  <p className="text-xs text-gray-600">
                    {isListening ? 'Listening — speak now and your words will appear here.' : 'Start listening to see recognized speech appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {showHistory && segments.map((segment) => (
                    <div key={segment.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-600 uppercase">{languageLabel(segment.language)}</span>
                        <span className="text-[10px] text-gray-700">{new Date(segment.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-300" dir={LANGUAGE_OPTIONS.find((l) => l.code === segment.language)?.rtl ? 'rtl' : 'ltr'}>
                        {segment.text}
                      </p>
                      {segment.translatedText && (
                        <p className="text-xs text-cyan-300/80 mt-1" dir={LANGUAGE_OPTIONS.find((l) => l.code === settings.subtitleLanguage)?.rtl ? 'rtl' : 'ltr'}>
                          {segment.translatedText}
                        </p>
                      )}
                    </div>
                  ))}
                  {currentText && !segments.find((s) => s.text === currentText) && (
                    <div className="p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10">
                      <p className="text-sm text-cyan-200/80 italic">{currentText}...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <SubtitleSettingsPanel settings={settings} onChange={update} onReset={reset} />
      </div>
    </div>
  );
}
