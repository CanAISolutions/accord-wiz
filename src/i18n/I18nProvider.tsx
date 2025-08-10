import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "fr";

type Dict = Record<string, Record<Lang, string>>;

const DICT: Dict = {
  "wizard.title": { en: "Rental Agreement Wizard", fr: "Assistant de bail" },
  "wizard.next": { en: "Next", fr: "Suivant" },
  "wizard.previous": { en: "Previous", fr: "Précédent" },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("locale.lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch {}
    return "en";
  });

  useEffect(() => {
    try { localStorage.setItem("locale.lang", lang); } catch {}
  }, [lang]);

  const t = (key: keyof typeof DICT) => DICT[key]?.[lang] ?? key;

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const t = (key: keyof typeof DICT) => DICT[key]?.en ?? (key as string);
    return { lang: "en" as const, setLang: () => {}, t };
  }
  return ctx;
}


