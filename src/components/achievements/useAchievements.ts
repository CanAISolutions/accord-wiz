import { useCallback, useEffect, useMemo, useState } from "react";

export type Achievement = "jurisdiction" | "termsValid" | "finished";

function readFromStorage(): Achievement[] {
  try {
    return JSON.parse(localStorage.getItem("achievements") || "[]");
  } catch {
    return [];
  }
}

function writeToStorage(values: Achievement[]) {
  try {
    localStorage.setItem("achievements", JSON.stringify(values));
  } catch {}
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => readFromStorage());

  useEffect(() => {
    writeToStorage(achievements);
  }, [achievements]);

  const has = useCallback((a: Achievement) => achievements.includes(a), [achievements]);

  const add = useCallback((a: Achievement) => {
    setAchievements((prev) => (prev.includes(a) ? prev : [...prev, a]));
  }, []);

  const remove = useCallback((a: Achievement) => {
    setAchievements((prev) => prev.filter((x) => x !== a));
  }, []);

  const api = useMemo(() => ({ achievements, has, add, remove }), [achievements, has, add, remove]);
  return api;
}


