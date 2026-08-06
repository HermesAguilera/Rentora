import { useState } from 'react';
import { useSpaces } from './hooks/useEspaciosData';
import SpacesToolbar from './components/SpacesToolbar';
import SpacesGrid from './components/SpacesGrid';

export default function EspaciosPage() {
  const { data: spaces, isPending, isError } = useSpaces();
  const [search, setSearch] = useState('');

  const filtered = spaces?.filter((space) =>
    space.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SpacesToolbar search={search} onSearchChange={setSearch} />
      <SpacesGrid spaces={filtered} isPending={isPending} isError={isError} />
    </div>
  );
}
