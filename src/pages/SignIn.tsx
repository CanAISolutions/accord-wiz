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
    // Handle Supabase hash tokens when using HashRouter (tokens come after a second '#')
    const rawHash = window.location.hash || '';
    const tokenIndex = rawHash.indexOf('#access_token=');
    if (tokenIndex !== -1) {
      const fragment = rawHash.slice(tokenIndex + 1); // drop leading '#'
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token') || undefined;
      const refresh_token = params.get('refresh_token') || undefined;
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          // Clean URL back to /#/signin (no tokens)
          window.history.replaceState({}, '', `${window.location.origin}/#/signin`);
          supabase.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
        });
      }
    }
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
    // Use hash route so the redirect works on static hosts and apex domains
    const redirect = `${window.location.origin}/#/signin`;
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
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
                <Button className="flex-1" onClick={() => (location.hash = '#/wizard')}>Continue to wizard</Button>
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


