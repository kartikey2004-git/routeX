import { Gauge, Keyboard, Save, Search, Sun, UsersRound, type LucideIcon } from "lucide-react";
import { features } from "../content";

const icons: Record<string, LucideIcon> = {
  gauge: Gauge,
  keyboard: Keyboard,
  save: Save,
  search: Search,
  users: UsersRound,
  sun: Sun,
};

/*
  Six capabilities in one hairline grid. Each cell has a small monochrome
  icon in a square hairline frame, and the shared borders make the grid read
  as a single document rather than floating cards.
*/
export function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-16 mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="max-w-2xl space-y-4">
        <h2 id="features-heading" className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
          Details that make the work faster
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          The small things you notice on the tenth request of the day.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-background sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = icons[feature.icon] ?? Gauge;
          return (
            <div
              key={feature.title}
              className="group space-y-4 border-b border-border p-7 transition-colors hover:bg-surface sm:p-8 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <span className="flex size-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors group-hover:border-primary/40 group-hover:text-accent-text">
                <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="space-y-2">
                <h3 className="text-[15px] font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
