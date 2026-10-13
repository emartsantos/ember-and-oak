import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

import { fullAddress, openingLabel, site } from "@/lib/site";
import { SectionLabel, WhatsAppButton, buttonBase } from "@/components/ui";

const subHeading =
  "text-[0.68rem] font-semibold tracking-[0.3em] text-ink/40 uppercase";

/**
 * Section 03 — practicalities, the closing call to action, and the footer.
 *
 * The page ends on a full-bleed ink band: one decisive action after a lot of
 * cream. The footer is intentionally part of this section rather than a
 * separate slab of site furniture.
 */
export function Visit() {
  const { visit, contact } = site;
  const { street, locality, region, postalCode } = visit.address;

  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="border-t border-crust/70"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionLabel index="03">{visit.label}</SectionLabel>

            <h2
              id="visit-heading"
              className="mt-6 font-display text-[clamp(2rem,4.2vw,3.15rem)]"
            >
              {visit.heading}
            </h2>

            <p className="mt-6 max-w-[52ch] text-[0.98rem] leading-[1.7] text-ink/60">
              {visit.intro}
            </p>

            <div className="mt-12 grid gap-x-12 gap-y-11 lg:grid-cols-2">
              {/* Column one — where and when */}
              <div>
                <h3 className={subHeading}>Find us</h3>

                <address className="mt-4 text-[0.95rem] leading-relaxed text-ink/75 not-italic">
                  {street}
                  <br />
                  {locality}, {region} {postalCode}
                </address>

                <a
                  href={visit.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex min-h-6 items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-ink/70 uppercase transition-colors duration-300 hover:text-ember"
                >
                  <span className="editorial-link">Get directions</span>
                  <MapPin aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>

                <h3 className={`${subHeading} mt-11`}>Opening hours</h3>

                <dl className="mt-4">
                  {visit.hours.map((day) => {
                    const label = openingLabel(day);
                    return (
                      <div
                        key={day.day}
                        className="flex items-baseline border-b border-crust/60 py-2.5 text-[0.88rem] last:border-0"
                      >
                        <dt className="text-ink/70">{day.day}</dt>
                        <span
                          aria-hidden
                          className="leader mx-3 min-w-[1.5rem] flex-1"
                        />
                        <dd
                          className={
                            label
                              ? "tabular-nums text-ink/80"
                              : "text-ink/35"
                          }
                        >
                          {label ?? "Closed"}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

              {/* Column two — the small print and the ways in */}
              <div>
                <h3 className={subHeading}>Good to know</h3>

                <ul className="mt-4">
                  {visit.notes.map((note) => (
                    <li
                      key={note.title}
                      className="border-b border-crust/60 py-3.5 last:border-0"
                    >
                      <p className="text-[0.74rem] font-semibold tracking-[0.14em] text-ink/70 uppercase">
                        {note.title}
                      </p>
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink/55">
                        {note.body}
                      </p>
                    </li>
                  ))}
                </ul>

                <h3 className={`${subHeading} mt-11`}>Talk to us</h3>

                <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                  <li>
                    <a
                      href={`tel:${contact.phoneHref}`}
                      className="editorial-link text-ink/80 transition-colors duration-300 hover:text-ember"
                    >
                      {contact.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="editorial-link text-ink/80 transition-colors duration-300 hover:text-ember"
                    >
                      {contact.email}
                    </a>
                  </li>
                  {contact.social.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link text-ink/80 transition-colors duration-300 hover:text-ember"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="zoom relative aspect-[4/5] overflow-hidden rounded-[2px] bg-crust md:aspect-[3/4]">
              <Image
                src={visit.image.src}
                alt={visit.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Closing call to action — full-bleed ink.                          */}
      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="closing-heading"
        className="bg-ink text-paper"
      >
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3.5 text-[0.66rem] font-medium tracking-[0.3em] text-paper/40 uppercase">
                <span aria-hidden className="h-px w-9 bg-ember" />
                {visit.closing.label}
              </p>

              <h2
                id="closing-heading"
                className="mt-6 max-w-[22ch] font-display text-[clamp(1.9rem,4vw,2.9rem)] text-balance"
              >
                {visit.closing.heading}
              </h2>

              <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-paper/55">
                {visit.closing.body}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
              <WhatsAppButton
                tone="inverse"
                label={visit.closing.whatsappLabel}
                message={visit.closing.whatsappMessage}
              />

              <a
                href={`tel:${contact.phoneHref}`}
                className={`${buttonBase} border border-paper/25 text-paper hover:border-paper/70`}
              >
                <Phone aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
                {visit.closing.callLabel} {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Compact footer, integrated into the section.                      */}
      {/* ---------------------------------------------------------------- */}
      <footer className="bg-ink text-paper/45">
        <div className="mx-auto max-w-[1180px] border-t border-paper/10 px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 text-[0.76rem]">
            <p className="flex items-baseline gap-2.5">
              <span className="font-display text-[1.05rem] text-paper">
                {site.name}
              </span>
              <span
                aria-hidden
                className="h-1 w-1 self-center rounded-full bg-ember"
              />
              <span className="tracking-[0.18em] text-paper/40 uppercase">
                {site.industry}
              </span>
            </p>

            <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span>{fullAddress()}</span>
              <a
                href={`tel:${contact.phoneHref}`}
                className="inline-flex min-h-6 items-center transition-colors duration-300 hover:text-paper"
              >
                {contact.phone}
              </a>
            </p>

            <p>
              &copy; {new Date().getFullYear()} {site.name}. All rights
              reserved.
            </p>
          </div>

          {site.usingPlaceholderPhotography && (
            <p className="mt-6 border-t border-paper/10 pt-5 text-[0.7rem] leading-relaxed text-paper/30">
              Note: the photography on this page is licensed placeholder imagery
              and does not depict the premises. It will be replaced with the
              client&rsquo;s own photos.{" "}
              <span className="text-paper/20">
                (Remove by setting <code>usingPlaceholderPhotography</code> to{" "}
                <code>false</code> in <code>lib/site.ts</code>.)
              </span>
            </p>
          )}
        </div>
      </footer>
    </section>
  );
}
