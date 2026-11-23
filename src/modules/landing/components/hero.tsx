import { hero } from "../content";
import { Specimen } from "./specimen";
import { SectionLink } from "./section-link";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/*
  Hero: one statement, one primary action, one secondary path into the
  product tour, and the product itself. A faint dot grid fades out behind it.
  The entrance is a single staggered sequence, and reduced motion skips it.
*/
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:pt-28 lg:pb-32">
        <div className="space-y-8">
          <p className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1 className="reveal reveal-delay-1 text-3xl leading-[1.08] font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[44px]">
            {hero.headline}
          </h1>

          <p className="reveal reveal-delay-2 max-w-[50ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.lede}
          </p>

          <div className="reveal reveal-delay-2 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 px-6 text-sm shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_30px_-12px_rgba(249,117,24,0.6)]">
                <Link href="/sign-in">Get started</Link>
              </Button>
              <SectionLink
                href={hero.secondaryCta.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {hero.secondaryCta.label}
              </SectionLink>
            </div>

            <p className="text-xs text-muted-foreground">{hero.note}</p>
          </div>

          <dl className="reveal reveal-delay-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {hero.shortcuts.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <dt className="flex gap-1">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="min-w-5 rounded-sm border border-border bg-surface px-1 text-center font-mono text-[11px] text-foreground"
                    >
                      {k}
                    </kbd>
                  ))}
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal reveal-delay-3 relative">
          <div className="absolute -inset-6 -z-10 rounded-[28px]" aria-hidden="true" />
          <Specimen />
        </div>
      </div>
    </section>
  );
}
