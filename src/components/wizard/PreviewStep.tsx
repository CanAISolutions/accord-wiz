import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileText } from "lucide-react";
import { WizardData } from "../RentalWizard";

interface PreviewStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const PreviewStep = ({ data }: PreviewStepProps) => {
  const handleDownload = () => {
    // Create a comprehensive rental agreement document
    const agreement = generateRentalAgreement(data);
    const blob = new Blob([agreement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rental_Agreement_${data.tenant.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Agreement Preview</h3>
        <p className="text-muted-foreground">
          Review your rental agreement details before generating the final document.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Landlord Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {data.landlord.name}</p>
            <p><strong>Phone:</strong> {data.landlord.phone}</p>
            <p><strong>Email:</strong> {data.landlord.email}</p>
            <p><strong>Address:</strong> {data.landlord.address}</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {data.tenant.name}</p>
            <p><strong>Phone:</strong> {data.tenant.phone}</p>
            <p><strong>Email:</strong> {data.tenant.email}</p>
            <p><strong>Emergency Contact:</strong> {data.tenant.emergencyContact}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Address:</strong> {data.property.address}</p>
          <p><strong>Type:</strong> {data.property.type}</p>
          <p><strong>Bedrooms:</strong> {data.property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {data.property.bathrooms}</p>
          <p><strong>Furnished:</strong> {data.property.furnished}</p>
          <p><strong>Parking:</strong> {data.property.parking}</p>
        </CardContent>
      </Card>

      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg">Rental Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Monthly Rent:</strong> ${data.terms.rentAmount}</p>
          <p><strong>Security Deposit:</strong> ${data.terms.securityDeposit}</p>
          <p><strong>Lease Period:</strong> {data.terms.leaseStart} to {data.terms.leaseEnd}</p>
          <p><strong>Rent Due:</strong> {data.terms.rentDueDate}</p>
          <p><strong>Late Fee:</strong> ${data.terms.lateFeesAmount} after {data.terms.lateFeesGracePeriod} grace period</p>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-center space-y-4">
        <Button 
          onClick={handleDownload}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-legal"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Rental Agreement
        </Button>
        
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          This agreement includes all standard legal clauses and complies with general rental law requirements. 
          We recommend having the document reviewed by a local attorney to ensure compliance with your specific 
          state and local regulations.
        </p>
      </div>
    </div>
  );
};

const generateRentalAgreement = (data: WizardData): string => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
RESIDENTIAL RENTAL AGREEMENT

This Rental Agreement is made on ${currentDate}, between:

LANDLORD:
Name: ${data.landlord.name}
Address: ${data.landlord.address}
Phone: ${data.landlord.phone}
Email: ${data.landlord.email}

TENANT:
Name: ${data.tenant.name}
Phone: ${data.tenant.phone}
Email: ${data.tenant.email}
Emergency Contact: ${data.tenant.emergencyContact} - ${data.tenant.emergencyPhone}

PROPERTY INFORMATION:
Address: ${data.property.address}
Type: ${data.property.type}
Bedrooms: ${data.property.bedrooms}
Bathrooms: ${data.property.bathrooms}
Furnished Status: ${data.property.furnished}
Parking: ${data.property.parking}

RENTAL TERMS:
Monthly Rent: $${data.terms.rentAmount}
Security Deposit: $${data.terms.securityDeposit}
Lease Start Date: ${data.terms.leaseStart}
Lease End Date: ${data.terms.leaseEnd}
Rent Due Date: ${data.terms.rentDueDate}
Late Fee: $${data.terms.lateFeesAmount} after ${data.terms.lateFeesGracePeriod} day grace period

TERMS AND CONDITIONS:

1. RENT PAYMENT
Tenant agrees to pay rent in the amount of $${data.terms.rentAmount} per month, due on the ${data.terms.rentDueDate} of each month. Late fees of $${data.terms.lateFeesAmount} will be charged after the ${data.terms.lateFeesGracePeriod} day grace period.

2. SECURITY DEPOSIT
A security deposit of $${data.terms.securityDeposit} is required and will be held to cover any damages beyond normal wear and tear.

3. PET POLICY
${data.clauses.petsAllowed}

4. SMOKING POLICY
${data.clauses.smokingAllowed}

5. SUBLETTING
${data.clauses.sublettingAllowed}

6. MAINTENANCE RESPONSIBILITY
${data.clauses.maintenanceResponsibility}

7. EARLY TERMINATION
${data.clauses.earlyTermination}

8. RENEWAL TERMS
${data.clauses.renewalTerms || 'Terms to be negotiated prior to lease expiration.'}

9. LEGAL COMPLIANCE
This agreement shall be governed by and construed in accordance with the laws of the state where the property is located. Both parties agree to comply with all applicable federal, state, and local laws and regulations.

10. SIGNATURES
By signing below, both parties agree to the terms and conditions outlined in this rental agreement.

Landlord Signature: _________________________ Date: _________
${data.landlord.name}

Tenant Signature: _________________________ Date: _________
${data.tenant.name}

Note: This is a basic rental agreement template. Please consult with a local attorney to ensure compliance with your specific state and local rental laws and regulations.
`;
};

export default PreviewStep;