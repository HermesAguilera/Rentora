const STEPS = [
  {
    number: 1,
    title: 'Crea tu cuenta',
    description: 'Regístrate en minutos y verifica tu identidad de forma segura.',
  },
  {
    number: 2,
    title: 'Busca tu espacio',
    description:
      'Filtra por zona, tamaño, precio y tipo de espacio que necesitas.',
  },
  {
    number: 3,
    title: 'Reserva y firma',
    description: 'Solicita el espacio, firma el contrato digital y paga en línea.',
  },
  {
    number: 4,
    title: 'Acceso 24/7',
    description: 'Recibe tu código de acceso y ábrelo cuando lo necesites.',
  },
];

export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center gap-10 px-[55px] py-[80px] text-center">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-['Poppins',sans-serif] text-4xl font-bold text-black">
          ¿Cómo funciona Rentora?
        </h2>
        <p className="font-['Roboto',sans-serif] text-xl font-medium text-[#999]">
          En 4 pasos sencillos
        </p>
      </div>

      <div className="grid w-full max-w-[1170px] grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center gap-5 rounded-[20px] border border-[#e5f4f2] bg-white px-6 py-10 shadow-[34px_30px_24px_rgba(51,102,255,0.05)]"
          >
            <div className="flex size-[82px] items-center justify-center rounded-full bg-[#2b3073] font-['Poppins',sans-serif] text-2xl font-bold text-white">
              {step.number}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Quicksand',sans-serif] text-lg font-semibold text-[#2d2d2d]">
                {step.title}
              </p>
              <p className="font-['Mulish',sans-serif] text-sm text-[#7a7a7a]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
