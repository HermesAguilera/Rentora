import { useState } from 'react';
import { useBookings } from '../hooks/useReservasData';
import BookingRow from './BookingRow';

type TabFilter = 'all' | 'active' | 'finished';

const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'active', label: 'Activas' },
  { id: 'finished', label: 'Finalizadas' },
];

export default function BookingsTable() {
  const { data: bookings, isPending, isError } = useBookings();
  const [tab, setTab] = useState<TabFilter>('all');

  const activeCount = bookings?.filter((booking) => booking.status === 'active').length ?? 0;
  const filtered = bookings?.filter((booking) => {
    if (tab === 'active') return booking.status === 'active';
    if (tab === 'finished') return booking.status === 'finished';
    return true;
  });

  return (
    <section className="flex flex-1 flex-col gap-8 rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <div className="flex items-center justify-between border-b border-[#f4f5fc] pb-4">
        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
          Gestión de reservas
        </h2>

        <nav className="flex items-center gap-2" aria-label="Filtrar reservas">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-2 px-6 py-4 font-['Poppins',sans-serif] text-sm font-semibold transition-colors ${
                tab === id ? 'text-[#4d44b5]' : 'text-[#a098ae] hover:text-[#4d44b5]'
              }`}
            >
              {label}
              {id === 'active' ? ` (${activeCount})` : ''}
              <span className={`h-1 w-full rounded-full ${tab === id ? 'bg-[#4d44b5]' : ''}`} />
            </button>
          ))}
        </nav>
      </div>

      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar las reservas.
        </p>
      )}

      {isPending && (
        <ul className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-4">
              <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-[#f4f5fc]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-[#f4f5fc]" />
                <div className="h-3 w-24 animate-pulse rounded bg-[#f4f5fc]" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isPending && filtered && filtered.length === 0 && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
          No hay reservas en esta categoría.
        </p>
      )}

      {!isPending && filtered && filtered.length > 0 && (
        <div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#f4f5fc] pb-4">
            <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#a098ae]">Nombre</p>
            <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#a098ae]">ID</p>
            <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#a098ae]">
              Fecha de inicio
            </p>
            <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#a098ae]">
              Espacio
            </p>
            <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#a098ae]">
              Estado
            </p>
          </div>
          <ul className="divide-y divide-[#f4f5fc]">
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
