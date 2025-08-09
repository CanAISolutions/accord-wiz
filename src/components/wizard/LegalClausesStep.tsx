import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WizardData } from "../RentalWizard";
import { useMemo, useEffect } from "react";
import { getProvinceRules } from "@/lib/canadaRentalRules";

interface LegalClausesStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const LegalClausesStep = ({ data, updateData }: LegalClausesStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('clauses', { [field]: value });
  };

  const province = data.jurisdiction?.provinceCode as any;
  const rules = useMemo(() => getProvinceRules(province), [province]);

  // Prefill mandatory editable clauses with safe defaults (once, if empty)
  useEffect(() => {
    const actDefault = "If any term conflicts with the applicable residential tenancies law, the Act prevails over this agreement.";
    const hrDefault = "The landlord and tenant must comply with human rights laws. Service animals are not pets and are permitted as required by law.";
    const hasAct = Boolean((data.clauses as any).actPrevailsClause);
    const hasHr = Boolean((data.clauses as any).humanRightsClause);
    if (!hasAct || !hasHr) {
      updateData('clauses', {
        ...(hasAct ? {} : { actPrevailsClause: actDefault }),
        ...(hasHr ? {} : { humanRightsClause: hrDefault })
      });
    }
    // Only run when province changes or on first mount; avoids overwriting user edits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pets-allowed">Pet Policy *</Label>
          <Select onValueChange={(value) => handleChange('petsAllowed', value)} value={data.clauses.petsAllowed}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select pet policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-pets">No Pets Allowed</SelectItem>
              <SelectItem value="cats-only">Cats Only</SelectItem>
              <SelectItem value="dogs-only">Dogs Only</SelectItem>
              <SelectItem value="cats-dogs">Cats and Dogs Allowed</SelectItem>
              <SelectItem value="all-pets">All Pets Allowed</SelectItem>
              <SelectItem value="approval">Pets with Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smoking-allowed">Smoking Policy *</Label>
          <Select onValueChange={(value) => handleChange('smokingAllowed', value)} value={data.clauses.smokingAllowed}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select smoking policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-smoking">No Smoking</SelectItem>
              <SelectItem value="outdoor-only">Outdoor Only</SelectItem>
              <SelectItem value="designated-areas">Designated Areas Only</SelectItem>
              <SelectItem value="allowed">Smoking Allowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subletting-allowed">Subletting Policy *</Label>
        <Select onValueChange={(value) => handleChange('sublettingAllowed', value)} value={data.clauses.sublettingAllowed}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select subletting policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-allowed">Not Allowed</SelectItem>
            <SelectItem value="with-approval">With Written Approval</SelectItem>
            <SelectItem value="allowed">Allowed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maintenance-responsibility">Maintenance Responsibility *</Label>
        <Select onValueChange={(value) => handleChange('maintenanceResponsibility', value)} value={data.clauses.maintenanceResponsibility}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select maintenance policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="landlord-all">Landlord Responsible for All</SelectItem>
            <SelectItem value="tenant-minor">Tenant Minor Repairs, Landlord Major</SelectItem>
            <SelectItem value="shared">Shared Responsibility</SelectItem>
            <SelectItem value="tenant-all">Tenant Responsible for All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="early-termination">Early Termination Policy *</Label>
        <Select onValueChange={(value) => handleChange('earlyTermination', value)} value={data.clauses.earlyTermination}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select early termination policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-allowed">Not Allowed</SelectItem>
            <SelectItem value="30-day-notice">30 Day Notice Required</SelectItem>
            <SelectItem value="60-day-notice">60 Day Notice Required</SelectItem>
            <SelectItem value="penalty-fee">Allowed with Penalty Fee</SelectItem>
            <SelectItem value="flexible">Flexible Terms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="renewal-terms">Lease Renewal Terms</Label>
        <Textarea
          id="renewal-terms"
          value={data.clauses.renewalTerms}
          onChange={(e) => handleChange('renewalTerms', e.target.value)}
          placeholder="Specify automatic renewal terms, notice periods, or renewal options..."
          rows={3}
          className="bg-background"
        />
      </div>

      {/* Mandatory clauses (editable) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="act-prevails">Mandatory Clause: The Act Prevails *</Label>
          <Textarea
            id="act-prevails"
            value={(data.clauses as any).actPrevailsClause || ""}
            onChange={(e) => handleChange('actPrevailsClause' as any, e.target.value)}
            rows={3}
            className="bg-background"
            placeholder="If any term conflicts with the applicable residential tenancies law, the Act prevails over this agreement."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="human-rights">Mandatory Clause: Human Rights & Service Animals *</Label>
          <Textarea
            id="human-rights"
            value={(data.clauses as any).humanRightsClause || ""}
            onChange={(e) => handleChange('humanRightsClause' as any, e.target.value)}
            rows={3}
            className="bg-background"
            placeholder="The landlord and tenant must comply with human rights laws. Service animals are not pets and are permitted as required by law."
          />
        </div>
      </div>

      <div className="bg-accent/50 p-4 rounded-lg space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Human Rights & Service Animals:</strong> Rules prohibit discrimination. Service animals are not pets.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Act Prevails:</strong> If any clause conflicts with the applicable residential tenancies law, the Act prevails.
        </p>
        {rules?.petDeposit?.allowed === false && (
          <p className="text-xs text-muted-foreground">{rules.name}: Separate pet deposits are not permitted. Damage cannot be pre-charged via a pet deposit.</p>
        )}
      </div>
    </div>
  );
};

export default LegalClausesStep;