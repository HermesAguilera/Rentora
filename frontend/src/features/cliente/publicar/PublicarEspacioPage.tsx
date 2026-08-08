import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import FormField, { inputClass } from '../../../components/shared/FormField';
import PhotoPicker from './components/PhotoPicker';
import { usePublishSpace } from './hooks/usePublicarEspacio';
import { AMENITIES, CATEGORY_LABEL } from '../../../lib/catalogs';
import { apiMessage } from '../../../lib/api';
import type { SpaceCategory } from '../espacios/types';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABEL) as [SpaceCategory, string][];

export default function PublicarEspacioPage() {
  const publishSpace = usePublishSpace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SpaceCategory>('warehouse');
  const [widthMeters, setWidthMeters] = useState('');
  const [lengthMeters, setLengthMeters] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Tegucigalpa');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const canSubmit =
    title.trim().length > 0 &&
    address.trim().length > 0 &&
    city.trim().length > 0 &&
    description.trim().length > 0 &&
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
      widthMeters: Number(widthMeters) || 0,
      lengthMeters: Number(lengthMeters) || 0,
      pricePerMonth: Number(pricePerMonth),
      address: address.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      description: description.trim(),
      amenities,
      photos,
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
            ¡Espacio enviado a revisión!
          </p>
          <p className="mt-1 font-['Quicksand',sans-serif] text-sm text-[#7d7e93]">
            {title} será visible para otros usuarios en cuanto el equipo de Rentora lo apruebe.
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
        <PhotoPicker photos={photos} onChange={setPhotos} />

        <FormField label="Título del espacio">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Bodega Amalia"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoría">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SpaceCategory)}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Ancho (m)">
            <input
              type="number"
              min="0"
              step="0.5"
              value={widthMeters}
              onChange={(e) => setWidthMeters(e.target.value)}
              placeholder="4"
              className={inputClass}
            />
          </FormField>
          <FormField label="Largo (m)">
            <input
              type="number"
              min="0"
              step="0.5"
              value={lengthMeters}
              onChange={(e) => setLengthMeters(e.target.value)}
              placeholder="5"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Dirección">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej. Calle Principal, casa #123"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Ciudad">
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Colonia / barrio">
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ej. Col. Palmira"
              className={inputClass}
            />
          </FormField>
        </div>

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
            {AMENITIES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={amenities.includes(value)}
                  onChange={() => toggleAmenity(value)}
                  className="size-4 shrink-0 accent-[#4d44b5]"
                />
                <span className="font-['Quicksand',sans-serif] text-sm text-[#2b3073]">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {publishSpace.isError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            {apiMessage(publishSpace.error, 'No se pudo publicar el espacio.')}
          </p>
        )}

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
