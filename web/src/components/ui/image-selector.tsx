import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Label } from "./label";
import { X, Star } from "lucide-react";

export interface SelectedImage {
  id: string;
  url: string; // object URL or remote URL
  file?: File; // present for local selections
  primary?: boolean;
}

interface ImageSelectorProps {
  value: SelectedImage[];
  onChange: (images: SelectedImage[]) => void;
  max?: number; // default 5
}

export function ImageSelector({ value, onChange, max = 5 }: ImageSelectorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Ensure exactly one primary if any images exist
    if (value.length > 0 && !value.some((img) => img.primary)) {
      const first = { ...value[0], primary: true };
      onChange([first, ...value.slice(1).map((i) => ({ ...i, primary: false }))]);
    }
  }, [value]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - value.length;
    const addCount = Math.min(remaining, files.length);
    if (addCount <= 0) {
      setError(`Máximo de ${max} imagens atingido.`);
      return;
    }
    const newImages: SelectedImage[] = [];
    for (let i = 0; i < addCount; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({ id: crypto.randomUUID(), url, file });
    }
    const merged = [...value, ...newImages];
    // enforce single primary
    const hasPrimary = merged.some((img) => img.primary);
    const normalized = merged.map((img, idx) => ({ ...img, primary: hasPrimary ? !!img.primary : idx === 0 }));
    onChange(normalized);
    setError("");
    // reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    const filtered = value.filter((img) => img.id !== id);
    // reassign primary if needed
    if (filtered.length > 0 && !filtered.some((img) => img.primary)) {
      filtered[0].primary = true;
    }
    onChange(filtered);
  };

  const setPrimary = (id: string) => {
    onChange(value.map((img) => ({ ...img, primary: img.id === id })));
  };

  return (
    <div className="space-y-2">
      <Label>Imagens (1 principal, até {max} no total)</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()} className="w-full sm:w-auto">
        Selecionar imagens
      </Button>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {value.map((img) => (
            <Card key={img.id} className="relative overflow-hidden">
              <img src={img.url} alt="Pré-visualização" className="h-32 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/40 px-2 py-1 text-white">
                <button
                  className={img.primary ? "flex items-center gap-1 text-yellow-400" : "flex items-center gap-1 text-white"}
                  onClick={() => setPrimary(img.id)}
                  aria-label={img.primary ? "Imagem principal" : "Definir como principal"}
                >
                  <Star className="h-4 w-4" />
                  <span className="text-xs">{img.primary ? "Principal" : "Tornar principal"}</span>
                </button>
                <button className="text-white" onClick={() => removeImage(img.id)} aria-label="Remover">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
