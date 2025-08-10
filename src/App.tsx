import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wizard from "./pages/Wizard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Pay from "./pages/Pay";
import Vault from "./pages/Vault";
import { I18nProvider } from "./i18n/I18nProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/vault" element={<Vault />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
