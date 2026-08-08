import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import Avatar from '../../../components/shared/Avatar';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { useProfile, useUpdateProfile } from '../hooks/useConfiguracionData';

export default function ProfileSection() {
  const { data: profile, isPending } = useProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
  }, [profile]);

  const isDirty =
    !!profile && (name !== profile.name || email !== profile.email || phone !== profile.phone);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile.mutate({ name, email, phone });
  }

  if (isPending || !profile) {
    return (
      <div className="flex flex-col gap-6">
        <div className="size-20 animate-pulse rounded-full bg-[#f4f5fc]" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-2xl bg-[#f4f5fc]" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-2xl bg-[#f4f5fc]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar name={profile.name} imageUrl={profile.avatarUrl} size={80} />
        <div>
          <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
            {profile.name}
          </p>
          <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">{profile.role}</p>
        </div>
      </div>

      <FormField label="Nombre completo">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </FormField>

      <FormField label="Correo electrónico">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Teléfono">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </FormField>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isDirty || updateProfile.isPending}
          className="rounded-full bg-[#4d44b5] px-6 py-3 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {updateProfile.isSuccess && !isDirty && (
          <span className="font-['Quicksand',sans-serif] text-sm text-[#2fa76f]">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
