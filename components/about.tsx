import Image from "next/image";

import { site } from "@/lib/site";
import { SectionLabel } from "@/components/ui";

/**
 * Section 01 — the brand introduction.
 *
 * The two photographs are inlaid rather than placed side by side, which keeps
 * the page from reading as a gallery. The three principles are a stacked,
 * numbered list separated by hairlines — deliberately not a three-up card row.
 */
export function About() {
  const { about } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-crust/70"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Photographs */}
          <div className="lg:col-span-5">
            <div className="relative">
              <figure className="zoom relative aspect-[4/5] overflow-hidden rounded-[2px] bg-crust">
                <Image
                  src={about.image.src}
                  alt={about.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </figure>

              <figure className="zoom absolute -right-5 -bottom-8 hidden aspect-[4/3] w-[60%] overflow-hidden rounded-[2px] border-[6px] border-paper bg-crust md:block">
                <Image
                  src={about.secondaryImage.src}
                  alt={about.secondaryImage.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 28vw"
                  className="object-cover"
                />
              </figure>
            </div>

            {about.pullQuote && (
              <blockquote className="mt-20 border-l-2 border-ember pl-5 lg:mt-24">
                <p className="font-display text-[1.35rem] leading-snug italic text-ink/85">
                  {about.pullQuote.text}
                </p>
                <footer className="mt-3 text-[0.64rem] font-medium tracking-[0.22em] text-ink/40 uppercase">
                  {about.pullQuote.attribution}
                </footer>
              </blockquote>
            )}
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <SectionLabel index="01">{about.label}</SectionLabel>

            <h2
              id="about-heading"
              className="mt-6 font-display text-[clamp(2rem,4.2vw,3.15rem)] text-balance"
            >
              {about.heading}
            </h2>

            <div className="mt-7 max-w-[58ch] space-y-4 text-[1rem] leading-[1.7] text-ink/65">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ol className="mt-12 border-t border-crust/70">
              {about.principles.map((principle, index) => (
                <li
                  key={principle.title}
                  className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-crust/70 py-5"
                >
                  <span
                    aria-hidden
                    className="pt-1.5 font-display text-[0.9rem] tabular-nums text-ember"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.28rem] leading-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-[0.9rem] leading-relaxed text-ink/55">
                      {principle.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
