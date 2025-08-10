import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type PhotonFeature = {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
  };
};

interface AddressAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  ariaLabelledby?: string;
}

// Free, keyless address suggestions via Photon (OpenStreetMap) API.
// Endpoint: https://photon.komoot.io. Country-scoped to Canada.
export default function AddressAutocomplete({ value, onChange, placeholder, id, ariaLabelledby }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const debounceRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setQuery(value || ""), [value]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en&limit=5&countrycode=ca`;
        const res = await fetch(url, { headers: { "Accept": "application/json" } });
        const data = await res.json();
        setResults((data?.features || []).slice(0, 5));
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const normalized = useMemo(() => {
    return results.map((f) => {
      const p = f.properties || {} as any;
      const line = (p.label as string) || [p.housenumber, p.street, p.city, p.state, p.postcode].filter(Boolean).join(', ');
      return { label: line || p.name || '', value: line || p.name || '' };
    }).filter((r) => r.label);
  }, [results]);

  return (
    <div ref={rootRef} className="relative">
      <Input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setActiveIdx(-1);
        }}
        placeholder={placeholder}
        className="bg-background"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="addr-suggest"
        aria-labelledby={ariaLabelledby}
        onKeyDown={(e) => {
          if (!open || normalized.length === 0) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((i) => (i + 1) % normalized.length);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => (i <= 0 ? normalized.length - 1 : i - 1));
          } else if (e.key === 'Enter') {
            if (activeIdx >= 0) {
              const sel = normalized[activeIdx];
              onChange(sel.value);
              setQuery(sel.value);
              setOpen(false);
            }
          }
        }}
        onFocus={() => {
          if (normalized.length > 0) setOpen(true);
        }}
      />
      {open && normalized.length > 0 && (
        <Card id="addr-suggest" className="absolute z-50 mt-1 w-full max-h-56 overflow-auto" role="listbox">
          <ul>
            {normalized.map((r, idx) => (
              <li key={`${r.value}-${idx}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={idx === activeIdx}
                  className={`w-full text-left px-3 py-2 hover:bg-accent ${idx===activeIdx ? 'bg-accent' : ''}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => {
                    onChange(r.value);
                    setQuery(r.value);
                    setOpen(false);
                  }}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}


