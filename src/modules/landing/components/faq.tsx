import { faq } from "../content";

/* Native disclosure elements: keyboard and screen-reader support with no script. */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-16 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Questions, answered
        </h2>

        <div className="divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-[15px] font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="font-mono text-lg leading-none text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
