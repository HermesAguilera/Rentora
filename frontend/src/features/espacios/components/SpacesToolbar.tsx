import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

interface SpacesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function SpacesToolbar({ search, onSearchChange }: SpacesToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex w-full max-w-xs items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <Search className="size-5 shrink-0 text-[#a098ae]" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search here..."
          aria-label="Buscar espacio"
          className="w-full bg-transparent font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#a098ae] focus:outline-none"
        />
      </label>

      <Link
        to="/app/publicar"
        className="flex items-center gap-2 rounded-full bg-[#4d44b5] px-6 py-4 font-['Poppins',sans-serif] text-sm text-white shadow-[0_20px_25px_rgba(191,21,108,0.05)]"
      >
        <Plus className="size-4" strokeWidth={2.5} />
        Nuevo espacio
      </Link>
    </div>
  );
}
