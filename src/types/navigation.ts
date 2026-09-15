import {
  Home,
  Sparkles,
  Captions,
  Radio,
  Video,
  Mic,
  UserCircle,
  Camera,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ViewId =
  | 'home'
  | 'ai-tools'
  | 'live-subtitles'
  | 'streaming'
  | 'video-editor'
  | 'voice-studio'
  | 'avatar-studio'
  | 'video-recorder'
  | 'settings';

export type NavItem = {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  category: 'main' | 'create' | 'system';
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, category: 'main' },
  { id: 'ai-tools', label: 'AI Tools', icon: Sparkles, category: 'create' },
  { id: 'live-subtitles', label: 'Live Subtitles', icon: Captions, category: 'create' },
  { id: 'streaming', label: 'Streaming', icon: Radio, category: 'create' },
  { id: 'video-editor', label: 'Video Editor', icon: Video, category: 'create' },
  { id: 'voice-studio', label: 'Voice Studio', icon: Mic, category: 'create' },
  { id: 'avatar-studio', label: 'Avatar Studio', icon: UserCircle, category: 'create' },
  { id: 'video-recorder', label: 'Recorder', icon: Camera, category: 'create' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => !['video-recorder', 'settings'].includes(item.id)
);

export const LANGUAGES = [
  'English', 'Persian', 'Arabic', 'Turkish', 'German',
  'French', 'Spanish', 'Italian', 'Portuguese', 'Russian',
  'Japanese', 'Korean', 'Chinese',
] as const;

export type Language = typeof LANGUAGES[number];
