import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui";

/**
 * Asymmetric editorial hero: seven columns of type, five of photograph.
 * The second headline line is set in the italic cut of the display face and
 * carries the brand's ember — the single boldest gesture on the page, and the
 * only place colour is used at display size.
 */
export function Hero() {
  const { hero, serviceModes, industry, visit } = site;

  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 pt-10 pb-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-14 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="rise flex items-center gap-3.5 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-ink/45">
              <span aria-hidden className="h-px w-9 bg-ember" />
              {industry} — {visit.address.locality}, {visit.address.region}
            </p>

            <h1
              id="hero-heading"
              className="rise rise-1 mt-7 font-display text-[clamp(2.6rem,7.4vw,5rem)] text-balance"
            >
              {hero.headline.map((line) => (
                <span
                  key={line.text}
                  className={
                    line.emphasis ? "block italic text-ember" : "block"
                  }
                >
                  {line.text}
                </span>
              ))}
            </h1>

            <p className="rise rise-2 mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink/65">
              {hero.intro}
            </p>

            <div className="rise rise-3 mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <WhatsAppButton label={hero.primaryCta.label} />

              <a
                href={hero.secondaryCta.href}
                className="group inline-flex min-h-6 items-center gap-2.5 text-[0.72rem] font-medium tracking-[0.16em] text-ink/70 uppercase transition-colors duration-300 hover:text-ember"
              >
                <span className="editorial-link">{hero.secondaryCta.label}</span>
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </a>
            </div>
          </div>

          <div className="rise rise-2 lg:col-span-5">
            <figure className="zoom relative aspect-[5/4] overflow-hidden rounded-[2px] bg-crust sm:aspect-[16/10] lg:aspect-[4/5]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* Hairline detail strip — the printed-menu device that recurs site-wide. */}
      <div className="border-t border-crust/70">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-ink/45">
            {serviceModes.map((mode, index) => (
              <li key={mode} className="flex items-center gap-4">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-ember/60"
                  />
                )}
                {mode}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
