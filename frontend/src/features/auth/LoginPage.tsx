import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AuthBrandPanel from './components/AuthBrandPanel';
import { fieldClass, fieldInputClass as inputClass } from './authFieldStyles';
import { useLogin } from './hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigate('/app') },
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <AuthBrandPanel
        title="Bienvenido"
        subtitle="Encuentra o publica espacios seguros y verificados en tu ciudad."
      />

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
              Rentora
            </span>
          </Link>

          <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#2b3073]">
            Inicia sesión
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
              Contraseña
            </span>
            <label className={fieldClass}>
              <Lock className="size-4 shrink-0 text-[#a098ae]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 shrink-0 accent-[#4d44b5]"
              />
              <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
                Recordar
              </span>
            </label>
            <button
              type="button"
              className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#4d44b5] hover:opacity-80"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {login.isError && (
            <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
              No se pudo iniciar sesión. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || login.isPending}
            className="rounded-full bg-[#2b3073] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {login.isPending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="font-semibold text-[#4d44b5] hover:opacity-80">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
