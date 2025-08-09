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
}

// Free, keyless address suggestions via Photon (OpenStreetMap) API.
// Endpoint: https://photon.komoot.io. Country-scoped to Canada.
export default function AddressAutocomplete({ value, onChange, placeholder }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

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

  const normalized = useMemo(() => {
    return results.map((f) => {
      const p = f.properties || {};
      const parts = [p.housenumber, p.street, p.city, p.state, p.postcode].filter(Boolean);
      const line = parts.join(", ");
      return { label: line || p.name || "", value: line || p.name || "" };
    }).filter((r) => r.label);
  }, [results]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="bg-background"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="addr-suggest"
      />
      {open && normalized.length > 0 && (
        <Card id="addr-suggest" className="absolute z-20 mt-1 w-full max-h-56 overflow-auto">
          <ul>
            {normalized.map((r, idx) => (
              <li key={`${r.value}-${idx}`}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-accent"
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


