import { getProvinceRules, validateTerms } from "@/lib/canadaRentalRules";
import { cn } from "@/lib/utils";

interface RightRulePanelProps {
  provinceCode?: string | null;
  rentAmount?: number;
  securityDeposit?: number;
  lateFeeAmount?: number;
  className?: string;
}

export default function RightRulePanel({ provinceCode, rentAmount, securityDeposit, lateFeeAmount, className }: RightRulePanelProps) {
  const rules = getProvinceRules(provinceCode || "");
  const validation = validateTerms(
    (provinceCode as any) || undefined,
    rentAmount,
    securityDeposit,
    lateFeeAmount
  );

  if (!rules) return null;

  return (
    <aside className={cn("rounded-lg border bg-card/50 p-4 text-sm", className)}>
      <div className="font-semibold text-foreground mb-2">What this step means legally in {rules.name}</div>
      <ul className="space-y-1 list-disc pl-4 text-muted-foreground">
        {rules.securityDeposit.allowed ? (
          <li>
            <span className="font-medium text-foreground">Required by law:</span> Security deposit caps {rules.securityDeposit.maxMonths ? `≤ ${rules.securityDeposit.maxMonths} month(s) of rent` : "apply"}. {rules.securityDeposit.notes || ""}
          </li>
        ) : (
          <li>
            <span className="font-medium text-foreground">Required by law:</span> Security/damage deposits are not permitted.
          </li>
        )}
        {rules.lateFees && (
          <li>
            <span className="font-medium text-foreground">Guidance:</span> {rules.lateFees.allowed ? `Late fees must follow policy${rules.lateFees.maxAmountCAD ? `; cap $${rules.lateFees.maxAmountCAD}` : ""}.` : "Avoid flat late fees in leases."}
          </li>
        )}
        {rules.petDeposit && (
          <li>
            <span className="font-medium text-foreground">Guidance:</span> {rules.petDeposit.allowed ? "Pet deposits may be allowed within caps." : "Separate pet deposits are generally not permitted."}
          </li>
        )}
      </ul>

      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="mt-3 space-y-1" aria-live="polite">
          {validation.errors.map((e, i) => (
            <div key={`vr-err-${i}`} className="text-red-600">• {e}</div>
          ))}
          {validation.warnings.map((w, i) => (
            <div key={`vr-warn-${i}`} className="text-muted-foreground">• {w}</div>
          ))}
        </div>
      )}
    </aside>
  );
}


