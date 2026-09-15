import { useState } from 'react';
import { Captions, Check, ChevronDown, ChevronUp, Circle, Loader2, Mic, MicOff, Pause, Play, RotateCcw, Settings2, Square, X } from 'lucide-react';
import SubtitleOverlay from './SubtitleOverlay';
import SubtitleSettingsPanel from './SubtitleSettingsPanel';
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

export default function StreamingSubtitlePanel() {
  const { settings, update, reset } = useSubtitleSettings();
  const { state, error, segments, currentText, translatedText, micPermission, micTestResult, micTestSuccess, start, pause, resume, stop, testMicrophone, isListening, isPaused, isStopped, isSupported } = useLiveSubtitles({ settings });
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded((value) => !value)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
            <Captions className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">Live AI Subtitles</h3>
            <p className="text-[11px] text-gray-600">
              {languageLabel(settings.speechLanguage)} → {languageLabel(settings.subtitleLanguage)}
              {settings.translationEnabled ? ' (translated)' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[10px] ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
            {status.label}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4 animate-fade-in">
          {state === 'unsupported' && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <MicOff className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">Speech recognition is not available in this browser. Use Chrome, Edge, or Safari.</p>
            </div>
          )}

          {error && state !== 'unsupported' && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          {micTestResult && (
            <div className={`p-3 rounded-lg flex items-start gap-2 ${micTestSuccess ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              {micTestSuccess ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /> : <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
              <p className={`text-xs ${micTestSuccess ? 'text-green-300' : 'text-red-300'}`}>{micTestResult}</p>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => update({ enabled: !settings.enabled })}
              className={`relative w-10 h-5 rounded-full transition-colors ${settings.enabled ? 'bg-cyan-400' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.enabled ? 'left-5' : 'left-0.5'}`} />
            </button>
            <div className="flex flex-wrap gap-2">
              {isStopped || state === 'error' ? (
                <button
                  onClick={() => void start()}
                  disabled={!isSupported}
                  className="neon-button-primary inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs disabled:opacity-50"
                >
                  <Play className="w-3 h-3" /> Start
                </button>
              ) : isListening ? (
                <button
                  onClick={pause}
                  className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                >
                  <Pause className="w-3 h-3" /> Pause
                </button>
              ) : isPaused ? (
                <button
                  onClick={resume}
                  className="neon-button-primary inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                >
                  <Play className="w-3 h-3" /> Resume
                </button>
              ) : null}

              {(isListening || isPaused) && (
                <button
                  onClick={stop}
                  className="bg-red-500/15 text-red-300 border border-red-500/30 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                >
                  <Square className="w-3 h-3 fill-current" /> Stop
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resume}
                  className="neon-button inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                >
                  <RotateCcw className="w-3 h-3" /> Restart
                </button>
              )}

              <button
                onClick={() => void handleTestMic()}
                disabled={testingMic || isListening}
                className="neon-button inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs disabled:opacity-50"
              >
                  {testingMic ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />} Test mic
                </button>

              <button
                onClick={() => setShowSettings((value) => !value)}
                className={`neon-button inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs ${showSettings ? 'border-cyan-400/40' : ''}`}
              >
                <Settings2 className="w-3 h-3" /> Settings
              </button>
            </div>
          </div>

          <SubtitleOverlay
            settings={settings}
            originalText={displayOriginal}
            translatedText={displayTranslated}
            className="!aspect-video"
          />

          <div className="flex items-center gap-2 text-[11px]">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
            <span className={status.color}>{status.label}</span>
            {micPermission === 'granted' && (isListening || isPaused) && <span className="text-green-400">· Microphone active</span>}
            {micPermission === 'granted' && isStopped && <span className="text-gray-500">· Microphone ready</span>}
            {micPermission === 'denied' && <span className="text-red-400">· Access denied</span>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-gray-500">
              Speech
              <select
                value={settings.speechLanguage}
                onChange={(event) => update({ speechLanguage: event.target.value as LanguageCode })}
                className="input-field w-full mt-1 px-2 py-2 text-xs"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-gray-500">
              Subtitle
              <select
                value={settings.subtitleLanguage}
                onChange={(event) => update({ subtitleLanguage: event.target.value as LanguageCode })}
                className="input-field w-full mt-1 px-2 py-2 text-xs"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </label>
          </div>

          {showSettings && (
            <SubtitleSettingsPanel settings={settings} onChange={update} onReset={reset} />
          )}
        </div>
      )}
    </div>
  );
}
