import type { ClientSpace } from '../types';
import SpaceCard from './SpaceCard';

interface SpacesGridProps {
  spaces: ClientSpace[] | undefined;
  isPending: boolean;
  isError: boolean;
  emptyMessage: string;
}

export default function SpacesGrid({ spaces, isPending, isError, emptyMessage }: SpacesGridProps) {
  if (isError) {
    return (
      <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
        No se pudieron cargar los espacios.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-[#e7e8f2] bg-white">
            <div className="h-[130px] bg-[#f4f5fc]" />
            <div className="flex flex-col gap-3 p-4">
              <div className="h-4 w-32 rounded bg-[#f4f5fc]" />
              <div className="h-3 w-40 rounded bg-[#f4f5fc]" />
              <div className="h-3 w-24 rounded bg-[#f4f5fc]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!spaces || spaces.length === 0) {
    return <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
