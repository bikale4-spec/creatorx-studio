import { NAV_ITEMS, type ViewId } from '@/types/navigation';
import { Zap } from 'lucide-react';

type SidebarProps = {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
};

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const categories = [
    { id: 'main', label: 'Overview' },
    { id: 'create', label: 'Create' },
    { id: 'system', label: 'System' },
  ] as const;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col z-40 glass border-r border-white/5">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" fill="currentColor" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 blur-md opacity-50 -z-10" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">CreatorX</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Studio</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {categories.map((cat) => (
          <div key={cat.id}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              {cat.label}
            </p>
            <div className="space-y-1">
              {NAV_ITEMS.filter((item) => item.category === cat.id).map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : ''}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/5">
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">System Online</span>
          </div>
          <p className="text-[10px] text-gray-600">CreatorX Studio v1.0</p>
        </div>
      </div>
    </aside>
  );
}
