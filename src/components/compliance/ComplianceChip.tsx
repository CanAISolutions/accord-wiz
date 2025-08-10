import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ComplianceChipProps {
  provinceCode?: string | null;
  hasErrors?: boolean;
  className?: string;
}

export function ComplianceChip({ provinceCode, hasErrors = false, className }: ComplianceChipProps) {
  const label = provinceCode ? provinceCode : "—";
  const reduceMotion = typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        hasErrors ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900",
        className
      )}
      aria-live="polite"
      role="status"
      initial={reduceMotion ? undefined : { scale: 0.9, opacity: 0.8 }}
      animate={reduceMotion ? undefined : {
        scale: 1,
        opacity: 1,
        boxShadow: hasErrors
          ? "0 0 0 0 rgba(234,179,8,0.6)"
          : "0 0 0 0 rgba(16,185,129,0.4)",
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      transition={reduceMotion ? undefined : { type: "spring", stiffness: 240, damping: 15 }}
    >
      <motion.span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          hasErrors ? "bg-amber-500" : "bg-emerald-500"
        )}
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
        transition={reduceMotion ? undefined : {
          repeat: hasErrors ? Infinity : 0,
          repeatType: "loop",
          duration: 1.2,
          ease: "easeInOut",
        }}
      />
      {label} • {hasErrors ? "Needs attention" : "Act-aligned"}
    </motion.span>
  );
}

export default ComplianceChip;


