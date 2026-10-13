import Image from "next/image";

import { site, type MenuItem } from "@/lib/site";
import { SectionLabel, WhatsAppButton } from "@/components/ui";

/**
 * Section 02 — the bill of fare.
 *
 * Rows are a four-track grid (marker · name · leader · price) with
 * `items-baseline`, so the dotted leaders sit exactly on the text baseline the
 * way they would on a printed menu. Hovering a row lights its leader and price
 * in ember — the only interaction on the page.
 *
 * The signature marker gets its own track rather than being a child of the
 * heading: an empty element inside a baseline-aligned flex row would become
 * that row's first baseline and knock the name off the shared baseline.
 */
function DishRow({ item }: { item: MenuItem }) {
  return (
    <li className="group border-b border-crust/60 py-5">
      <div className="grid grid-cols-[0.625rem_auto_1fr_auto] items-baseline gap-x-2.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 self-center rounded-full ${
            item.signature ? "bg-ember" : "bg-transparent"
          }`}
        />

        <h4 className="flex items-baseline gap-2.5 font-display text-[1.28rem] leading-none">
          {item.name}
          {item.tags && item.tags.length > 0 && (
            <span className="text-[0.58rem] font-semibold tracking-[0.16em] text-ember uppercase">
              {item.tags.join(" · ")}
            </span>
          )}
        </h4>

        <span
          aria-hidden
          className="leader min-w-[2rem] transition-colors duration-300 group-hover:border-ember/70"
        />

        <span className="text-[0.95rem] tabular-nums text-ink/80 transition-colors duration-300 group-hover:text-ember">
          {item.price}
        </span>
      </div>

      <p className="mt-2 max-w-[54ch] text-[0.88rem] leading-relaxed text-ink/55">
        {item.description}
      </p>
    </li>
  );
}

export function Menu() {
  const { menu } = site;

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="border-t border-crust/70"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Sticky title block. `sticky` is pure CSS — no scroll listener. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionLabel index="02">{menu.label}</SectionLabel>

              <h2
                id="menu-heading"
                className="mt-6 font-display text-[clamp(2rem,4.2vw,3.15rem)] text-balance"
              >
                {menu.heading}
              </h2>

              <p className="mt-6 max-w-[42ch] text-[0.95rem] leading-relaxed text-ink/60">
                {menu.intro}
              </p>

              <figure className="zoom relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2px] bg-crust lg:block">
                <Image
                  src={menu.image.src}
                  alt={menu.image.alt}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </figure>

              <dl className="mt-9 grid grid-cols-3 gap-x-4 gap-y-3 border-t border-crust/70 pt-5">
                {menu.legend.map((entry) => (
                  <div key={entry.code}>
                    <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-ember uppercase">
                      {entry.code}
                    </dt>
                    <dd className="mt-1 text-[0.7rem] leading-snug text-ink/45">
                      {entry.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* The list */}
          <div className="lg:col-span-8">
            {menu.groups.map((group) => (
              <section
                key={group.title}
                aria-label={group.title}
                className="mb-14 last:mb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/80 pb-3">
                  <h3 className="text-[0.68rem] font-semibold tracking-[0.3em] uppercase">
                    {group.title}
                  </h3>
                  {group.note && (
                    <p className="text-[0.72rem] text-ink/45">{group.note}</p>
                  )}
                </div>

                <ul>
                  {group.items.map((item) => (
                    <DishRow key={item.name} item={item} />
                  ))}
                </ul>
              </section>
            ))}

            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-crust/70 pt-10">
              <WhatsAppButton
                label="Ask about today's specials"
                message="Hi Ember & Oak — what are today's specials?"
              />
              <p className="text-[0.78rem] text-ink/45">
                Prices in USD. The list changes with the season.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
