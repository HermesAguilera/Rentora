import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import AuthBrandPanel from './components/AuthBrandPanel';
import { fieldClass, fieldInputClass as inputClass } from './authFieldStyles';
import { homePathFor, useAcceptTerms, useLogout, useRegister } from './hooks/useAuth';
import TermsModal from './components/TermsModal';
import { apiMessage } from '../../lib/api';
import type { AuthUser } from '../../lib/authStore';

/** Misma regla que `Password::min(8)->mixedCase()->numbers()->symbols()` en el backend. */
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function RegistroPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const acceptTerms = useAcceptTerms();
  const logout = useLogout();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Al crear la cuenta se muestran los términos; hay que aceptarlos para entrar.
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);

  const canSubmit =
    email.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    password.length >= 8 &&
    confirmPassword.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!STRONG_PASSWORD.test(password)) {
      setFormError(
        'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.',
      );
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setFormError(null);
    register.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        passwordConfirmation: confirmPassword,
      },
      { onSuccess: (user) => setPendingUser(user) },
    );
  }

  function handleAcceptTerms() {
    if (!pendingUser) return;
    acceptTerms.mutate(undefined, {
      onSuccess: () => navigate(homePathFor(pendingUser), { replace: true }),
    });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {pendingUser && (
        <TermsModal
          userName={pendingUser.firstName}
          isAccepting={acceptTerms.isPending}
          onAccept={handleAcceptTerms}
          onDecline={() => {
            setPendingUser(null);
            logout.mutate();
          }}
        />
      )}

      <AuthBrandPanel
        title="Únete a Rentora"
        subtitle="Publica o encuentra espacios seguros y verificados en tu ciudad."
      />

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
              Rentora
            </span>
          </Link>

          <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#2b3073]">
            Registro
          </h1>

          <div className="flex flex-col gap-2">
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              Correo electrónico
            </span>
            <label className={fieldClass}>
              <Mail className="size-4 shrink-0 text-[#a098ae]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@email.com"
                autoComplete="email"
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              Número de teléfono
            </span>
            <label className={fieldClass}>
              <Phone className="size-4 shrink-0 text-[#a098ae]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+504 0000-0000"
                autoComplete="tel"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
                Nombre
              </span>
              <label className={fieldClass}>
                <User className="size-4 shrink-0 text-[#a098ae]" />
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Erick"
                  autoComplete="given-name"
                  className={inputClass}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
                Apellido
              </span>
              <label className={fieldClass}>
                <User className="size-4 shrink-0 text-[#a098ae]" />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sánchez"
                  autoComplete="family-name"
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              Contraseña
            </span>
            <label className={fieldClass}>
              <Lock className="size-4 shrink-0 text-[#a098ae]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 8, con mayúscula, número y símbolo"
                autoComplete="new-password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="shrink-0 text-[#a098ae] hover:text-[#4d44b5]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              Confirmar contraseña
            </span>
            <label className={fieldClass}>
              <Lock className="size-4 shrink-0 text-[#a098ae]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="shrink-0 text-[#a098ae] hover:text-[#4d44b5]"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </label>
          </div>

          {formError && (
            <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">{formError}</p>
          )}

          {register.isError && !formError && (
            <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
              {apiMessage(register.error, 'No se pudo crear la cuenta. Intenta de nuevo.')}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || register.isPending}
            className="rounded-full bg-[#2b3073] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {register.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
            Al crear tu cuenta te mostraremos los términos y condiciones de Rentora, que incluyen
            la comisión que cobra la plataforma por cada reserva.
          </p>

          <p className="text-center font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-[#4d44b5] hover:opacity-80">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
