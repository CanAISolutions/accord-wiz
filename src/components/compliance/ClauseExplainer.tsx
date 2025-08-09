import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ClauseExplainerProps {
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
}

export default function ClauseExplainer({ title, body, linkHref, linkLabel }: ClauseExplainerProps) {
  return (
    <Popover>
      <PopoverTrigger aria-label={`${title} info`} className="inline-flex items-center text-muted-foreground hover:text-foreground">
        <Info className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="max-w-sm text-sm">
        <div className="font-medium mb-1">{title}</div>
        <p className="text-muted-foreground mb-2">{body}</p>
        {linkHref && (
          <a className="text-primary underline" href={linkHref} target="_blank" rel="noreferrer">
            {linkLabel || "Learn more"}
          </a>
        )}
      </PopoverContent>
    </Popover>
  );
}


