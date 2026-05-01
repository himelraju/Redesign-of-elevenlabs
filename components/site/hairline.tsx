import { cn } from "@/lib/utils"

export function Hairline({
  className,
  vertical = false,
}: {
  className?: string
  vertical?: boolean
}) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        "hairline",
        vertical ? "w-px h-full" : "h-px w-full",
        className,
      )}
    />
  )
}

export function SectionLabel({
  index,
  label,
  className,
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground", className)}>
      <span className="text-primary">{index}</span>
      <span className="hairline h-px w-8" />
      <span>{label}</span>
    </div>
  )
}
