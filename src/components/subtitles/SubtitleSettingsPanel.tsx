import { RotateCcw, Settings2 } from 'lucide-react';
import type { SubtitleSettings } from '@/lib/subtitles/types';
import { LANGUAGE_OPTIONS } from '@/lib/subtitles/types';

type Props = {
  settings: SubtitleSettings;
  onChange: (partial: Partial<SubtitleSettings>) => void;
  onReset: () => void;
};

export default function SubtitleSettingsPanel({ settings, onChange, onReset }: Props) {
  return (
    <div className="glass-card p-5 h-fit">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-purple-300" />
          <h3 className="text-sm font-semibold">Subtitle settings</h3>
        </div>
        <button onClick={onReset} className="text-[11px] text-gray-600 hover:text-cyan-300 inline-flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Translation</span>
          <button
            onClick={() => onChange({ translationEnabled: !settings.translationEnabled })}
            className={`relative w-10 h-5 rounded-full transition-colors ${settings.translationEnabled ? 'bg-cyan-400' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.translationEnabled ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-gray-400">Auto punctuation</span>
          <button
            onClick={() => onChange({ autoPunctuation: !settings.autoPunctuation })}
            className={`relative w-10 h-5 rounded-full transition-colors ${settings.autoPunctuation ? 'bg-cyan-400' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.autoPunctuation ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>

        <label className="block text-xs text-gray-500">
          Font
          <select
            value={settings.fontFamily}
            onChange={(event) => onChange({ fontFamily: event.target.value })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value="Inter, sans-serif">Inter — Modern</option>
            <option value="'Space Grotesk', sans-serif">Space Grotesk — Tech</option>
            <option value="'Courier New', monospace">Mono — Streamer</option>
            <option value="Georgia, serif">Georgia — Classic</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Font size <span className="float-right text-gray-300">{settings.fontSize}px</span>
          <input
            type="range"
            min="14"
            max="48"
            value={settings.fontSize}
            onChange={(event) => onChange({ fontSize: Number(event.target.value) })}
            className="w-full mt-3 accent-cyan-400"
          />
        </label>

        <label className="block text-xs text-gray-500">
          Text position
          <select
            value={settings.position}
            onChange={(event) => onChange({ position: event.target.value as SubtitleSettings['position'] })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value="bottom-center">Bottom center</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-center">Top center</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Text alignment
          <select
            value={settings.alignment}
            onChange={(event) => onChange({ alignment: event.target.value as SubtitleSettings['alignment'] })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Background opacity <span className="float-right text-gray-300">{settings.backgroundOpacity}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.backgroundOpacity}
            onChange={(event) => onChange({ backgroundOpacity: Number(event.target.value) })}
            className="w-full mt-3 accent-cyan-400"
          />
        </label>

        <label className="block text-xs text-gray-500">
          Maximum lines
          <select
            value={settings.maxLines}
            onChange={(event) => onChange({ maxLines: Number(event.target.value) })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value={1}>1 line</option>
            <option value={2}>2 lines</option>
            <option value={3}>3 lines</option>
            <option value={4}>4 lines</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Subtitle animation
          <select
            value={settings.animation}
            onChange={(event) => onChange({ animation: event.target.value as SubtitleSettings['animation'] })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value="fade">Fade in</option>
            <option value="slide">Slide up</option>
            <option value="none">None</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Text outline
          <select
            value={settings.outline}
            onChange={(event) => onChange({ outline: event.target.value as SubtitleSettings['outline'] })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value="none">None</option>
            <option value="shadow">Shadow</option>
            <option value="outline">Outline</option>
          </select>
        </label>

        <label className="block text-xs text-gray-500">
          Subtitle delay
          <select
            value={settings.delayMs}
            onChange={(event) => onChange({ delayMs: Number(event.target.value) })}
            className="input-field w-full mt-2 px-3 py-2.5 text-sm"
          >
            <option value={0}>No delay</option>
            <option value={200}>200ms</option>
            <option value={500}>500ms</option>
            <option value={1000}>1 second</option>
          </select>
        </label>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Settings are saved automatically. Connect a speech recognition and translation API in Settings to enable live transcription.
        </p>
      </div>
    </div>
  );
}
