const SPACE_TYPES = [
  {
    title: 'Bodegas',
    description: 'Para muebles, mercadería o equipo',
    color: 'bg-[#ffcdc9]',
  },
  {
    title: 'Garajes',
    description: 'Techados y seguros para tu vehículo',
    color: 'bg-[#c7e6dd]',
  },
  {
    title: 'Cuartos exteriores',
    description: 'Espacio adicional en patios o traseros',
    color: 'bg-[#cbc4e8]',
  },
  {
    title: 'Oficinas pequeñas',
    description: 'Para trabajo remoto o reuniones',
    color: 'bg-[#faecc4]',
  },
];

export default function SpaceTypes() {
  return (
    <div className="flex flex-col items-center gap-10 px-[55px] py-[80px] text-center">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-['Poppins',sans-serif] text-4xl font-bold text-black">
          Tipos de espacio disponibles
        </h2>
        <p className="font-['Mulish',sans-serif] text-base text-[#2d2d2d]">
          Encuentra el espacio ideal para lo que necesitas guardar
        </p>
      </div>

      <div className="grid w-full max-w-[1170px] grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
        {SPACE_TYPES.map((type) => (
          <div
            key={type.title}
            className="flex flex-col items-start gap-8 rounded-[20px] bg-white px-6 py-8 text-left shadow-[0px_10px_30px_rgba(0,0,0,0.04)]"
          >
            <div className={`size-[70px] rounded-[20px] ${type.color}`} />
            <div className="flex flex-col gap-1">
              <p className="font-['Quicksand',sans-serif] text-xl font-bold text-[#1f1f1f]">
                {type.title}
              </p>
              <p className="font-['Mulish',sans-serif] text-sm text-[#6b6b6b]">
                {type.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
