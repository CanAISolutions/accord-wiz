import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVINCES, ProvinceCode } from "@/lib/canadaRentalRules";
import { WizardData } from "../RentalWizard";
import { useAchievements } from "@/components/achievements/useAchievements";

interface JurisdictionStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const JurisdictionStep = ({ data, updateData }: JurisdictionStepProps) => {
  const { add, has } = useAchievements();
  const handleChange = (code: ProvinceCode) => {
    updateData("jurisdiction", { provinceCode: code });
    if (!has("jurisdiction")) add("jurisdiction");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label id="label-province" htmlFor="province">Province or Territory *</Label>
        <Select
          value={data.jurisdiction?.provinceCode || ""}
          onValueChange={(value) => handleChange(value as ProvinceCode)}
        >
          <SelectTrigger
            className="bg-background"
            id="province"
            aria-labelledby="label-province province"
            data-testid="province-select"
          >
            <SelectValue placeholder="Select a province or territory" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Selecting the correct jurisdiction ensures deposits, late fees, and clauses comply with local residential tenancy rules.
      </p>
    </div>
  );
};

export default JurisdictionStep;

