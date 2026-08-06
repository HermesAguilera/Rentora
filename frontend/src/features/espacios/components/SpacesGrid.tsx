import type { Space } from '../types';
import SpaceCard from './SpaceCard';

interface SpacesGridProps {
  spaces: Space[] | undefined;
  isPending: boolean;
  isError: boolean;
}

export default function SpacesGrid({ spaces, isPending, isError }: SpacesGridProps) {
  if (isError) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
        No se pudieron cargar los espacios.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col items-center gap-4 rounded-3xl bg-white p-8"
          >
            <div className="size-[100px] rounded-full bg-[#f4f5fc]" />
            <div className="h-4 w-40 rounded bg-[#f4f5fc]" />
            <div className="h-3 w-28 rounded bg-[#f4f5fc]" />
          </div>
        ))}
      </div>
    );
  }

  if (!spaces || spaces.length === 0) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
        No se encontraron espacios.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
