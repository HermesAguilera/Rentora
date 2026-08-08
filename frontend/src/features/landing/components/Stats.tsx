import { useQuery } from '@tanstack/react-query';
import { getPublicStats } from '../../../services/statsService';

export default function Stats() {
  const { data } = useQuery({
    queryKey: ['public', 'stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60_000,
  });

  const metrics = [
    { value: data?.activeSpaces, label: 'Espacios disponibles' },
    { value: data?.registeredUsers, label: 'Usuarios registrados' },
    { value: data?.completedBookings, label: 'Alquileres completados' },
    { value: data?.averageRating?.toFixed(1), label: 'Calificación promedio' },
  ];

  return (
    <section className="bg-[#e5e5ea] px-[55px] py-[60px]">
      <div className="mx-auto grid max-w-[1170px] grid-cols-2 gap-8 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border-l-4 border-[#f2bfaf] pl-5 text-[#2d2d2d]">
            <p className="font-['Poppins',sans-serif] text-4xl font-bold tracking-tight">
              {metric.value ?? '—'}
            </p>
            <p className="font-['Mulish',sans-serif] text-base">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
