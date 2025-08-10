import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";
import { WizardData } from "../RentalWizard";

interface LandlordInfoStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const LandlordInfoStep = ({ data, updateData }: LandlordInfoStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('landlord', { [field]: value });
  };

  const phoneOrEmailFilled = useMemo(() => Boolean(data.landlord.phone) || Boolean(data.landlord.email), [data.landlord.phone, data.landlord.email]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="landlord-name">Full Name *</Label>
          <Input
            id="landlord-name"
            value={data.landlord.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Smith"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="landlord-phone">Phone Number {phoneOrEmailFilled ? '' : '*'}
          </Label>
          <Input
            id="landlord-phone"
            type="tel"
            value={data.landlord.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="landlord-email">Email Address {phoneOrEmailFilled ? '' : '*'}
        </Label>
        <Input
          id="landlord-email"
          type="email"
          value={data.landlord.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="landlord-address">Mailing Address *</Label>
        <Textarea
          id="landlord-address"
          value={data.landlord.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Main Street, City, State, ZIP Code"
          rows={3}
          className="bg-background"
        />
      </div>

      <div className="bg-accent/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This information will appear on the rental agreement as the property owner/landlord.
          Ensure all details are accurate and up-to-date.
        </p>
      </div>
    </div>
  );
};

export default LandlordInfoStep;