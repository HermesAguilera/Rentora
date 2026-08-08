import { Link } from 'react-router-dom';
import logoIcon from '../../assets/images/logo-icon.png';
import rocketIcon from '../../assets/images/icon-rocket.svg';
import { homePathFor, useCurrentUser } from '../../features/auth/hooks/useAuth';

export default function Navbar() {
  const currentUser = useCurrentUser();

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
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link
                to={homePathFor(currentUser)}
                className="flex items-center gap-2 rounded-[20px] bg-[#2b3073] px-[30px] py-[14px] font-['Quicksand',sans-serif] text-base font-semibold text-white"
              >
                <img src={rocketIcon} alt="" className="size-4" />
                Ir a Rentora
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-[20px] bg-white px-[30px] py-[14px] font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073] shadow-sm"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="flex items-center gap-2 rounded-[20px] bg-[#2b3073] px-[30px] py-[14px] font-['Quicksand',sans-serif] text-base font-semibold text-white"
                >
                  <img src={rocketIcon} alt="" className="size-4" />
                  Registro
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
