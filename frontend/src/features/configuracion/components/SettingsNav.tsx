import { Bell, Lock, SlidersHorizontal, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SettingsTab = 'perfil' | 'seguridad' | 'notificaciones' | 'preferencias';

const TABS: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'seguridad', label: 'Seguridad', icon: Lock },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'preferencias', label: 'Preferencias', icon: SlidersHorizontal },
];

interface SettingsNavProps {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

export default function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1" aria-label="Secciones de configuración">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-['Quicksand',sans-serif] text-sm font-semibold transition-colors ${
            active === id
              ? 'bg-[#f4f5fc] text-[#4d44b5]'
              : 'text-[#8b899e] hover:bg-[#f4f5fc] hover:text-[#2b3073]'
          }`}
        >
          <Icon className="size-4" strokeWidth={2} />
          {label}
        </button>
      ))}
    </nav>
  );
}
