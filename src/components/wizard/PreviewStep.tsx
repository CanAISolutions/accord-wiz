import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, PenLine } from "lucide-react";
import { WizardData } from "../RentalWizard";
import { getProvinceRules } from "@/lib/canadaRentalRules";
import SignaturePad from "@/components/signatures/SignaturePad";
import { useState } from "react";
import { buildAgreementPdf } from "@/lib/pdf/buildAgreement";
import { buildOntarioStandardLeasePdf, getOntarioLeaseDeepLink } from "@/lib/pdf/ontarioStandardLease";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface PreviewStepProps {
  data: WizardData;
  updateData: (section: keyof WizardData, data: any) => void;
}

const PreviewStep = ({ data }: PreviewStepProps) => {
  const [landlordSig, setLandlordSig] = useState<string | null>(null);
  const [tenantSig, setTenantSig] = useState<string | null>(null);

  const handleDownloadTxt = () => {
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

  const requirePayment = () => {
    const flag = localStorage.getItem('canai.payment.ok');
    return flag !== 'true';
  };

  const handleGeneratePdf = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      location.hash = '#/signin';
      return;
    }
    if (requirePayment()) {
      location.hash = '#/pay';
      return;
    }
    const now = new Date().toISOString();
    const bytes = await buildAgreementPdf({ data, signatures: [
      { role: 'landlord', name: data.landlord.name, imageDataUrl: landlordSig || undefined, signedAtIso: now },
      { role: 'tenant', name: data.tenant.name, imageDataUrl: tenantSig || undefined, signedAtIso: now },
    ]});
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rental_Agreement_${data.tenant.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleComposeEmail = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { location.hash = '#/signin'; return; }
    if (requirePayment()) { location.hash = '#/pay'; return; }
    const prov = (data.jurisdiction?.provinceCode as any) || '';
    const subject = encodeURIComponent(`Rental Agreement for ${data.property.address || 'Property'}`);
    const lines: string[] = [];
    lines.push(`Province: ${prov || 'N/A'}`);
    lines.push(`Landlord: ${data.landlord.name}`);
    lines.push(`Tenant: ${data.tenant.name}`);
    lines.push(`Rent: $${data.terms.rentAmount}/month`);
    if (prov === 'ON') {
      lines.push(`Rent Deposit (L.M.R.): $${(data.terms as any).rentDeposit || '0'} (Security deposit not permitted)`);
      lines.push(`Ontario Standard Lease: ${getOntarioLeaseDeepLink()}`);
    } else {
      lines.push(`Security Deposit: $${data.terms.securityDeposit || '0'}`);
    }
    lines.push(`Lease: ${data.terms.leaseStart} to ${data.terms.leaseEnd}`);
    lines.push('—');
    lines.push('Attached: PDF lease. If not attached, please reply and I will resend.');
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownloadRtf = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { location.hash = '#/signin'; return; }
    if (requirePayment()) { location.hash = '#/pay'; return; }
    const lines: string[] = [];
    lines.push("{\\rtf1\\ansi");
    lines.push(`\\b Residential Rental Agreement\\b0\\line`);
    lines.push(`Province: ${(data.jurisdiction?.provinceCode as any) || ''}\\line`);
    lines.push(`Landlord: ${data.landlord.name}\\line Tenant: ${data.tenant.name}\\line`);
    lines.push(`Property: ${data.property.address}\\line`);
    lines.push(`Rent: $${data.terms.rentAmount}/month\\line`);
    if (data.jurisdiction?.provinceCode === 'ON') {
      lines.push(`Rent Deposit (L.M.R.): $${(data.terms as any).rentDeposit || '0'}\\line`);
      lines.push(`Security Deposit: Not permitted\\line`);
    } else {
      lines.push(`Security Deposit: $${data.terms.securityDeposit || '0'}\\line`);
    }
    lines.push(`Lease: ${data.terms.leaseStart} to ${data.terms.leaseEnd}\\line`);
    lines.push("}");
    const blob = new Blob([lines.join('\n')], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rental_Agreement_${data.tenant.name.replace(/\s+/g, '_')}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadIcs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { location.hash = '#/signin'; return; }
    const dt = (d: string) => d?.replaceAll('-', '') + 'T090000Z';
    const uid = crypto.randomUUID();
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CANai//Lease//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, '').replace('.000Z','Z')}`,
      `DTSTART:${dt(data.terms.leaseStart)}`,
      `DTEND:${dt(data.terms.leaseEnd)}`,
      `SUMMARY:Lease term for ${data.property.address}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lease-term.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const province = data.jurisdiction?.provinceCode as any;
  const isQuebec = province === 'QC';
  const rules = getProvinceRules(province);

  return (
    <div className="space-y-6">
      {isQuebec && (
        <Alert className="border-amber-300 bg-amber-50">
          <AlertTitle>Québec requires the official TAL lease form</AlertTitle>
          <AlertDescription>
            The Tribunal administratif du logement (TAL) lease is mandatory. We provide a helper preview, but you must complete the official form. <a className="underline" href="https://www.tal.gouv.qc.ca/" target="_blank" rel="noreferrer">Visit TAL</a>.
          </AlertDescription>
        </Alert>
      )}
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
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Readable Summary</TabsTrigger>
              <TabsTrigger value="legal">Legal PDF View</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-2">
              <p><strong>Monthly Rent:</strong> ${data.terms.rentAmount}</p>
              {data.jurisdiction?.provinceCode === 'ON' ? (
                <p><strong>Rent Deposit (L.M.R.):</strong> ${(data as any).terms?.rentDeposit || '0'} (Security deposit not permitted)</p>
              ) : (
                <p><strong>Security Deposit:</strong> ${data.terms.securityDeposit}</p>
              )}
              <p><strong>Lease Period:</strong> {data.terms.leaseStart} to {data.terms.leaseEnd}</p>
              <p><strong>Rent Due:</strong> {data.terms.rentDueDate}</p>
              {data.terms.lateFeesAmount && (
                <p><strong>Late Fee:</strong> ${data.terms.lateFeesAmount} after {data.terms.lateFeesGracePeriod} grace period</p>
              )}
              <p className="text-xs text-muted-foreground">If any term conflicts with law, the Act prevails. {(() => {
                const r = getProvinceRules((data.jurisdiction?.provinceCode as any) || undefined);
                return r?.lastUpdated ? `Rules last updated: ${r.lastUpdated}` : '';
              })()}</p>
              {data.jurisdiction?.provinceCode === 'ON' && (
                <a className="underline text-sm" href={getOntarioLeaseDeepLink()} target="_blank" rel="noreferrer">Open Ontario Standard Lease</a>
              )}
            </TabsContent>
            <TabsContent value="legal">
              <div className="text-sm text-muted-foreground">Use the button below to generate a legally formatted PDF. Summary content above mirrors the PDF terms for readability.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Signatures */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><PenLine className="h-4 w-4"/>Signature Capture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Landlord</div>
            <SignaturePad onChange={setLandlordSig} />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Tenant</div>
            <SignaturePad onChange={setTenantSig} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-center space-y-4">
        <Button
          onClick={handleGeneratePdf}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-legal"
          disabled={isQuebec}
        >
          <Download className="h-5 w-5 mr-2" />
          Generate PDF
        </Button>

        <div>
          <Button variant="outline" onClick={handleDownloadTxt}>Download Text Version</Button>
          <Button variant="ghost" className="ml-2" onClick={handleComposeEmail}>Compose Email</Button>
          <Button variant="ghost" className="ml-2" onClick={handleDownloadRtf}>Download Word (RTF)</Button>
          <Button variant="ghost" className="ml-2" onClick={handleDownloadIcs}>Add to Calendar</Button>
        </div>

        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          The Act prevails. This generator provides general legal information only and not legal advice. For Ontario, the Standard Form of Lease is required. {data.jurisdiction?.provinceCode === 'ON' ? (
            <a className="underline" href={getOntarioLeaseDeepLink()} target="_blank" rel="noreferrer">Open Ontario Standard Lease</a>
          ) : null}
        </p>
      </div>
    </div>
  );
};

const generateRentalAgreement = (data: WizardData): string => {
  const currentDate = new Date().toLocaleDateString();
  const prov = getProvinceRules((data.jurisdiction?.provinceCode as any) || undefined);

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

9. JURISDICTIONAL COMPLIANCE
This agreement is intended for ${prov ? prov.name : 'the applicable jurisdiction in Canada'}. Both parties agree to comply with all applicable provincial/territorial and local residential tenancy laws.

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