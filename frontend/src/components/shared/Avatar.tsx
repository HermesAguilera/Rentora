const PALETTE = ['#cbc4e8', '#c7e6dd', '#f2bfaf', '#faecc4', '#d982b6'];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ name, imageUrl, size = 40, className = '' }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-['Quicksand',sans-serif] font-semibold text-[#2b3073] ${className}`}
      style={{ width: size, height: size, backgroundColor: colorFor(name), fontSize: size * 0.38 }}
    >
      {initialsOf(name)}
    </span>
  );
}
