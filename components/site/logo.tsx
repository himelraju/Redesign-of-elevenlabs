import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-card">
        <span className="absolute inset-0 m-auto flex h-3 w-3 items-center justify-center">
          <span className="h-full w-px bg-foreground" />
          <span className="mx-[2px] h-2/3 w-px bg-foreground" />
          <span className="h-full w-px bg-primary" />
          <span className="mx-[2px] h-1/2 w-px bg-foreground" />
          <span className="h-2/3 w-px bg-foreground" />
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-base font-medium tracking-tight">ElevenLabs</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          /OS
        </span>
      </div>
    </div>
  )
}
