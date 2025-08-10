import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackWidget() {
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>How was this experience?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              type="button"
              aria-label={`Rate ${n}`}
              onClick={() => setRating(n)}
              className={`h-8 w-8 rounded-full border ${rating===n? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >{n}</button>
          ))}
        </div>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Any suggestions?" />
        <div className="flex justify-end">
          <Button onClick={() => setSent(true)} disabled={sent || !rating}>Submit</Button>
        </div>
        {sent && <div className="text-sm text-muted-foreground">Thanks! Your feedback helps improve the wizard.</div>}
      </CardContent>
    </Card>
  );
}


