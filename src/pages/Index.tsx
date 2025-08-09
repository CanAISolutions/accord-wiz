import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PROVINCES, ProvinceCode } from "@/lib/canadaRentalRules";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">RentalWiz</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Placeholder for ComplianceChip on landing (no province yet) */}
            <span className="hidden md:inline-flex text-xs text-muted-foreground">Compliance: —</span>
            <Button 
              onClick={() => navigate('/signin')}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-legal"
          >
            Create Agreement
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Professional Rental Agreements
              <span className="block text-primary mt-2">Made Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create legally compliant rental agreements in minutes with our guided wizard.
              Trusted by thousands of landlords nationwide.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signin')}
              className="bg-gradient-hero hover:opacity-90 transition-all transform hover:scale-105 shadow-legal text-lg px-8 py-6"
            >
              Start Creating Your Agreement
            </Button>
          </div>
        </div>
      </section>

      {/* Province Selector Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-4">Pick your province or territory</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROVINCES.map((p) => (
              <button
                key={p.code}
                className="rounded border bg-card/70 hover:bg-card transition-all p-4 text-left shadow-card-soft hover:shadow-legal"
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('wizardData');
                    const prev = raw ? JSON.parse(raw) : {};
                    const next = { ...prev, jurisdiction: { provinceCode: p.code as ProvinceCode } };
                    localStorage.setItem('wizardData', JSON.stringify(next));
                  } catch {}
                  navigate('/signin');
                }}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">Complies with {p.name} tenancy rules</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Row with Official Sources */}
      <section className="py-10 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Built on official guidance</h3>
            <Popover>
              <PopoverTrigger className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <Info className="h-4 w-4 mr-2" /> Why this is safe
              </PopoverTrigger>
              <PopoverContent className="max-w-md text-sm">
                We link to official sources and enforce province rules in real time. If any term conflicts with law, the Act prevails and we’ll flag it before you proceed.
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Ontario Standard Lease</CardTitle>
                <CardDescription>
                  Required form for most residential tenancies in Ontario.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a className="text-primary underline" href="https://www.ontario.ca/page/guide-ontarios-standard-lease" target="_blank" rel="noreferrer">View official guide</a>
              </CardContent>
            </Card>

            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Québec TAL Lease</CardTitle>
                <CardDescription>
                  Official lease form required by the Tribunal administratif du logement.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a className="text-primary underline" href="https://www.tal.gouv.qc.ca/" target="_blank" rel="noreferrer">Visit TAL</a>
              </CardContent>
            </Card>

            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>BC RTB Guidance</CardTitle>
                <CardDescription>
                  Residential Tenancy Branch rules including deposits and fees.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a className="text-primary underline" href="https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies" target="_blank" rel="noreferrer">View RTB</a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose RentalWiz?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Legally Compliant</CardTitle>
                <CardDescription>
                  All agreements follow state and federal rental laws and regulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Quick & Easy</CardTitle>
                <CardDescription>
                  Complete your rental agreement in under 10 minutes with our guided wizard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Customizable</CardTitle>
                <CardDescription>
                  Tailor agreements to your specific property and tenant requirements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Create Your First Agreement?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of landlords who trust RentalWiz for their rental agreements.
            </p>
            <Button
              size="lg"
              onClick={() => setShowWizard(true)}
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 transition-all transform hover:scale-105 shadow-legal text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 RentalWiz. Professional rental agreement platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;