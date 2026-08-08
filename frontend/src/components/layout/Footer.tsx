import logoIcon from '../../assets/images/logo-icon.png';

export default function Footer() {
  return (
    <footer className="bg-[#e5e5ea]">
      <div className="mx-auto flex max-w-[1922px] flex-col items-center justify-between gap-4 px-[60px] py-6 sm:flex-row">
        <a href="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="Rentora" className="size-6 rounded-md" />
          <span className="font-['Quicksand',sans-serif] text-sm font-bold text-[#2b3073]">
            Rentora
          </span>
        </a>
        <p className="font-['Mulish',sans-serif] text-sm text-[#2b3073]">
          © {new Date().getFullYear()} Rentora · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
