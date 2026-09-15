import { MOBILE_NAV_ITEMS, type ViewId } from '@/types/navigation';

type BottomNavProps = {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
};

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[60px]"
            >
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500/30 to-purple-500/20'
                    : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-cyan-300' : 'text-gray-500'
                  }`}
                />
              </div>
              <span
                className={`text-[9px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-cyan-300' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
