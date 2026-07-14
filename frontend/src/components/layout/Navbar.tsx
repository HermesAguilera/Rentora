import logoIcon from '../../assets/images/logo-icon.png';
import rocketIcon from '../../assets/images/icon-rocket.svg';

export default function Navbar() {
  return (
    <header className="bg-[#f8f9ff]">
      <div className="mx-auto flex max-w-[1922px] items-center justify-between px-[60px] py-[24px]">
        <a href="/" className="flex items-center gap-3">
          <img src={logoIcon} alt="Rentora" className="size-10 rounded-lg" />
          <span className="font-['Quicksand',sans-serif] text-2xl font-bold text-[#2b3073]">
            Rentora
          </span>
        </a>

        <nav className="flex items-center gap-[50px]">
          <a
            href="#contact"
            className="font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073]"
          >
            Contact
          </a>
          <div className="flex items-center gap-">
            <a
              href="#login"
              className="rounded-[20px] bg-white px-[30px] py-[14px] font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073] shadow-sm"
            >
              Iniciar sesión
            </a>
            <a
              href="#register"
              className="flex items-center gap-2 rounded-[20px] bg-[#2b3073] px-[30px] py-[14px] font-['Quicksand',sans-serif] text-base font-semibold text-white"
            >
              <img src={rocketIcon} alt="" className="size-4" />
              Registro
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
