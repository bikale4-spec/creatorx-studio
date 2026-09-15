import { useState, type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import type { ViewId } from '@/types/navigation';
import HomeView from '@/views/HomeView';
import AiToolsView from '@/views/AiToolsView';
import LiveSubtitlesView from '@/views/LiveSubtitlesView';
import StreamingView from '@/views/StreamingView';
import VideoEditorView from '@/views/VideoEditorView';
import VoiceStudioView from '@/views/VoiceStudioView';
import AvatarStudioView from '@/views/AvatarStudioView';
import VideoRecorderView from '@/views/VideoRecorderView';
import SettingsView from '@/views/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState<ViewId>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  function navigate(view: ViewId) { setCurrentView(view); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const views: Record<ViewId, ReactNode> = {
    home: <HomeView onNavigate={navigate} />, 'ai-tools': <AiToolsView />, 'live-subtitles': <LiveSubtitlesView />, streaming: <StreamingView />, 'video-editor': <VideoEditorView />, 'voice-studio': <VoiceStudioView />, 'avatar-studio': <AvatarStudioView />, 'video-recorder': <VideoRecorderView />, settings: <SettingsView />,
  };
  return <div className="min-h-screen bg-[#0a0a0f] bg-radial-glow"><Sidebar currentView={currentView} onNavigate={navigate} /><div className="lg:pl-64 min-h-screen"><TopBar onMenuClick={() => setMenuOpen((value) => !value)} />{menuOpen && <div className="lg:hidden fixed inset-0 top-16 z-30 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)}><div className="absolute left-0 top-0 bottom-0 w-72 glass p-4" onClick={(event) => event.stopPropagation()}><div className="space-y-1">{['home', 'ai-tools', 'live-subtitles', 'streaming', 'video-editor', 'voice-studio', 'avatar-studio', 'video-recorder', 'settings'].map((id) => <button key={id} onClick={() => navigate(id as ViewId)} className={`w-full text-left px-4 py-3 rounded-xl text-sm ${currentView === id ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-400'}`}>{id.replace('-', ' ')}</button>)}</div></div></div>}<main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 max-w-[1600px] mx-auto">{views[currentView]}</main></div><BottomNav currentView={currentView} onNavigate={navigate} /></div>;
}

export default App;
