import { useFavoriteSpaces } from '../espacios/hooks/useClienteEspaciosData';
import SpacesGrid from '../espacios/components/SpacesGrid';

export default function FavoritosPage() {
  const { data: spaces, isPending, isError } = useFavoriteSpaces();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
        Espacios favoritos
      </h1>

      <SpacesGrid
        spaces={spaces}
        isPending={isPending}
        isError={isError}
        emptyMessage="Aún no has guardado espacios como favoritos."
      />
    </div>
  );
}
