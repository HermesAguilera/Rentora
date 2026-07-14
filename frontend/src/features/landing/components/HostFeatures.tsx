const FEATURES = [
  {
    title: 'Ingresos mensuales',
    description: 'Cobra de forma automática. Rentora gestiona los pagos por ti.',
    iconBg: 'bg-[rgba(255,98,80,0.2)]',
  },
  {
    title: 'Arrendatarios verificados',
    description:
      'Solo personas con identidad verificada pueden alquilar tu espacio.',
    iconBg: 'bg-[rgba(0,147,121,0.2)]',
  },
  {
    title: 'Comunicación directa',
    description: 'Chatea con tus arrendatarios y gestiona todo desde la app.',
    iconBg: 'bg-[rgba(248,213,126,0.2)]',
  },
];

export default function HostFeatures() {
  return (
    <div className="flex flex-col items-center gap-10 px-[55px] py-[80px] text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#2d2d2d]">
          ¿Tienes un espacio disponible?
        </h2>
        <p className="font-['Mulish',sans-serif] text-base text-[#2d2d2d]">
          Publica tu espacio y genera ingresos extra cada mes
        </p>
      </div>

      <div className="grid w-full max-w-[1170px] grid-cols-1 gap-[30px] sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center gap-[30px] rounded-[20px] border border-[#e5f4f2] bg-white px-[30px] py-10 drop-shadow-[0px_20px_24px_rgba(51,102,255,0.05)]"
          >
            <div className={`size-[82px] rounded-[20px] ${feature.iconBg}`} />
            <div className="flex flex-col gap-3 text-center">
              <p className="font-['Poppins',sans-serif] text-2xl font-semibold tracking-tight text-[#2d2d2d]">
                {feature.title}
              </p>
              <p className="font-['Mulish',sans-serif] text-base text-[#2d2d2d]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
