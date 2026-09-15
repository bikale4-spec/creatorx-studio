import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_SUBTITLE_SETTINGS, type SubtitleSettings } from './types';

const SETTING_KEY = 'live-subtitles-settings';

function mergeSettings(stored: Record<string, unknown>): SubtitleSettings {
  return { ...DEFAULT_SUBTITLE_SETTINGS, ...stored } as SubtitleSettings;
}

export function useSubtitleSettings() {
  const [settings, setSettings] = useState<SubtitleSettings>(DEFAULT_SUBTITLE_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', SETTING_KEY)
        .maybeSingle();

      if (data?.value) {
        setSettings(mergeSettings(data.value as Record<string, unknown>));
      }
      setLoaded(true);
    })();
  }, []);

  const update = useCallback((partial: Partial<SubtitleSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...partial };
      void supabase
        .from('app_settings')
        .upsert({ key: SETTING_KEY, value: next as unknown as Record<string, unknown> }, { onConflict: 'key' });
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SUBTITLE_SETTINGS);
    void supabase
      .from('app_settings')
      .upsert({ key: SETTING_KEY, value: DEFAULT_SUBTITLE_SETTINGS as unknown as Record<string, unknown> }, { onConflict: 'key' });
  }, []);

  return { settings, update, reset, loaded };
}
