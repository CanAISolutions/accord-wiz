import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { finalizeAndGenerate } from "@/lib/finalize";
import type { WizardData } from "@/components/RentalWizard";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const createIntentUrl = import.meta.env.VITE_STRIPE_CREATE_INTENT_URL as string | undefined;

export default function StepPay() {
  const stripePromise = useMemo(() => publishableKey ? loadStripe(publishableKey) : null, []);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!createIntentUrl) return;
      try {
        const res = await fetch(createIntentUrl, { method: 'POST' });
        const data = await res.json();
        if (data?.clientSecret) setClientSecret(data.clientSecret);
      } catch {
        setClientSecret(null);
      }
    })();
  }, []);

  if (!stripePromise || !clientSecret) return (
    <Card className="max-w-xl w-full">
      <CardHeader><CardTitle>Secure Payment</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Payment is not fully configured. Please set VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_CREATE_INTENT_URL.</p>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              try {
                const raw = localStorage.getItem('wizardData');
                const data: WizardData | null = raw ? JSON.parse(raw) : null;
                if (!data) { window.location.hash = '#/wizard'; return; }
                const id = await finalizeAndGenerate(data, { paymentStatus: 'simulated_paid' });
                window.location.hash = `#/preview/${id}`;
              } catch {
                window.location.hash = '#/wizard';
              }
            }}
          >
            Proceed (payments disabled)
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PayForm />
    </Elements>
  );
}

function PayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/#/pay?success=true' },
        redirect: 'if_required',
      });
      if (error) return;
      if (paymentIntent?.status === 'succeeded') {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          await supabase.from('payment_logs').insert({ user_id: session?.user?.id || null, status: 'succeeded' } as any);
          localStorage.setItem('canai.payment.ok', 'true');
        } catch {}
        try {
          const raw = localStorage.getItem('wizardData');
          const data: WizardData | null = raw ? JSON.parse(raw) : null;
          if (data) {
            const id = await finalizeAndGenerate(data, { paymentStatus: 'paid' });
            navigate(`/preview/${id}`);
            return;
          }
        } catch {}
        navigate('/wizard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentElement />
        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={!stripe || submitting}>{submitting ? 'Processing…' : 'Pay now'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}


