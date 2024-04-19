import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type FromVariant = 'user' | 'ai'
type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  from: FromVariant;
  sources?: string[]
};

export function Message({from, sources, ...props}: MessageProps) {
  const sharedStyle =
    "flex flex-col gap-1 whitespace-pre-wrap p-2 rounded-lg w-fit border border-input";
    return from === "user" ? (
      <div
        className={cn(
          sharedStyle,
          "ml-4 items-end bg-primary text-primary-foreground pl-4 rounded-tr-none"
        )}
        {...props}
      >
        <span className="text-xs text-accent">You</span>
        {props.children}
      </div>
    ) : (
      <div
        className={cn(
          sharedStyle,
          "mr-8 bg-background text-background-foreground p-0 rounded-tl-none"
        )}
        {...props}
      >
        <span className="text-xs p-2 text-muted-foreground">AI</span>
        <div className="p-2">
          {props.children}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {sources?.map((source, idx) => (
            <AccordionItem key={idx} value={`item-${idx + 1}`}>
              <AccordionTrigger className="px-2">Source {idx + 1}</AccordionTrigger>
              <AccordionContent className="p-1 text-sm text-muted-foreground">{source}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
}