import { useState } from 'react';
import type { SubmitEvent } from 'react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { useChangePassword } from '../hooks/useConfiguracionData';

export default function SecuritySection() {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setFormError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setFormError(null);
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
          Cambiar contraseña
        </h3>

        <FormField label="Contraseña actual">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </FormField>

        <FormField label="Nueva contraseña" hint="Mínimo 8 caracteres.">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </FormField>

        <FormField label="Confirmar nueva contraseña">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </FormField>

        {formError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">{formError}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit || changePassword.isPending}
            className="rounded-full bg-[#4d44b5] px-6 py-3 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {changePassword.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
          {changePassword.isSuccess && (
            <span className="font-['Quicksand',sans-serif] text-sm text-[#2fa76f]">
              Contraseña actualizada ✓
            </span>
          )}
        </div>
      </form>

      <div className="flex max-w-md flex-col gap-3 rounded-2xl border border-[#f7d3d4] bg-[#fdf5f5] p-5">
        <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#b23b3f]">
          Zona de peligro
        </h3>
        <p className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
          Cerrar la sesión en todos los dispositivos o eliminar tu cuenta son acciones
          permanentes.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-[#e7e8f2] bg-white px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5]"
          >
            Cerrar sesión en todos los dispositivos
          </button>
          <button
            type="button"
            className="rounded-full bg-[#e5484d] px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
