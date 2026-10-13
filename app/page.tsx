import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { Menu } from "@/components/menu";
import { SiteHeader } from "@/components/site-header";
import { Visit } from "@/components/visit";

/**
 * One page, four sections: Hero, About, Menu, Visit.
 *
 * Every component is a React Server Component — there is no client-side
 * JavaScript on this page at all. The nav wraps on mobile, the menu titles
 * stick, and the rows light on hover purely through CSS.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Menu />
        <Visit />
      </main>
    </>
  );
}
