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
  const cacheRef = useRef<Map<string, PhotonFeature[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

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
        // Sanitize query to avoid API 400s on characters like '#' and typographic hyphens
        const cleaned = (query || "")
          .replace(/#/g, " ")
          .replace(/[\u2010\u2011\u2012\u2013\u2014]/g, "-")
          .trim();

        if (cacheRef.current.has(cleaned)) {
          setResults(cacheRef.current.get(cleaned) || []);
          setOpen((cacheRef.current.get(query) || []).length > 0);
          return;
        }
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const proxy = (import.meta as any).env?.VITE_PHOTON_PROXY_URL as string | undefined;
        const base = proxy || 'https://photon.komoot.io/api/';
        const url = `${base}?q=${encodeURIComponent(cleaned)}&lang=en&limit=5&countrycode=ca`;
        let feats: PhotonFeature[] = [];
        const fallbackToNominatim = async () => {
          const nomProxy = (import.meta as any).env?.VITE_NOMINATIM_PROXY_URL as string | undefined;
          const nomBase = nomProxy || 'https://nominatim.openstreetmap.org/search';
          const nomUrl = `${nomBase}?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(cleaned)}`;
          const res2 = await fetch(nomUrl, { headers: { "Accept": "application/json" }, signal: abortRef.current.signal });
          if (!res2.ok) throw new Error('nominatim_failed');
          const data2 = await res2.json();
          feats = (Array.isArray(data2) ? data2 : []).map((n: any) => ({ properties: {
            name: n.display_name,
            street: n.address?.road,
            housenumber: n.address?.house_number,
            city: n.address?.city || n.address?.town || n.address?.village,
            postcode: n.address?.postcode,
            state: n.address?.state,
            country: n.address?.country
          }}));
        };
        try {
          const res = await fetch(url, { headers: { "Accept": "application/json" }, signal: abortRef.current.signal });
          if (!res.ok) throw new Error('photon_failed');
          const data = await res.json();
          feats = (data?.features || []).slice(0, 5);
          // If Photon returned nothing, try fallback as well
          if (!feats || feats.length === 0) {
            await fallbackToNominatim();
          }
        } catch {
          // Fallback to Nominatim if Photon fails
          try { await fallbackToNominatim(); } catch {}
        }
        cacheRef.current.set(cleaned, feats);
        setResults(feats);
        setOpen(feats.length > 0);
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
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
      {open && (
        <Card id="addr-suggest" className="absolute z-50 mt-1 w-full max-h-56 overflow-auto" role="listbox">
          {normalized.length > 0 ? (
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
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results. You can continue typing the full address.</div>
          )}
        </Card>
      )}
      <div className="mt-1 text-[10px] text-muted-foreground">Powered by OpenStreetMap/Photon</div>
    </div>
  );
}


