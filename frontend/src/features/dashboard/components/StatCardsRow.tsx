import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, Coins, CreditCard, Star } from 'lucide-react';
import { useDashboardSummary } from '../hooks/useDashboardData';
import { formatLempiras } from '../../../utils/currency';

interface StatDef {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  rounded: string;
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-1 items-center gap-4 px-2 first:pl-0 last:pr-0">
      <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-[#eceefa]" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 animate-pulse rounded bg-[#eceefa]" />
        <div className="h-5 w-14 animate-pulse rounded bg-[#eceefa]" />
      </div>
    </div>
  );
}

export default function StatCardsRow() {
  const { data, isError } = useDashboardSummary();

  const stats: StatDef[] | null = data
    ? [
        {
          label: 'Espacios publicados',
          value: String(data.publishedSpaces),
          icon: LayoutGrid,
          iconBg: '#5b52c9',
          rounded: 'rounded-2xl',
        },
        {
          label: 'Ingreso del mes',
          value: formatLempiras(data.incomeThisMonth),
          icon: Coins,
          iconBg: '#f2703c',
          rounded: 'rounded-full',
        },
        {
          label: 'Reservas activas',
          value: String(data.activeBookings),
          icon: CreditCard,
          iconBg: '#eab655',
          rounded: 'rounded-full',
        },
        {
          label: 'Calificación',
          value: data.rating.toFixed(1),
          icon: Star,
          iconBg: '#2b3073',
          rounded: 'rounded-full',
        },
      ]
    : null;

  return (
    <section className="flex items-stretch divide-x divide-[#eef0f9] rounded-3xl bg-white px-8 py-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      {isError && (
        <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
          No se pudieron cargar las estadísticas.
        </p>
      )}

      {!isError && !stats && (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      )}

      {stats?.map(({ label, value, icon: Icon, iconBg, rounded }) => (
        <div key={label} className="flex flex-1 items-center gap-4 px-2 first:pl-0 last:pr-0">
          <span
            className={`flex size-14 shrink-0 items-center justify-center ${rounded}`}
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="size-6 text-white" strokeWidth={2} />
          </span>
          <div>
            <p className="font-['Quicksand',sans-serif] text-xs font-medium text-[#8b899e]">
              {label}
            </p>
            <p className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
              {value}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
