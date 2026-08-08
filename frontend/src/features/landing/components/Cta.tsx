import { Link } from 'react-router-dom';

export default function Cta() {
  return (
    <section className="flex flex-col items-center gap-5 bg-white px-[55px] py-[120px] text-center">
      <h2 className="font-['Poppins',sans-serif] text-5xl font-bold tracking-tight text-[#2d2d2d]">
        Empieza hoy, gratis
      </h2>
      <p className="max-w-2xl font-['Mulish',sans-serif] text-xl text-[#2d2d2d]">
        Crea tu cuenta en menos de 2 minutos y encuentra tu espacio ideal
      </p>
      <Link
        to="/registro"
        className="mt-4 rounded-[20px] bg-[#2b3073] px-10 py-4 font-['Quicksand',sans-serif] text-base font-semibold text-white transition-opacity hover:opacity-90"
      >
        Crear mi cuenta
      </Link>
    </section>
  );
}
