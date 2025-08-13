import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, CheckCircle, Info, Star, Building2, FileCheck, Users } from "lucide-react";
import React, { Suspense } from "react";
const DepositCapsChart = React.lazy(() => import("@/components/charts/DepositCapsChart"));
const House3D = React.lazy(() => import("@/components/House3D"));
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PROVINCES, ProvinceCode } from "@/lib/canadaRentalRules";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const title = "Canadian Rental Agreement Builder | RentalWiz";
    const description = "Create province‑compliant rental agreements in minutes. Ontario Standard Lease, Quebec TAL, and more.";
    document.title = title;

    const setMeta = (name: string, value: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta("description", description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);

    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is the agreement compliant with my province?",
          acceptedAnswer: { "@type": "Answer", text: "Yes. We enforce province and territory rules and flag conflicts before you proceed." }
        },
        {
          "@type": "Question",
          name: "Can I generate the Ontario Standard Lease?",
          acceptedAnswer: { "@type": "Answer", text: "Yes. We produce the official Ontario Standard Lease where required and attach addendums." }
        }
      ]
    } as const;
    const existing = document.getElementById("faq-jsonld");
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.id = "faq-jsonld";
    s.type = "application/ld+json";
    s.text = JSON.stringify(faq);
    document.head.appendChild(s);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">RentalWiz</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#why" className="hover:text-foreground">Why choose us</a>
            <a href="#reviews" className="hover:text-foreground">Reviews</a>
            <a href="#faq" className="hover:text-foreground">FAQs</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* Placeholder for ComplianceChip on landing (no province yet) */}
            <span className="hidden md:inline-flex text-xs text-muted-foreground">Compliance: —</span>
            <Button
              onClick={() => navigate('/wizard')}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-legal"
          >
            Create Agreement
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              try {
                const keys = Object.keys(localStorage).filter(k => k.startsWith('agreements:'));
                if (keys.length === 0) return;
                // naive pick latest by created order of storage (not guaranteed); good enough for quick access
                const id = keys[keys.length - 1].split(':')[1];
                navigate(`/preview/${id}`);
              } catch {}
            }}
          >
            Open Last Preview
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
              Create province‑specific rental agreements in minutes with our guided wizard.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/wizard')}
              className="bg-gradient-hero hover:opacity-90 transition-all transform hover:scale-105 shadow-legal text-lg px-8 py-6"
            >
              Start Creating Your Agreement
            </Button>
          </div>
        </div>
      </section>

      {/* Partners/Logos Row */}
      <section className="py-6 px-4 bg-card/30" id="logos">
        <div className="container mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-4">We are partnered with organizations across Canada</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
            <span className="text-sm">Sum</span>
            <span className="text-sm">Logeipsum</span>
            <span className="text-sm">Civic Co</span>
            <span className="text-sm">NorthStar</span>
            <span className="text-sm">Acme Legal</span>
          </div>
        </div>
      </section>

      {/* Province Selector Grid */}
      <section className="py-8 px-4" id="how">
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
                  navigate('/wizard');
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
      <section className="py-16 px-4 bg-card/30" id="features">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Legally Compliant</CardTitle>
                <CardDescription>
                  All agreements enforce the correct province or territory’s tenancy rules
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
          <div className="mt-10 max-w-4xl mx-auto">
            <Suspense fallback={<div className="h-64" />}>
              <DepositCapsChart />
            </Suspense>
          </div>
          {/* 3D preview moved to hero */}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4" id="why">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose Us</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm text-center p-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="font-medium">Built for landlords & tenants</p>
              <p className="text-sm text-muted-foreground">Simple flows both parties understand.</p>
            </Card>
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm text-center p-6">
              <FileCheck className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="font-medium">Province‑specific compliance</p>
              <p className="text-sm text-muted-foreground">We flag conflicts with tenancy law.</p>
            </Card>
            <Card className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm text-center p-6">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="font-medium">Professional outputs</p>
              <p className="text-sm text-muted-foreground">Export PDFs, sign, and share securely.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-card/30" id="reviews">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Reviews</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1,2,3].map((i) => (
              <Card key={i} className="shadow-card-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-base">“Made my onboarding painless.”</CardTitle>
                  <CardDescription>— Landlord, Ontario</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  I completed a compliant lease in under 8 minutes. The wizard caught a late‑fee rule I didn’t know about.
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4" id="faq">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-8">FAQs</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this compliant with my province?</AccordionTrigger>
              <AccordionContent>
                Yes. Our rules engine enforces provincial requirements and warns you before proceeding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do you support the Ontario Standard Lease?</AccordionTrigger>
              <AccordionContent>
                Yes, we generate the Ontario Standard Lease and attach required addendums automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I edit clauses?</AccordionTrigger>
              <AccordionContent>
                You can customize optional clauses while mandatory clauses remain intact per local law.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I share the agreement?</AccordionTrigger>
              <AccordionContent>
                Export a PDF or invite your tenant to sign digitally and access it in the Vault.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
              onClick={() => navigate('/wizard')}
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
          <p>&copy; 2025 RentalWiz. Canadian rental agreement builder.</p>
          <div className="mt-3 flex items-center justify-center gap-6 text-sm">
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground">LinkedIn</a>
            <a href="#" aria-label="Instagram" className="hover:text-foreground">Instagram</a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground">Facebook</a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;