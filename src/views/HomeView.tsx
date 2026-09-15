import { useEffect, useState } from 'react';
import { ArrowUpRight, Camera, Captions, Edit3, Film, FolderOpen, Layers, Mic, Plus, Radio, Sparkles, UserCircle, Video, Wand2 } from 'lucide-react';
import { supabase, type Project } from '@/lib/supabase';
import { type ViewId } from '@/types/navigation';
import Modal from '@/components/Modal';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';

type HomeViewProps = { onNavigate: (view: ViewId) => void };
const quickActions = [
  { id: 'video-recorder', label: 'Video Recorder', icon: Camera, color: 'cyan', desc: 'Record your next take' },
  { id: 'video-editor', label: 'Video Editor', icon: Film, color: 'purple', desc: 'Turn clips into content' },
  { id: 'ai-tools', label: 'AI Tools', icon: Sparkles, color: 'pink', desc: 'Create smarter, faster' },
  { id: 'voice-studio', label: 'Voice Studio', icon: Mic, color: 'green', desc: 'Polish your sound' },
  { id: 'streaming', label: 'Streaming Studio', icon: Radio, color: 'yellow', desc: 'Go live in seconds' },
  { id: 'live-subtitles', label: 'Live AI Subtitles', icon: Captions, color: 'cyan', desc: 'Reach every viewer' },
  { id: 'avatar-studio', label: 'Avatar Studio', icon: UserCircle, color: 'pink', desc: 'Build your presence' },
] as const;

const colors: Record<string, string> = { cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300', purple: 'from-purple-500/20 to-purple-500/5 text-purple-300', pink: 'from-pink-500/20 to-pink-500/5 text-pink-300', green: 'from-green-500/20 to-green-500/5 text-green-300', yellow: 'from-yellow-500/20 to-yellow-500/5 text-yellow-300' };

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { void loadProjects(); }, []);
  async function loadProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setProjects(data as Project[]);
  }
  async function createProject() {
    if (!title.trim()) return;
    setCreating(true);
    const { data } = await supabase.from('projects').insert({ title: title.trim(), type: 'video', status: 'draft' }).select().maybeSingle();
    if (data) setProjects((current) => [data as Project, ...current]);
    setTitle(''); setCreating(false); setShowModal(false);
  }
  return <div className="space-y-8 animate-fade-in-up">
    <section className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 bg-radial-glow">
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">Your creative command center</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back, creator<span className="neon-text">.</span></h1>
        <p className="mt-3 text-gray-400 max-w-xl text-sm sm:text-base">Everything you need to turn ideas into content your audience cannot stop watching.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => setShowModal(true)} className="neon-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"><Plus className="w-4 h-4" /> New Project</button>
          <button onClick={() => onNavigate('ai-tools')} className="neon-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"><Wand2 className="w-4 h-4" /> Create with AI</button>
        </div>
      </div>
    </section>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Projects created" value={String(projects.length || 0)} change="Keep the momentum going" icon={FolderOpen} color="cyan" />
      <StatCard label="Content published" value="24" change="+18% this month" icon={ArrowUpRight} color="green" />
      <StatCard label="Hours streamed" value="18.5" change="+4.2h this month" icon={Radio} color="purple" />
      <StatCard label="AI generations" value="142" change="Your creative engine" icon={Sparkles} color="pink" />
    </div>
    <section><SectionHeader eyebrow="Workspace" title="Create something great" description="Jump into a focused studio and keep your workflow moving." />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => { const Icon = action.icon; return <button key={action.id} onClick={() => onNavigate(action.id)} className="glass-card text-left p-4 group hover:-translate-y-1 transition-transform"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[action.color]} flex items-center justify-center mb-4`}><Icon className="w-5 h-5" /></div><h3 className="text-sm font-semibold group-hover:text-cyan-300 transition-colors">{action.label}</h3><p className="text-[11px] text-gray-600 mt-1">{action.desc}</p></button>; })}
      </div>
    </section>
    <section><SectionHeader eyebrow="Library" title="Recent projects" action={<button className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></button>} />
      <div className="glass-card overflow-hidden">{projects.length === 0 ? <div className="p-10 text-center"><Layers className="w-8 h-8 text-gray-700 mx-auto mb-3" /><p className="text-sm text-gray-500">Your creative space is ready.</p><button onClick={() => setShowModal(true)} className="mt-4 text-xs text-cyan-400">Create your first project</button></div> : <div className="divide-y divide-white/5">{projects.map((project) => <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02]"><div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center"><Video className="w-5 h-5 text-cyan-300" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{project.title}</p><p className="text-[11px] text-gray-600 mt-1">{project.status} · {new Date(project.created_at).toLocaleDateString()}</p></div><span className="text-[10px] uppercase text-gray-600">{project.type}</span></div>)}</div>}</div>
    </section>
    <Modal open={showModal} title="Start a new project" onClose={() => setShowModal(false)}><div className="space-y-4"><label className="block text-xs text-gray-400">Project name<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void createProject()} placeholder="e.g. Summer gaming series" className="input-field w-full mt-2 px-4 py-3 text-sm" /></label><button disabled={creating || !title.trim()} onClick={() => void createProject()} className="neon-button-primary w-full py-3 rounded-xl text-sm disabled:opacity-50">{creating ? 'Creating...' : 'Create project'}</button></div></Modal>
  </div>;
}
