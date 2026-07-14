import { BadgeCheck, Car, Package } from 'lucide-react';
import heroBg from '../../../assets/images/hero-bg-waves.png';
import houseIcon from '../../../assets/images/icon-house.svg';

export default function Hero() {
  return (
    <section
      className="bg-[#2c307b] bg-cover bg-top px-[60px] py-[100px]"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="mx-auto grid max-w-[1922px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-5 text-white">
          <h1 className="font-['Poppins',sans-serif] text-5xl font-bold leading-[1.15] tracking-tight lg:text-7xl">
            Alquila el espacio que necesitas, cuando lo necesitas
          </h1>
          <p className="max-w-xl font-['Roboto',sans-serif] text-lg text-white/90 [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
            Bodegas, garajes, cuartos exteriores y más. Seguros, verificados y
            disponibles cerca de ti en cualquier ciudad.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[455px] flex-col gap-5">
          <div className="overflow-hidden rounded-[15px] border border-[#e3dada] bg-white shadow-xl">
            <div className="flex h-[105px] items-center justify-center bg-[#2c307b]">
              <img src={houseIcon} alt="" className="size-14" />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <span className="flex w-fit items-center gap-1 rounded-[15px] border border-[#2c307b]/20 px-3 py-1 font-['Quicksand',sans-serif] text-sm text-[#2c307b]">
                <BadgeCheck className="size-4 text-[#2c307b]" />
                Verificado
              </span>
              <p className="font-['Quicksand',sans-serif] text-base text-[#2c307b]">
                Bodega
              </p>
              <p className="font-['Quicksand',sans-serif] text-sm text-[#7f7c7c]">
                Tegucigalpa · 7.4 km
              </p>
              <div className="flex gap-2">
                <span className="rounded-[15px] bg-[#d9d9d9] px-3 py-1 font-['Quicksand',sans-serif] text-xs text-[#2c307b]">
                  20 m²
                </span>
                <span className="rounded-[15px] bg-[#d9d9d9] px-3 py-1 font-['Quicksand',sans-serif] text-xs text-[#2c307b]">
                  Autos
                </span>
                <span className="rounded-[15px] bg-[#d9d9d9] px-3 py-1 font-['Quicksand',sans-serif] text-xs text-[#2c307b]">
                  24/7
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-1 overflow-hidden rounded-[15px] bg-white shadow-lg">
              <div className="flex h-[90px] items-center justify-center bg-[#7fc071]">
                <Car className="size-9 text-white/90" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-[15px] bg-white shadow-lg">
              <div className="flex h-[90px] items-center justify-center bg-[#d982b6]">
                <Package className="size-9 text-white/90" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
