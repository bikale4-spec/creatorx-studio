/*
# Add subtitle settings persistence support

1. Purpose
   The app_settings table already supports key-value settings. This migration
   adds a default row for live-subtitles-settings so the app has a known
   starting state. No schema changes needed — app_settings already exists.

2. Data
   - Insert default subtitle settings into app_settings with key 'live-subtitles-settings'
   - Settings include: enabled, speechLanguage, subtitleLanguage, translationEnabled,
     autoPunctuation, fontSize, fontFamily, position, alignment, backgroundOpacity,
     maxLines, animation, outline, delayMs

3. Security
   - No security changes. app_settings already has anon+authenticated CRUD policies.
*/

INSERT INTO app_settings (key, value)
VALUES ('live-subtitles-settings', '{
  "enabled": true,
  "speechLanguage": "fa",
  "subtitleLanguage": "en",
  "translationEnabled": true,
  "autoPunctuation": true,
  "fontSize": 24,
  "fontFamily": "Inter, sans-serif",
  "position": "bottom-center",
  "alignment": "center",
  "backgroundOpacity": 70,
  "maxLines": 2,
  "animation": "fade",
  "outline": "shadow",
  "delayMs": 0
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
