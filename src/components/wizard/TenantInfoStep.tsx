import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { WizardData } from "../RentalWizard";

interface TenantInfoStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const TenantInfoStep = ({ data, updateData }: TenantInfoStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('tenant', { [field]: value });
  };

  const phoneOrEmailFilled = useMemo(() => Boolean(data.tenant.phone) || Boolean(data.tenant.email), [data.tenant.phone, data.tenant.email]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tenant-name">Full Name *</Label>
          <Input
            id="tenant-name"
            value={data.tenant.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Jane Doe"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenant-phone">Phone Number {phoneOrEmailFilled ? '' : '*'}
          </Label>
          <Input
            id="tenant-phone"
            type="tel"
            value={data.tenant.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 987-6543"
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant-email">Email Address {phoneOrEmailFilled ? '' : '*'}
        </Label>
        <Input
          id="tenant-email"
          type="email"
          value={data.tenant.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="jane@example.com"
          className="bg-background"
        />
      </div>

      <div className="border-t pt-6">
        <fieldset>
          <legend className="font-semibold text-foreground mb-4">Emergency Contact Information</legend>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="emergency-contact">Emergency Contact Name *</Label>
            <Input
              id="emergency-contact"
              value={data.tenant.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact full name"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency-phone">Emergency Contact Phone *</Label>
            <Input
              id="emergency-phone"
              type="tel"
              value={data.tenant.emergencyPhone}
              onChange={(e) => handleChange('emergencyPhone', e.target.value)}
              placeholder="(555) 111-2222"
              className="bg-background"
            />
          </div>
        </div>
        </fieldset>
      </div>

      <div className="bg-accent/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Privacy Notice:</strong> Tenant information will be used solely for the rental agreement
          and property management purposes. Emergency contact information is required for safety and
          communication purposes.
        </p>
      </div>
    </div>
  );
};

export default TenantInfoStep;