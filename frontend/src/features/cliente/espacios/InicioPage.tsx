import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSpaces } from './hooks/useClienteEspaciosData';
import CategoryTabs from './components/CategoryTabs';
import SpacesGrid from './components/SpacesGrid';
import type { CategoryFilter } from './components/CategoryTabs';

export default function InicioPage() {
  const { data: spaces, isPending, isError } = useSpaces();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filtered = spaces?.filter((space) => {
    if (category !== 'all' && space.category !== category) return false;
    if (!search.trim()) return true;
    const query = search.trim().toLowerCase();
    return space.title.toLowerCase().includes(query) || space.location.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#2b3073]">
          Hola, Erick 👋
        </h1>
        <p className="font-['Quicksand',sans-serif] text-base text-[#8b899e]">
          Encuentra el espacio ideal cerca de ti en tu ciudad
        </p>
      </div>

      <div className="flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <label className="flex flex-1 items-center gap-3 px-4 py-2.5">
          <Search className="size-5 shrink-0 text-[#a098ae]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por bodega, garaje, colonia..."
            aria-label="Buscar espacio"
            className="w-full bg-transparent font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#a098ae] focus:outline-none"
          />
        </label>
        <div className="h-8 w-px shrink-0 bg-[#e7e8f2]" />
        <span className="shrink-0 px-4 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
          📍 Tegucigalpa
        </span>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f4f5fc] px-4 py-2.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <CategoryTabs active={category} onChange={setCategory} />

        <div className="flex items-center justify-between">
          <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
            Espacios cerca de ti
          </h2>
          <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
            {filtered?.length ?? 0} resultados
          </p>
        </div>

        <SpacesGrid
          spaces={filtered}
          isPending={isPending}
          isError={isError}
          emptyMessage="No se encontraron espacios con esos filtros."
        />
      </div>
    </div>
  );
}
