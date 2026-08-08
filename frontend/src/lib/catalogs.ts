import type { SpaceCategory } from '../features/cliente/espacios/types';

/** Etiquetas de `App\Enums\SpaceType` del backend. */
export const CATEGORY_LABEL: Record<SpaceCategory, string> = {
  warehouse: 'Bodega',
  garage: 'Garaje',
  room: 'Habitación',
  closet: 'Closet',
  other: 'Otro',
};

/** Comodidades que maneja el backend (se guardan como slug en `spaces.amenities`). */
export const AMENITIES: { value: string; label: string }[] = [
  { value: '24h_access', label: 'Acceso 24/7' },
  { value: 'security_camera', label: 'Cámaras de seguridad' },
  { value: 'covered', label: 'Techado' },
  { value: 'electricity', label: 'Electricidad' },
  { value: 'water_access', label: 'Acceso a agua' },
];

export function amenityLabel(value: string): string {
  return AMENITIES.find((amenity) => amenity.value === value)?.label ?? value;
}

/** Los m² se derivan de ancho × largo; el backend guarda las dimensiones por separado. */
export function areaM2(width: number | string | null, depth: number | string | null): number {
  return Math.round(Number(width ?? 0) * Number(depth ?? 0));
}
