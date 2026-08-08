import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  /** A dónde ir si no hay historial previo (p. ej. al abrir un enlace directo). */
  fallback: string;
  className?: string;
}

export default function BackButton({ fallback, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  // React Router lleva un índice en el history state; si es 0 llegamos aquí
  // directamente y retroceder sacaría al usuario del sitio.
  const canGoBack = ((window.history.state?.idx as number | undefined) ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => (canGoBack ? navigate(-1) : navigate(fallback))}
      className={`flex w-fit items-center gap-2 rounded-full border border-[#e7e8f2] bg-white px-4 py-2 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073] transition-colors hover:border-[#4d44b5] hover:text-[#4d44b5] ${className}`}
    >
      <ArrowLeft className="size-4" />
      Regresar
    </button>
  );
}
