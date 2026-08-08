import type { SpaceCategory } from '../types';

export type CategoryFilter = 'all' | SpaceCategory;

const TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'warehouse', label: 'Bodegas' },
  { id: 'garage', label: 'Garajes' },
  { id: 'room', label: 'Habitaciones' },
  { id: 'closet', label: 'Closets' },
  { id: 'other', label: 'Otros' },
];

interface CategoryTabsProps {
  active: CategoryFilter;
  onChange: (tab: CategoryFilter) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-2xl px-4 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
            active === id
              ? 'bg-[#4d44b5] text-white'
              : 'bg-white text-[#8b899e] hover:text-[#2b3073]'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
