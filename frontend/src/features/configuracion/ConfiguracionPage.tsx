import { useState } from 'react';
import SettingsNav from './components/SettingsNav';
import type { SettingsTab } from './components/SettingsNav';
import ProfileSection from './components/ProfileSection';
import SecuritySection from './components/SecuritySection';
import NotificationsSection from './components/NotificationsSection';
import PreferencesSection from './components/PreferencesSection';

const SECTION_TITLE: Record<SettingsTab, string> = {
  perfil: 'Perfil',
  seguridad: 'Seguridad',
  notificaciones: 'Preferencias de notificaciones',
  preferencias: 'Preferencias generales',
};

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<SettingsTab>('perfil');

  return (
    <div className="flex flex-1 gap-8 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <SettingsNav active={tab} onChange={setTab} />

      <div className="min-w-0 flex-1 border-l border-[#f4f5fc] pl-8">
        <h2 className="mb-6 font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
          {SECTION_TITLE[tab]}
        </h2>

        {tab === 'perfil' && <ProfileSection />}
        {tab === 'seguridad' && <SecuritySection />}
        {tab === 'notificaciones' && <NotificationsSection />}
        {tab === 'preferencias' && <PreferencesSection />}
      </div>
    </div>
  );
}
