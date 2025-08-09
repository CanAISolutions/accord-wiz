import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LandlordInfoStep from "./wizard/LandlordInfoStep";
import TenantInfoStep from "./wizard/TenantInfoStep";
import PropertyInfoStep from "./wizard/PropertyInfoStep";
import RentalTermsStep from "./wizard/RentalTermsStep";
import LegalClausesStep from "./wizard/LegalClausesStep";
import PreviewStep from "./wizard/PreviewStep";
import { ProvinceCode } from "@/lib/canadaRentalRules";
import JurisdictionStep from "./wizard/JurisdictionStep";
import { useStepValidity, getStepValidity } from "@/lib/hooks/useStepValidity";
import ComplianceChip from "@/components/compliance/ComplianceChip";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import JurisdictionStep from "./wizard/JurisdictionStep";
import { Check } from "lucide-react";

interface RentalWizardProps {
  onBack: () => void;
}

export interface WizardData {
  jurisdiction?: {
    provinceCode: ProvinceCode | "";
  };
  landlord: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  tenant: {
    name: string;
    phone: string;
    email: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  property: {
    address: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    furnished: string;
    parking: string;
  };
  terms: {
    rentAmount: string;
    securityDeposit: string;
    leaseStart: string;
    leaseEnd: string;
    rentDueDate: string;
    lateFeesAmount: string;
    lateFeesGracePeriod: string;
  };
  clauses: {
    petsAllowed: string;
    smokingAllowed: string;
    sublettingAllowed: string;
    maintenanceResponsibility: string;
    earlyTermination: string;
    renewalTerms: string;
  };
}

const RentalWizard = ({ onBack }: RentalWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showProvinceModal, setShowProvinceModal] = useState(true);
  const [wizardData, setWizardData] = useState<WizardData>({
    jurisdiction: { provinceCode: "" },
    landlord: { name: "", address: "", phone: "", email: "" },
    tenant: { name: "", phone: "", email: "", emergencyContact: "", emergencyPhone: "" },
    property: { address: "", type: "", bedrooms: "", bathrooms: "", furnished: "", parking: "" },
    terms: { rentAmount: "", securityDeposit: "", leaseStart: "", leaseEnd: "", rentDueDate: "", lateFeesAmount: "", lateFeesGracePeriod: "" },
    clauses: { petsAllowed: "", smokingAllowed: "", sublettingAllowed: "", maintenanceResponsibility: "", earlyTermination: "", renewalTerms: "" }
  });

  const { toast } = useToast();

  // Load autosave on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wizardData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setWizardData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Throttled autosave
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem("wizardData", JSON.stringify(wizardData));
        toast({ description: "Saved just now" });
      } catch {}
    }, 800);
    return () => clearTimeout(id);
  }, [wizardData, toast]);

  const steps = [
    { title: "Jurisdiction", component: JurisdictionStep },
    { title: "Landlord Information", component: LandlordInfoStep },
    { title: "Tenant Information", component: TenantInfoStep },
    { title: "Property Details", component: PropertyInfoStep },
    { title: "Rental Terms", component: RentalTermsStep },
    { title: "Legal Clauses", component: LegalClausesStep },
    { title: "Preview & Generate", component: PreviewStep }
  ];

  const updateWizardData = (section: keyof WizardData, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    // Hard guard: do not advance if current step is invalid
    if (!isValid) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const { isValid, errors } = useStepValidity(wizardData, currentStep);
  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Province-first modal */}
      <Dialog open={showProvinceModal && !wizardData.jurisdiction?.provinceCode}>
        <DialogContent aria-describedby="province-modal-desc">
          <DialogHeader>
            <DialogTitle>Select your province or territory</DialogTitle>
            <DialogDescription id="province-modal-desc">
              We validate compliance as you go. Choose your jurisdiction to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <JurisdictionStep data={wizardData} updateData={updateWizardData} />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowProvinceModal(false)} disabled={!wizardData.jurisdiction?.provinceCode}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Rental Agreement Wizard</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
          <ComplianceChip provinceCode={wizardData.jurisdiction?.provinceCode} hasErrors={!isValid && errors.length > 0} />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card/30 border-b">
        <div className="container mx-auto px-4 py-4 space-y-3">
          <Progress value={progress} className="w-full" />
          <div className="hidden md:flex items-center gap-4 overflow-x-auto">
            {steps.map((s, idx) => {
              const stepIndex = idx + 1;
              const status = getStepValidity(wizardData, stepIndex);
              const done = stepIndex < currentStep && status.isValid;
              return (
                <div key={s.title} className="flex items-center gap-2 whitespace-nowrap text-sm">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${done ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-card border-border text-muted-foreground'}`}>
                    {done ? <Check className="h-3 w-3" /> : stepIndex}
                  </span>
                  <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-legal border-0 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CurrentStepComponent
                data={wizardData}
                updateData={updateWizardData}
              />

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded">
                  {errors.map((e, i) => (
                    <div key={`step-err-${i}`}>• {e}</div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === steps.length || !isValid}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <span>{currentStep === steps.length ? "Generate Agreement" : "Next"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RentalWizard;