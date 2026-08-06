import { useEffect, useState } from 'react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { usePreferences, useUpdatePreferences } from '../hooks/useConfiguracionData';
import type { AppPreferences } from '../types';

export default function PreferencesSection() {
  const { data: preferences, isPending } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [local, setLocal] = useState<AppPreferences | null>(null);

  useEffect(() => {
    if (preferences) setLocal(preferences);
  }, [preferences]);

  function handleChange<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) {
    if (!local) return;
    const next = { ...local, [key]: value };
    setLocal(next);
    updatePreferences.mutate(next);
  }

  if (isPending || !local) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full max-w-md animate-pulse rounded-2xl bg-[#f4f5fc]" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-2xl bg-[#f4f5fc]" />
      </div>
    );
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <FormField label="Idioma del panel">
        <select
          value={local.language}
          onChange={(e) => handleChange('language', e.target.value as AppPreferences['language'])}
          className={inputClass}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </FormField>

      <FormField label="Moneda">
        <select
          value={local.currency}
          onChange={(e) => handleChange('currency', e.target.value as AppPreferences['currency'])}
          className={inputClass}
        >
          <option value="HNL">Lempira hondureña (L)</option>
          <option value="USD">Dólar estadounidense ($)</option>
        </select>
      </FormField>

      {updatePreferences.isSuccess && (
        <span className="font-['Quicksand',sans-serif] text-sm text-[#2fa76f]">
          Preferencias guardadas ✓
        </span>
      )}
    </div>
  );
}
