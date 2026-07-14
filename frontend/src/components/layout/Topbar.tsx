import { Search } from 'lucide-react';
import Avatar from '../shared/Avatar';

interface TopbarUser {
  name: string;
  role: string;
  avatarUrl?: string | null;
}

interface TopbarProps {
  title: string;
  user?: TopbarUser;
}

const DEFAULT_USER: TopbarUser = { name: 'Noble A.', role: 'Admin', avatarUrl: null };

export default function Topbar({ title, user = DEFAULT_USER }: TopbarProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">{title}</h1>

      <div className="flex items-center gap-5">
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
          <Search className="size-4 text-[#8b899e]" />
          <input
            type="search"
            placeholder="Search here..."
            aria-label="Buscar"
            className="w-48 bg-transparent font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#8b899e] focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              {user.name}
            </p>
            <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">{user.role}</p>
          </div>
          <Avatar name={user.name} imageUrl={user.avatarUrl} size={40} />
        </div>
      </div>
    </header>
  );
}
