import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': any;
    }
  }
}

const Pay = () => {
  const [selected, setSelected] = useState<'one'|'annual'|'free'>('one');

  const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  const PRICING_TABLE_ID = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID as string | undefined;
  const PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL as string | undefined;

  useEffect(() => {
    // Handle success redirect
    const search = location.hash.includes('?') ? location.hash.split('?')[1] : location.search.slice(1);
    const params = new URLSearchParams(search);
    if (params.get('success') === 'true') {
      try { localStorage.setItem('canai.payment.ok', 'true'); } catch {}
      location.hash = '#/wizard';
      return;
    }
    // Load pricing table script if configured
    if (PUBLISHABLE_KEY && PRICING_TABLE_ID) {
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
          {!PUBLISHABLE_KEY || !(PRICING_TABLE_ID || PAYMENT_LINK_URL) ? (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Stripe is not fully configured. Set VITE_STRIPE_PUBLISHABLE_KEY and either
                VITE_STRIPE_PRICING_TABLE_ID or VITE_STRIPE_PAYMENT_LINK_URL.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => (location.hash = '#/wizard')}>Skip for now</Button>
              </div>
            </>
          ) : PRICING_TABLE_ID ? (
            <div className="flex justify-center">
              <stripe-pricing-table
                pricing-table-id={PRICING_TABLE_ID}
                publishable-key={PUBLISHABLE_KEY}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <Button onClick={() => {
                const successUrl = encodeURIComponent(`${location.origin}/#/pay?success=true`);
                const url = PAYMENT_LINK_URL?.includes('success_url=') ? PAYMENT_LINK_URL : `${PAYMENT_LINK_URL}?success_url=${successUrl}`;
                window.location.href = url!;
              }}>Pay securely</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pay;


