import { useState } from 'react';
import type { SubmitEvent } from 'react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import { useChangePassword } from '../hooks/useConfiguracionData';
import { apiMessage } from '../../../lib/api';
import { useLogoutAllDevices } from '../../auth/hooks/useAuth';

/** Misma regla que `Password::min(8)->mixedCase()->numbers()->symbols()` en el backend. */
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function SecuritySection() {
  const changePassword = useChangePassword();
  const logoutAll = useLogoutAllDevices();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!STRONG_PASSWORD.test(newPassword)) {
      setFormError(
        'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.',
      );
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

        <FormField
          label="Nueva contraseña"
          hint="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo."
        >
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

        {changePassword.isError && !formError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            {apiMessage(changePassword.error, 'No se pudo actualizar la contraseña.')}
          </p>
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
          Sesiones activas
        </h3>
        <p className="font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
          Revoca el acceso en todos los dispositivos donde iniciaste sesión. Tendrás que volver a
          entrar.
        </p>
        <button
          type="button"
          onClick={() => logoutAll.mutate()}
          disabled={logoutAll.isPending}
          className="w-fit rounded-full border border-[#e7e8f2] bg-white px-5 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5] disabled:opacity-40"
        >
          {logoutAll.isPending ? 'Cerrando...' : 'Cerrar sesión en todos los dispositivos'}
        </button>
      </div>
    </div>
  );
}
