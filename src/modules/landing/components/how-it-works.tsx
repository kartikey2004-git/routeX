import { steps } from "../content";

/*
  A real sequence, so numbering is appropriate here. On wide screens a single
  hairline runs through the step markers to show the path.
*/
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="scroll-mt-16 relative overflow-hidden border-y border-border bg-surface"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl space-y-4">
          <h2 id="how-heading" className="text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
            From sign-in to a shared request in four steps
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-[13px] right-[12%] left-[12%] hidden h-px bg-border lg:block"
          />
          {steps.map((step, index) => (
            <li key={step.title} className="relative space-y-4">
              <span className="relative flex size-7 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] font-medium text-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="max-w-[28ch] text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
