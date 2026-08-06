import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, ImagePlus } from 'lucide-react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import Toggle from '../../../components/shared/Toggle';
import { usePublishSpace } from './hooks/usePublicarEspacio';
import type { SpaceCategory } from '../espacios/types';

const CATEGORY_OPTIONS: { value: SpaceCategory; label: string }[] = [
  { value: 'bodega', label: 'Bodega' },
  { value: 'garaje', label: 'Garaje' },
  { value: 'cuarto-exterior', label: 'Cuarto exterior' },
  { value: 'oficina-pequena', label: 'Oficina pequeña' },
];

const AMENITY_OPTIONS = [
  'Acceso 24/7',
  'Vigilancia',
  'Cámaras de seguridad',
  'Acceso vehicular',
  'Iluminación LED',
  'Internet incluido',
  'Aire acondicionado',
  'Portón eléctrico',
];

export default function PublicarEspacioPage() {
  const publishSpace = usePublishSpace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SpaceCategory>('bodega');
  const [sizeM2, setSizeM2] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [available247, setAvailable247] = useState(false);

  const canSubmit =
    title.trim().length > 0 &&
    location.trim().length > 0 &&
    Number(sizeM2) > 0 &&
    Number(pricePerMonth) > 0;

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    publishSpace.mutate({
      title: title.trim(),
      category,
      sizeM2: Number(sizeM2),
      pricePerMonth: Number(pricePerMonth),
      location: location.trim(),
      description: description.trim(),
      amenities,
      available247,
    });
  }

  if (publishSpace.isSuccess) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#e5f4ec] text-[#2fa76f]">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-['Poppins',sans-serif] text-lg font-bold text-[#2b3073]">
            ¡Espacio publicado!
          </p>
          <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
            {title} ya está visible para otros usuarios en Rentora.
          </p>
        </div>
        <Link
          to="/app"
          className="rounded-full bg-[#4d44b5] px-6 py-3 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Ir a Inicio
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#2b3073]">
        Publicar espacio
      </h1>

      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e7e8f2] py-10 text-[#a098ae] transition-colors hover:border-[#c1bbeb] hover:text-[#4d44b5]"
        >
          <ImagePlus className="size-8" strokeWidth={1.5} />
          <span className="font-['Quicksand',sans-serif] text-sm font-semibold">
            Agregar fotos del espacio
          </span>
        </button>

        <FormField label="Título del espacio">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Bodega Amalia"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Categoría">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SpaceCategory)}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Tamaño (m²)">
            <input
              type="number"
              min="1"
              value={sizeM2}
              onChange={(e) => setSizeM2(e.target.value)}
              placeholder="20"
              className={inputClass}
            />
          </FormField>
          <FormField label="Precio mensual (L.)">
            <input
              type="number"
              min="1"
              value={pricePerMonth}
              onChange={(e) => setPricePerMonth(e.target.value)}
              placeholder="2500"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Ubicación">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Col. Palmira, Tegucigalpa"
            className={inputClass}
          />
        </FormField>

        <FormField label="Descripción" hint="Cuéntale a los interesados qué hace especial tu espacio.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe el espacio, sus condiciones y para qué es ideal..."
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
            Comodidades
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {AMENITY_OPTIONS.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="size-4 shrink-0 accent-[#4d44b5]"
                />
                <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-[#f4f5fc] px-4 py-3.5">
          <div>
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
              Disponible 24/7
            </p>
            <p className="font-['Quicksand',sans-serif] text-xs text-[#8b899e]">
              El inquilino podrá acceder al espacio en cualquier momento.
            </p>
          </div>
          <Toggle checked={available247} onChange={setAvailable247} label="Disponible 24/7" />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || publishSpace.isPending}
          className="w-fit rounded-full bg-[#4d44b5] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {publishSpace.isPending ? 'Publicando...' : 'Publicar espacio'}
        </button>
      </div>
    </form>
  );
}
