import { cn } from "@/lib/utils";

type FromVariant = 'user' | 'ai'
type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  from: FromVariant;
};

export function Message({from, ...props}: MessageProps) {
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
        <span className="text-xs text-muted">User</span>
        {props.children}
      </div>
    ) : (
      <div
        className={cn(
          sharedStyle,
          "mr-8 bg-background text-background-foreground pr-4 rounded-tl-none"
        )}
        {...props}
      >
        <span className="text-xs text-muted-foreground">AI</span>
        {props.children}
      </div>
    );
}