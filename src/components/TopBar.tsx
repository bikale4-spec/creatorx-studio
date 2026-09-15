import { Bell, Command, Menu, Search } from 'lucide-react';

type TopBarProps = {
  onMenuClick: () => void;
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-gray-500 text-sm">
          <span>Workspace</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300">Studio</span>
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Command className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-sm">CreatorX</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300 transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-xs">Search</span>
          <kbd className="ml-4 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-600">⌘K</kbd>
        </button>
        <button className="sm:hidden p-2 text-gray-400 hover:text-white">
          <Search className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-gray-400 hover:text-cyan-300 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-black">
            CX
          </div>
        </div>
      </div>
    </header>
  );
}
