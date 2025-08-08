import { Button } from "@/components/ui/button";

const sections = [
  'Entrance/Doors/Locks', 'Living Room', 'Kitchen (Appliances/Sinks)', 'Bedrooms', 'Bathrooms (Fixtures/Vents)', 'Windows/Screens', 'Floors/Walls/Ceilings', 'Smoke/CO Detectors', 'Heating/Cooling', 'Balcony/Patio/Storage'
]

export default function InspectionChecklist() {
  const download = () => {
    const content = `MOVE-IN / MOVE-OUT CONDITION INSPECTION REPORT\n\n`+
      `Tenant: _______________________________  Landlord: _______________________________\n`+
      `Address: ____________________________________________________________\n`+
      `Date: _____________________  Time: _____________________\n\n`+
      sections.map(s => `Section: ${s}\nCondition Notes: ______________________________________________\n_______________________________________________\n\n`).join('')+
      `Keys/Fobs Received: _______  Parking/Storage: _______\n\n`+
      `Photos Taken: Yes / No\n\n`+
      `Tenant Signature: _____________________  Date: ___________\n`+
      `Landlord Signature: ___________________  Date: ___________\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inspection_checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="bg-accent/50 p-4 rounded-lg">
      <p className="text-sm text-muted-foreground mb-2">Use an inspection report to document condition at move‑in and move‑out. It supports lawful deposit handling.</p>
      <Button size="sm" onClick={download}>Download Checklist</Button>
    </div>
  );
}

