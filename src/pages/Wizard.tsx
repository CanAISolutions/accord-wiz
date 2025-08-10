import RentalWizard from "@/components/RentalWizard";

const Wizard = () => {
  return <RentalWizard onBack={() => (window.location.href = "/")} />;
};

export default Wizard;


