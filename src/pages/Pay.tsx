import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Pay = () => {
  const [selected, setSelected] = useState<'one'|'annual'|'free'>('one');

  const proceed = () => {
    if (selected === 'free') {
      window.location.href = '/wizard';
    } else {
      // Placeholder: no Stripe, keep $0 MVP
      window.location.href = '/wizard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center">Choose your plan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <button className={`p-4 rounded border ${selected==='one'?'border-primary':'border-border'}`} onClick={() => setSelected('one')}>
            <div className="font-semibold">One‑time Lease</div>
            <div className="text-sm text-muted-foreground">Pay once per agreement</div>
          </button>
          <button className={`p-4 rounded border ${selected==='annual'?'border-primary':'border-border'}`} onClick={() => setSelected('annual')}>
            <div className="font-semibold">Annual Unlimited</div>
            <div className="text-sm text-muted-foreground">Unlimited agreements</div>
          </button>
          <button className={`p-4 rounded border ${selected==='free'?'border-primary':'border-border'}`} onClick={() => setSelected('free')}>
            <div className="font-semibold">Start Free Draft</div>
            <div className="text-sm text-muted-foreground">Pay later at e‑sign</div>
          </button>
          <div className="md:col-span-3 flex justify-center pt-2">
            <Button onClick={proceed}>Continue</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pay;


