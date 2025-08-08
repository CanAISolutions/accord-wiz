import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../RentalWizard";

interface RentalTermsStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const RentalTermsStep = ({ data, updateData }: RentalTermsStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('terms', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
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
            />
          </div>
        </div>
      </div>

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
        <Label htmlFor="rent-due-date">Rent Due Date Each Month *</Label>
        <Select onValueChange={(value) => handleChange('rentDueDate', value)} value={data.terms.rentDueDate}>
          <SelectTrigger className="bg-background">
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
          <div className="space-y-2">
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
              />
            </div>
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

      <div className="bg-accent/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Legal Note:</strong> Late fee amounts and grace periods must comply with your state's rental laws. 
          Some states limit late fees to a percentage of rent or require specific grace periods.
        </p>
      </div>
    </div>
  );
};

export default RentalTermsStep;