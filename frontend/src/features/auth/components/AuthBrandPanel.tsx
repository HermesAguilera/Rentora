import type { ReactNode } from 'react';
import heroBg from '../../../assets/images/hero-bg-waves.png';
import logoIcon from '../../../assets/images/logo-icon.png';

interface AuthBrandPanelProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function AuthBrandPanel({ title, subtitle, children }: AuthBrandPanelProps) {
  return (
    <div
      className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden bg-[#2c307b] bg-cover bg-top px-12 py-16 text-center lg:flex"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <img src={logoIcon} alt="" className="size-24 rounded-2xl" />
      <span className="font-['Poppins',sans-serif] text-4xl font-bold text-white">Rentora</span>

      <div className="mt-6 flex flex-col gap-2">
        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-white">{title}</h2>
        <p className="max-w-xs font-['Quicksand',sans-serif] text-sm text-white/80">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
