import { Link } from 'react-router-dom';
import { Building2, CalendarCheck, Clock, Coins, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAdminStats } from './hooks/useAdminData';
import { formatLempiras } from '../../utils/currency';

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  color: string;
}

export default function AdminResumenPage() {
  const { data, isPending, isError } = useAdminStats();

  const cards: StatCard[] = data
    ? [
        {
          label: 'Usuarios registrados',
          value: String(data.users.total),
          hint: `${data.users.active} activos · ${data.users.new_this_month} nuevos este mes`,
          icon: Users,
          color: '#5b52c9',
        },
        {
          label: 'Espacios publicados',
          value: String(data.spaces.active),
          hint: `${data.spaces.total} en total`,
          icon: Building2,
          color: '#2fa76f',
        },
        {
          label: 'Reservas activas',
          value: String(data.bookings.active),
          hint: `${data.bookings.completed_this_month} completadas este mes`,
          icon: CalendarCheck,
          color: '#eab655',
        },
        {
          label: 'Comisiones acumuladas',
          value: formatLempiras(data.revenue.totalPlatformFees),
          hint: `${formatLempiras(data.revenue.thisMonth)} este mes`,
          icon: Coins,
          color: '#f2703c',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar las estadísticas.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isPending &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-white" />
          ))}

        {cards.map(({ label, value, hint, icon: Icon, color }) => (
          <section
            key={label}
            className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]"
          >
            <span
              className="flex size-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: color }}
            >
              <Icon className="size-5 text-white" strokeWidth={2} />
            </span>
            <div>
              <p className="font-['Quicksand',sans-serif] text-xs font-medium text-[#8b899e]">
                {label}
              </p>
              <p className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
                {value}
              </p>
              <p className="mt-1 font-['Quicksand',sans-serif] text-xs text-[#a098ae]">{hint}</p>
            </div>
          </section>
        ))}
      </div>

      {data && data.spaces.pending_review > 0 && (
        <Link
          to="/admin/espacios"
          className="flex items-center gap-4 rounded-3xl border border-[#fdf1d0] bg-[#fffdf6] p-6 transition-colors hover:border-[#eab655]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdf1d0] text-[#b9820b]">
            <Clock className="size-5" strokeWidth={2} />
          </span>
          <div>
            <p className="font-['Poppins',sans-serif] text-base font-bold text-[#2b3073]">
              {data.spaces.pending_review}{' '}
              {data.spaces.pending_review === 1
                ? 'espacio espera revisión'
                : 'espacios esperan revisión'}
            </p>
            <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
              Revísalos para que aparezcan en la búsqueda pública.
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
