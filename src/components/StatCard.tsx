import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'pink' | 'purple' | 'green' | 'yellow';
};

const colorStyles = {
  cyan: { bg: 'bg-cyan-400/10', text: 'text-cyan-300', glow: 'group-hover:shadow-cyan-400/10' },
  pink: { bg: 'bg-pink-400/10', text: 'text-pink-300', glow: 'group-hover:shadow-pink-400/10' },
  purple: { bg: 'bg-purple-400/10', text: 'text-purple-300', glow: 'group-hover:shadow-purple-400/10' },
  green: { bg: 'bg-green-400/10', text: 'text-green-300', glow: 'group-hover:shadow-green-400/10' },
  yellow: { bg: 'bg-yellow-400/10', text: 'text-yellow-300', glow: 'group-hover:shadow-yellow-400/10' },
};

export default function StatCard({ label, value, change, icon: Icon, color = 'cyan' }: StatCardProps) {
  const styles = colorStyles[color];
  return (
    <div className={`glass-card group p-4 sm:p-5 ${styles.glow} transition-shadow duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
          {change && <p className="text-[11px] text-green-400 mt-2">{change}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${styles.bg}`}>
          <Icon className={`w-5 h-5 ${styles.text}`} />
        </div>
      </div>
    </div>
  );
}
