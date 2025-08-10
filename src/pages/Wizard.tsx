import { useEffect } from "react";
import RentalWizard from "@/components/RentalWizard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Wizard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/signin', { replace: true });
    });
  }, [navigate]);
  return <RentalWizard onBack={() => navigate("/")} />;
};

export default Wizard;


