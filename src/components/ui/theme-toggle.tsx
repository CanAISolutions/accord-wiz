import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const cls = document.documentElement.classList;
    if (dark) cls.add("dark");
    else cls.remove("dark");
    try { localStorage.setItem("theme.dark", JSON.stringify(dark)); } catch {}
  }, [dark]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("theme.dark") || "null");
      if (typeof saved === "boolean") setDark(saved);
    } catch {}
  }, []);

  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm hover:bg-accent"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;


