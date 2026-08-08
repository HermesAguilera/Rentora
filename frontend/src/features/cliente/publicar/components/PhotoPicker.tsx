import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { MAX_PHOTOS, MAX_PHOTO_MB } from '../../../../services/spacePhotosService';

interface PhotoPickerProps {
  photos: File[];
  onChange: (photos: File[]) => void;
}

export default function PhotoPicker({ photos, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Las vistas previas son object URLs: hay que revocarlas al cambiar la lista.
  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    const tooBig = incoming.find((file) => file.size > MAX_PHOTO_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" pesa más de ${MAX_PHOTO_MB} MB.`);
      return;
    }

    const total = photos.length + incoming.length;
    if (total > MAX_PHOTOS) {
      setError(`Puedes subir un máximo de ${MAX_PHOTOS} fotos.`);
      return;
    }

    setError(null);
    onChange([...photos, ...incoming]);
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(index: number) {
    setError(null);
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        className="hidden"
      />

      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((preview, index) => (
            <li key={preview} className="relative">
              <img
                src={preview}
                alt={`Foto ${index + 1} del espacio`}
                className="h-28 w-full rounded-2xl object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 font-['Quicksand',sans-serif] text-[10px] font-semibold text-[#2b3073]">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Quitar foto ${index + 1}`}
                className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-[#e5484d] text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <X className="size-3.5" strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {photos.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e7e8f2] py-8 text-[#a098ae] transition-colors hover:border-[#c1bbeb] hover:text-[#4d44b5]"
        >
          <ImagePlus className="size-8" strokeWidth={1.5} />
          <span className="font-['Quicksand',sans-serif] text-sm font-semibold">
            {photos.length === 0 ? 'Agregar fotos del espacio' : 'Agregar más fotos'}
          </span>
          <span className="font-['Quicksand',sans-serif] text-xs">
            JPG, PNG o WEBP · hasta {MAX_PHOTO_MB} MB cada una · máximo {MAX_PHOTOS}
          </span>
        </button>
      )}

      {error && <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">{error}</p>}

      {photos.length > 0 && (
        <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
          La primera foto será la principal del anuncio.
        </p>
      )}
    </div>
  );
}
