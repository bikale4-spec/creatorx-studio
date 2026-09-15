import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && <p className="text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-2">{eyebrow}</p>}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-sm text-gray-500 max-w-xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
