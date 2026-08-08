import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { Star } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { formatMonthYear } from '../../../utils/date';
import { apiMessage } from '../../../lib/api';
import { useClientProfile, useUpdateClientProfile } from './hooks/useClientePerfilData';

export default function PerfilPage() {
  const { data: profile, isPending } = useClientProfile();
  const updateProfile = useUpdateClientProfile();

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <Avatar name={profile.name} imageUrl={profile.avatarUrl} size={72} />
        <div>
          <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
            {profile.name}
          </p>
          <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">{profile.email}</p>
        </div>

        <span className="flex items-center gap-1 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
          <Star className="size-4 fill-[#f5b544] text-[#f5b544]" />
          {profile.rating.toFixed(1)} ({profile.reviewsCount} reseñas)
        </span>

        <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
          Miembro desde {formatMonthYear(profile.memberSince)}
        </p>

        <div className="mt-3 flex w-full items-center justify-center gap-8 border-t border-[#f4f5fc] pt-4">
          <div>
            <p className="font-['Poppins',sans-serif] text-lg font-bold text-[#2b3073]">
              {profile.spacesCount}
            </p>
            <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">Espacios</p>
          </div>
          <div>
            <p className="font-['Poppins',sans-serif] text-lg font-bold text-[#2b3073]">
              {profile.reservationsCount}
            </p>
            <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">Reservaciones</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(43,48,115,0.05)]"
      >
        <h2 className="font-['Poppins',sans-serif] text-lg font-bold text-[#2b3073]">
          Información personal
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        {updateProfile.isError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            {apiMessage(updateProfile.error, 'No se pudo guardar el perfil.')}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isDirty || updateProfile.isPending}
            className="w-fit rounded-full bg-[#4d44b5] px-6 py-3 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {updateProfile.isSuccess && !isDirty && (
            <span className="font-['Quicksand',sans-serif] text-sm text-[#2fa76f]">Guardado ✓</span>
          )}
        </div>
      </form>
    </div>
  );
}
