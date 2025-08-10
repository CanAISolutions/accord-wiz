import RentalWizard from "@/components/RentalWizard";
import { useNavigate } from "react-router-dom";

const Wizard = () => {
  const navigate = useNavigate();
  return <RentalWizard onBack={() => navigate("/")} />;
};

export default Wizard;


