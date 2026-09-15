import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  title: string;
  type: string;
  status: string;
  thumbnail_url: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AiResult = {
  id: string;
  tool_type: string;
  topic: string;
  language: string;
  content: string[];
  created_at: string;
};

export type StreamScene = {
  id: string;
  name: string;
  is_active: boolean;
  sources: SceneSource[];
  created_at: string;
  updated_at: string;
};

export type SceneSource = {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  properties: Record<string, unknown>;
};

export type Avatar = {
  id: string;
  name: string;
  image_url: string | null;
  status: string;
  created_at: string;
};

export type AppSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};
