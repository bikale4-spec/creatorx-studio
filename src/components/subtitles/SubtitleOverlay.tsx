import type { SubtitleSettings } from '@/lib/subtitles/types';
import { isRtl } from '@/lib/subtitles/types';

type SubtitleOverlayProps = {
  settings: SubtitleSettings;
  originalText: string;
  translatedText: string;
  showLiveBadge?: boolean;
  className?: string;
};

const positionClasses: Record<SubtitleSettings['position'], string> = {
  'bottom-center': 'items-end justify-center text-center',
  'bottom-left': 'items-end justify-start text-left',
  'top-center': 'items-start justify-center text-center',
};

const animationClasses: Record<SubtitleSettings['animation'], string> = {
  fade: 'animate-fade-in',
  slide: 'animate-fade-in-up',
  none: '',
};

const outlineClasses: Record<SubtitleSettings['outline'], string> = {
  none: '',
  shadow: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
  outline: '[-webkit-text-stroke:1px_rgba(0,0,0,0.7)]',
};

export default function SubtitleOverlay({
  settings,
  originalText,
  translatedText,
  showLiveBadge = true,
  className = '',
}: SubtitleOverlayProps) {
  if (!settings.enabled) {
    return (
      <div className={`relative rounded-xl bg-[#07070b] overflow-hidden border border-white/5 ${className}`}>
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative aspect-video flex items-center justify-center">
          <p className="text-xs text-gray-700">Subtitles are disabled</p>
        </div>
      </div>
    );
  }

  const bgAlpha = settings.backgroundOpacity / 100;
  const showOriginal = settings.translationEnabled && originalText && translatedText && settings.speechLanguage !== settings.subtitleLanguage;
  const lines = showOriginal
    ? [translatedText, originalText]
    : [originalText || translatedText];
  const visibleLines = lines.slice(0, settings.maxLines);

  return (
    <div className={`relative rounded-xl bg-[#07070b] overflow-hidden border border-white/5 ${className}`}>
      <div className="absolute inset-0 bg-grid opacity-20" />
      {showLiveBadge && (
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 text-red-300 text-[10px] z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </div>
      )}
      <div className={`relative aspect-video flex ${positionClasses[settings.position]} p-4 sm:p-6`}>
        <div
          className={`max-w-[92%] ${animationClasses[settings.animation]} ${outlineClasses[settings.outline]}`}
          style={{ fontFamily: settings.fontFamily }}
        >
          {visibleLines.map((line, index) => {
            const isOriginalLine = showOriginal && index === 1;
            const lang = isOriginalLine ? settings.speechLanguage : settings.subtitleLanguage;
            const rtl = isRtl(lang);
            return (
              <p
                key={index}
                dir={rtl ? 'rtl' : 'ltr'}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: 1.3,
                  background: `rgba(0, 0, 0, ${bgAlpha})`,
                  padding: '4px 12px',
                  borderRadius: '8px',
                  marginBottom: index < visibleLines.length - 1 ? '4px' : 0,
                }}
                className={`text-white font-semibold ${isOriginalLine ? 'text-cyan-200/70 text-[0.8em]' : ''}`}
              >
                {line || '...'}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
