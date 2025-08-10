import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { finalizeAndGenerate } from '@/lib/finalize';
import type { WizardData } from '@/components/RentalWizard';
import StepPay from '@/components/pay/StepPay';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': any;
    }
  }
}

const Pay = () => {

  const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  const PRICING_TABLE_ID = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID as string | undefined;
  const PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL as string | undefined;

  const navigate = useNavigate();
  const simulate = !Boolean(PUBLISHABLE_KEY);

  useEffect(() => {
    // Handle success redirect
    const search = location.hash.includes('?') ? location.hash.split('?')[1] : location.search.slice(1);
    const params = new URLSearchParams(search);
    if (params.get('success') === 'true') {
      try { localStorage.setItem('canai.payment.ok', 'true'); } catch {}
      navigate('/wizard');
      return;
    }
    // Load pricing table script if configured
    if (PRICING_TABLE_ID && PUBLISHABLE_KEY) {
      const src = 'https://js.stripe.com/v3/pricing-table.js';
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script');
        s.src = src; s.async = true; document.body.appendChild(s);
      }
    }
  }, [PUBLISHABLE_KEY, PRICING_TABLE_ID]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center">Secure Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {PUBLISHABLE_KEY ? (
            <StepPay />
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Payments are not configured. Set VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_CREATE_INTENT_URL to enable live checkout.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => navigate('/wizard')}>Back to Wizard</Button>
                <Button
                  onClick={async () => {
                    try {
                      const raw = localStorage.getItem('wizardData');
                      const data: WizardData | null = raw ? JSON.parse(raw) : null;
                      if (!data) { navigate('/wizard'); return; }
                      const id = await finalizeAndGenerate(data, { paymentStatus: 'simulated_paid' });
                      navigate(`/preview/${id}`);
                    } catch {
                      navigate('/wizard');
                    }
                  }}
                >
                  Proceed (payments disabled)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pay;


