import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, CheckCircle } from "lucide-react";
import RentalWizard from "@/components/RentalWizard";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <RentalWizard onBack={() => setShowWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">RentalWiz</h1>
          </div>
          <Button 
            onClick={() => setShowWizard(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-legal"
          >
            Create Agreement
          </Button>
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
              onClick={() => setShowWizard(true)}
              className="bg-gradient-hero hover:opacity-90 transition-all transform hover:scale-105 shadow-legal text-lg px-8 py-6"
            >
              Start Creating Your Agreement
            </Button>
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