import { cn } from "@/lib/utils";

interface ComplianceChipProps {
  provinceCode?: string | null;
  hasErrors?: boolean;
  className?: string;
}

export function ComplianceChip({ provinceCode, hasErrors = false, className }: ComplianceChipProps) {
  const label = provinceCode ? provinceCode : "—";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        hasErrors ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900",
        className
      )}
      aria-live="polite"
    >
      <span className={cn("inline-block h-2 w-2 rounded-full", hasErrors ? "bg-amber-500" : "bg-emerald-500")} />
      {label} • {hasErrors ? "Needs attention" : "Act-aligned"}
    </span>
  );
}

export default ComplianceChip;


