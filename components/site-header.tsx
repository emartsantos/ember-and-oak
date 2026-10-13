import { Phone } from "lucide-react";

import { site, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui";

/**
 * Sticky, always-readable header.
 *
 * No scroll listener and no hamburger: the nav is a single <nav> that wraps
 * onto its own full-width row below `sm`. One landmark, one source of truth,
 * zero JavaScript.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-crust/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 px-5 py-3 sm:h-16 sm:flex-nowrap sm:px-8 sm:py-0 lg:px-10">
        {/* Wordmark — the ampersand's ember dot is the only flourish. */}
        <a
          href="#top"
          className="group flex min-h-6 items-baseline gap-2"
          aria-label={`${site.name} — back to top`}
        >
          <span className="font-display text-[1.4rem] leading-none tracking-[-0.02em]">
            {site.name}
          </span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-ember transition-transform duration-500 group-hover:scale-150"
          />
        </a>

        {/* Wraps to a second row on mobile, sits right of the wordmark above sm. */}
        <nav
          aria-label="Page sections"
          className="order-last w-full border-t border-crust/60 pt-1 sm:order-none sm:ml-auto sm:w-auto sm:border-0 sm:pt-0"
        >
          <ul className="flex items-center justify-between gap-8 sm:justify-end">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-block py-2.5 text-[0.7rem] font-medium tracking-[0.2em] text-ink/55 uppercase transition-colors duration-300 hover:text-ink"
                >
                  {/* The underline is drawn on an inline span so the tap-target
                      padding on the anchor doesn't push it away from the text. */}
                  <span className="editorial-link">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 sm:ml-0">
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="hidden min-h-6 items-center gap-2 text-[0.78rem] tracking-[0.04em] text-ink/65 transition-colors duration-300 hover:text-ink md:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {site.contact.phone}
          </a>

          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[2px] bg-ember px-4 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:bg-ink"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
