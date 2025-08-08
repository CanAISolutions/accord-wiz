import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../RentalWizard";

interface PropertyInfoStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const PropertyInfoStep = ({ data, updateData }: PropertyInfoStepProps) => {
  const handleChange = (field: string, value: string) => {
    updateData('property', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="property-address">Property Address *</Label>
        <Textarea
          id="property-address"
          value={data.property.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="456 Rental Lane, Unit 2B, City, State, ZIP Code"
          rows={3}
          className="bg-background"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label id="label-property-type" htmlFor="property-type">Property Type *</Label>
        <Select onValueChange={(value) => handleChange('type', value)} value={data.property.type}>
          <SelectTrigger id="property-type" data-testid="property-type" aria-labelledby="label-property-type property-type" className="bg-background">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">Single Family House</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="condo">Condominium</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label id="label-bedrooms" htmlFor="bedrooms">Number of Bedrooms *</Label>
          <Select onValueChange={(value) => handleChange('bedrooms', value)} value={data.property.bedrooms}>
            <SelectTrigger id="bedrooms" data-testid="bedrooms" aria-labelledby="label-bedrooms bedrooms" className="bg-background">
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4 Bedrooms</SelectItem>
              <SelectItem value="5+">5+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label id="label-bathrooms" htmlFor="bathrooms">Number of Bathrooms *</Label>
          <Select onValueChange={(value) => handleChange('bathrooms', value)} value={data.property.bathrooms}>
            <SelectTrigger id="bathrooms" data-testid="bathrooms" aria-labelledby="label-bathrooms bathrooms" className="bg-background">
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bathroom</SelectItem>
              <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
              <SelectItem value="2">2 Bathrooms</SelectItem>
              <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
              <SelectItem value="3">3 Bathrooms</SelectItem>
              <SelectItem value="3+">3+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label id="label-furnished" htmlFor="furnished">Furnished Status *</Label>
          <Select onValueChange={(value) => handleChange('furnished', value)} value={data.property.furnished}>
            <SelectTrigger id="furnished" data-testid="furnished" aria-labelledby="label-furnished furnished" className="bg-background">
              <SelectValue placeholder="Select furnished status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
              <SelectItem value="furnished">Fully Furnished</SelectItem>
              <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label id="label-parking" htmlFor="parking">Parking Information</Label>
        <Select onValueChange={(value) => handleChange('parking', value)} value={data.property.parking}>
          <SelectTrigger id="parking" data-testid="parking" aria-labelledby="label-parking parking" className="bg-background">
            <SelectValue placeholder="Select parking option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Parking</SelectItem>
            <SelectItem value="street">Street Parking</SelectItem>
            <SelectItem value="driveway">Driveway</SelectItem>
            <SelectItem value="garage-1">1 Car Garage</SelectItem>
            <SelectItem value="garage-2">2 Car Garage</SelectItem>
            <SelectItem value="covered">Covered Parking</SelectItem>
            <SelectItem value="lot">Parking Lot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-accent/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Property Description:</strong> Accurate property details help ensure the rental agreement
          clearly defines what is being rented and helps prevent disputes later.
        </p>
      </div>
    </div>
  );
};

export default PropertyInfoStep;