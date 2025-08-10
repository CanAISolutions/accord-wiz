import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../RentalWizard";
import { getProvinceRules, validateTerms } from "@/lib/canadaRentalRules";
import { getProvinceTemplate } from "@/lib/pdf/provinceTemplates";
import { useMemo } from "react";
import InspectionChecklist from "./InspectionChecklist";
import RightRulePanel from "@/components/compliance/RightRulePanel";
import ClauseExplainer from "@/components/compliance/ClauseExplainer";
import { useAchievements } from "@/components/achievements/useAchievements";
import HelpPanel from "@/components/help/HelpPanel";

interface RentalTermsStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const RentalTermsStep = ({ data, updateData }: RentalTermsStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('terms', { [field]: value });
  };

  const numbers = {
    rent: parseFloat(data.terms.rentAmount || "0"),
    deposit: parseFloat(data.terms.securityDeposit || "0"),
    lateFee: parseFloat(data.terms.lateFeesAmount || "0"),
  };

  const { add, has } = useAchievements();
  const validation = useMemo(() => {
    const province = data.jurisdiction?.provinceCode as any;
    if (!province) return { warnings: [], errors: [] };
    const v = validateTerms(
      province,
      isFinite(numbers.rent) ? numbers.rent : undefined,
      isFinite(numbers.deposit) ? numbers.deposit : undefined,
      isFinite(numbers.lateFee) ? numbers.lateFee : undefined
    );
    if (v.errors.length === 0 && !has("termsValid")) {
      // Only award after a first successful validation pass
      add("termsValid");
    }
    return v;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.jurisdiction?.provinceCode, data.terms.rentAmount, data.terms.securityDeposit, data.terms.lateFeesAmount]);

  const provinceRules = getProvinceRules(data.jurisdiction?.provinceCode as any);
  const provinceTemplate = getProvinceTemplate(data.jurisdiction?.provinceCode as any);
  const isOntario = data.jurisdiction?.provinceCode === "ON";
  const isBC = data.jurisdiction?.provinceCode === "BC";
  const isNL = data.jurisdiction?.provinceCode === "NL";

  return (
    <div className="space-y-6">
      {provinceRules && (
        <div className="bg-accent/50 p-4 rounded-lg text-sm text-muted-foreground">
          <div className="font-medium text-foreground">Jurisdiction: {provinceRules.name}</div>
          {provinceRules.securityDeposit.allowed ? (
            <div>
              Security deposit max: {provinceRules.securityDeposit.maxMonths ? `${provinceRules.securityDeposit.maxMonths} month(s) of rent` : 'see notes'}. {provinceRules.securityDeposit.notes}
            </div>
          ) : (
            <div>Security/damage deposits not allowed. {provinceRules.securityDeposit.notes}</div>
          )}
          {provinceRules.lateFees?.notes && <div>Late fees: {provinceRules.lateFees.notes}{provinceRules.lateFees.maxAmountCAD ? ` (cap $${provinceRules.lateFees.maxAmountCAD})` : ''}</div>}
          {provinceTemplate.sections?.length > 0 && (
            <div className="mt-2 text-xs">
              <div className="text-foreground font-medium">This province’s standard terms include:</div>
              <ul className="list-disc pl-5">
                {provinceTemplate.sections.slice(0,2).map((s) => (
                  <li key={s.title}>{s.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="rent-amount">Monthly Rent Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="rent-amount"
              type="number"
              value={data.terms.rentAmount}
              onChange={(e) => handleChange('rentAmount', e.target.value)}
              placeholder="2500"
              className="bg-background pl-8"
            />
          </div>
        </div>

        {!isOntario && (
          <div className="space-y-2">
          <Label htmlFor="security-deposit">Security Deposit *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="security-deposit"
                type="number"
                value={data.terms.securityDeposit}
                onChange={(e) => handleChange('securityDeposit', e.target.value)}
                placeholder="2500"
                className="bg-background pl-8"
                aria-label="Security Deposit"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ClauseExplainer
                  title="Security deposit caps"
                  body="Caps vary by province (e.g., BC ≤ 0.5 months, NL ≤ 0.75 months). Overages are not enforceable."
                  linkHref="/docs/LEGAL_CHANGELOG.md"
                  linkLabel="Legal changelog"
                />
              </div>
            </div>
            {(isBC || isNL) && numbers.rent > 0 && (
              <p className="text-xs text-muted-foreground">Hint: Max ${isBC ? (0.5 * numbers.rent).toFixed(2) : isNL ? (0.75 * numbers.rent).toFixed(2) : ''} based on monthly rent.</p>
            )}
          </div>
        )}

        {/* Right-side legal panel */}
        <RightRulePanel
          provinceCode={data.jurisdiction?.provinceCode as any}
          rentAmount={numbers.rent}
          securityDeposit={numbers.deposit}
          lateFeeAmount={numbers.lateFee}
          className="md:col-span-1"
        />
      </div>

      {isOntario && (
        <div className="space-y-2">
          <Label htmlFor="rent-deposit">Rent Deposit (Last Month’s Rent)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="rent-deposit"
              type="number"
              value={(data as any).terms.rentDeposit || ""}
              onChange={(e) => updateData('terms', { ...(data.terms as any), rentDeposit: e.target.value })}
              placeholder="1800"
              className="bg-background pl-8"
              aria-label="Rent Deposit (Last Month’s Rent)"
            />
          </div>
          <p className="text-xs text-muted-foreground">Ontario allows a rent deposit up to one month’s rent, with interest at the guideline. Security/damage deposits and pet deposits are not allowed.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lease-start">Lease Start Date *</Label>
          <Input
            id="lease-start"
            type="date"
            value={data.terms.leaseStart}
            onChange={(e) => handleChange('leaseStart', e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lease-end">Lease End Date *</Label>
          <Input
            id="lease-end"
            type="date"
            value={data.terms.leaseEnd}
            onChange={(e) => handleChange('leaseEnd', e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label id="label-rent-due" htmlFor="rent-due">Rent Due Date Each Month *</Label>
            <Select onValueChange={(value) => handleChange('rentDueDate', value)} value={data.terms.rentDueDate}>
          <SelectTrigger id="rent-due" data-testid="rent-due" aria-labelledby="label-rent-due rent-due" className="bg-background">
            <SelectValue placeholder="Select due date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st">1st of the month</SelectItem>
            <SelectItem value="5th">5th of the month</SelectItem>
            <SelectItem value="15th">15th of the month</SelectItem>
            <SelectItem value="last">Last day of the month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-foreground mb-4">Late Fee Terms</h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <Label htmlFor="late-fees-amount">Late Fee Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="late-fees-amount"
                type="number"
                value={data.terms.lateFeesAmount}
                onChange={(e) => handleChange('lateFeesAmount', e.target.value)}
                placeholder="100"
                className="bg-background pl-8"
                disabled={isOntario}
                aria-label="Late Fee Amount"
              />
            </div>
            {!isOntario && (
              <div className="absolute right-2 top-7">
                <ClauseExplainer
                  title="Late fee guidance"
                  body="Fees must be reasonable and disclosed; some provinces set caps or disallow flat fees."
                  linkHref="/docs/LEGAL_CHANGELOG.md"
                  linkLabel="Legal changelog"
                />
              </div>
            )}
            {isOntario && (
              <p className="text-xs text-muted-foreground">Ontario does not allow flat late fees in leases. Do not set a late fee.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grace-period">Grace Period (Days)</Label>
            <Select onValueChange={(value) => handleChange('lateFeesGracePeriod', value)} value={data.terms.lateFeesGracePeriod}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select grace period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="10">10 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="bg-accent/50 p-4 rounded-lg text-sm">
          {validation.errors.length > 0 && (
            <div className="text-red-600 space-y-1">
              {validation.errors.map((e, i) => (
                <div key={`err-${i}`}>• {e}</div>
              ))}
            </div>
          )}
          {validation.warnings.length > 0 && (
            <div className="text-muted-foreground mt-2 space-y-1">
              {validation.warnings.map((w, i) => (
                <div key={`warn-${i}`}>• {w}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <InspectionChecklist />
      <HelpPanel />
    </div>
  );
};

export default RentalTermsStep;