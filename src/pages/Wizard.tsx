import { Suspense, lazy } from "react";

const RentalWizard = lazy(() => import("@/components/RentalWizard"));

const Wizard = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading wizard…</div>}>
      <RentalWizard onBack={() => (window.location.href = "/")} />
    </Suspense>
  );
};

export default Wizard;


