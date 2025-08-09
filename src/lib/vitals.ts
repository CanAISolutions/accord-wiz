type MetricName = 'LCP' | 'CLS' | 'FID' | 'INP';

interface VitalsPayload {
  name: MetricName;
  value: number;
  id: string;
  navigationType?: string;
}

function sendVitals(metric: VitalsPayload) {
  const endpoint = (import.meta as any).env?.VITE_VITALS_ENDPOINT as string | undefined;
  if (!endpoint) {
    // Fallback: log to console in development
    if (import.meta.env.DEV) console.debug('[vitals]', metric);
    return;
  }
  try {
    navigator.sendBeacon?.(endpoint, JSON.stringify(metric));
  } catch {
    // no-op
  }
}

export function initVitals(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number; id?: string };
      if (!last) return;
      sendVitals({ name: 'LCP', value: last.startTime, id: last.name || 'lcp' });
    }).observe({ type: 'largest-contentful-paint', buffered: true } as PerformanceObserverInit);

    // Cumulative Layout Shift
    let cls = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any) {
        if (!entry.hadRecentInput) cls += entry.value || 0;
      }
      sendVitals({ name: 'CLS', value: cls, id: 'cls' });
    }).observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit);

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const first = entryList.getEntries()[0] as any;
      if (!first) return;
      sendVitals({ name: 'FID', value: first.processingStart - first.startTime, id: 'fid' });
    }).observe({ type: 'first-input', buffered: true } as PerformanceObserverInit);
  } catch {
    // older browsers
  }
}


