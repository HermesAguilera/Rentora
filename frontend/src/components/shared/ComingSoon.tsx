import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  icon: LucideIcon;
}

export default function ComingSoon({ title, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-white p-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-[#f4f5fc] text-[#2b3073]">
        <Icon className="size-8" strokeWidth={1.5} />
      </span>
      <div>
        <h2 className="font-['Poppins',sans-serif] text-xl font-semibold text-[#2b3073]">
          {title}
        </h2>
        <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
          Esta sección estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}
