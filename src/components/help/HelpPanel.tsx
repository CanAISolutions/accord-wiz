import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const QA: { q: string; a: string }[] = [
  { q: "Why no security deposit in Ontario?", a: "Ontario permits last month's rent deposit, not security/damage deposits." },
  { q: "What are late fee rules?", a: "Late fees must be reasonable; some provinces restrict flat late fees or require interest-based approaches." },
  { q: "How much can I charge as a deposit in BC?", a: "Up to half a month's rent for security deposit; pet deposits may be separate within caps." },
];

export default function HelpPanel() {
  const [filter, setFilter] = useState("");
  const items = QA.filter(i => (i.q + i.a).toLowerCase().includes(filter.toLowerCase()));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Help</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Search help..." value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-3" />
        <ScrollArea className="h-48">
          <ul className="space-y-2 text-sm">
            {items.map((i, idx) => (
              <li key={idx}>
                <div className="font-medium">{i.q}</div>
                <div className="text-muted-foreground">{i.a}</div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


