const METRICS = [
  { value: '1,250+', label: 'Espacios disponibles' },
  { value: '4,800+', label: 'Usuarios registrados' },
  { value: '98%', label: 'Pagos a tiempo' },
  { value: '4.8', label: 'Calificación promedio' },
];

export default function Stats() {
  return (
    <section className="bg-[#e5e5ea] px-[55px] py-[60px]">
      <div className="mx-auto grid max-w-[1170px] grid-cols-2 gap-8 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="border-l-4 border-[#f2bfaf] pl-5 text-[#2d2d2d]"
          >
            <p className="font-['Poppins',sans-serif] text-4xl font-bold tracking-tight">
              {metric.value}
            </p>
            <p className="font-['Mulish',sans-serif] text-base">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
