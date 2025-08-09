export type Draft = {
  id: string;
  name: string;
  updatedAt: string;
  data: unknown;
};

const KEY = 'canai.drafts.v1';

export function listDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

export function saveDraft(name: string, data: unknown, id?: string): Draft {
  const drafts = listDrafts();
  const now = new Date().toISOString();
  const draft: Draft = { id: id || crypto.randomUUID(), name, updatedAt: now, data };
  const next = drafts.filter(d => d.id !== draft.id).concat(draft).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  localStorage.setItem(KEY, JSON.stringify(next));
  return draft;
}

export function deleteDraft(id: string): void {
  const drafts = listDrafts().filter(d => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

export function renameDraft(id: string, name: string): void {
  const drafts = listDrafts().map(d => d.id === id ? { ...d, name, updatedAt: new Date().toISOString() } : d);
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

export function exportDrafts(): string {
  return JSON.stringify(listDrafts(), null, 2);
}

export function importDrafts(json: string): void {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return;
    const merged = mergeDrafts(listDrafts(), arr);
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {}
}

function mergeDrafts(a: Draft[], b: Draft[]): Draft[] {
  const map = new Map<string, Draft>();
  [...a, ...b].forEach(d => {
    const prev = map.get(d.id);
    if (!prev || d.updatedAt > prev.updatedAt) map.set(d.id, d);
  });
  return Array.from(map.values()).sort((x,y) => y.updatedAt.localeCompare(x.updatedAt));
}


