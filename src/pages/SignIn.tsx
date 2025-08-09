import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(Boolean(session));
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleMagicLink = async () => {
    if (!email) return;
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/signin' } });
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center">Sign in to continue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!authed && (
            <>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button className="w-full" onClick={handleMagicLink} disabled={!email}>Send magic link</Button>
              {sent && <p className="text-sm text-muted-foreground">If an account exists, we sent a sign-in link to {email}.</p>}
            </>
          )}
          {authed && (
            <>
              <p className="text-sm text-muted-foreground">You are signed in.</p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => (location.hash = '#/pay')}>Continue to payment</Button>
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;


