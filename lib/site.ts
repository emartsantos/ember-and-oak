/**
 * ---------------------------------------------------------------------------
 *  SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 *  This is the only file you need to edit to change the business content.
 *  Everything on the page — headings, menu, hours, contact details, colours —
 *  is read from here.
 *
 *  ⚠️  PLACEHOLDER CONTENT
 *  No client materials were supplied for this build. Every string below is
 *  placeholder copy written to demonstrate the layout. Items marked
 *  `TODO(client)` must be confirmed or replaced before the site goes live.
 *  See "Client materials still required" in README.md.
 * ---------------------------------------------------------------------------
 */

import { asset } from "./asset";

export type DietaryTag = "V" | "VG" | "GF";

export type MenuItem = {
  name: string;
  description: string;
  /** Kept as a string so the client can write "market price" or "12 / 18". */
  price: string;
  tags?: DietaryTag[];
  /** Flags the item as a house speciality in the layout. */
  signature?: boolean;
};

export type MenuGroup = {
  title: string;
  note?: string;
  items: MenuItem[];
};

export type OpeningDay = {
  day: string;
  /** 24-hour "HH:MM" (a US local business, so the display text is derived). */
  opens: string | null;
  /** "24:00" is accepted and renders as midnight. Both null = closed all day. */
  closes: string | null;
};

export type SocialLink = { label: string; href: string };

export type Site = {
  name: string;
  industry: string;
  /** Drives <title>, Open Graph and the JSON-LD description. */
  tagline: string;
  description: string;
  /** Live domain. Drives metadataBase and canonical URLs. TODO(client): set this. */
  url: string;

  brand: {
    /** Warm near-black. Body text and dark sections. */
    ink: string;
    /** Warm off-white. Page background. */
    paper: string;
    /** Burnt orange. Actions, rules, emphasis. Used sparingly. */
    ember: string;
    /** Wheat. Hairlines, dividers, secondary surfaces. */
    crust: string;
  };

  /** Set to false once the client's own photography replaces /public/images. */
  usingPlaceholderPhotography: boolean;

  nav: { label: string; href: string }[];

  hero: {
    /** Rendered as display lines. `emphasis: true` switches to the italic cut. */
    headline: { text: string; emphasis?: boolean }[];
    intro: string;
    /** Label only — the href is always the WhatsApp deep link built from `contact`. */
    primaryCta: { label: string };
    secondaryCta: { label: string; href: string };
    image: { src: string; alt: string };
  };

  /** The strip of hairlines directly under the hero. */
  serviceModes: string[];

  about: {
    label: string;
    heading: string;
    paragraphs: string[];
    principles: { title: string; body: string }[];
    image: { src: string; alt: string };
    /** Smaller image inlaid over the main one. Only shown from the `md` breakpoint. */
    secondaryImage: { src: string; alt: string };
    /** Optional short quote set alongside the image. Remove to hide. */
    pullQuote?: { text: string; attribution: string };
  };

  menu: {
    label: string;
    heading: string;
    intro: string;
    legend: { code: DietaryTag; meaning: string }[];
    groups: MenuGroup[];
    image: { src: string; alt: string };
  };

  visit: {
    label: string;
    heading: string;
    intro: string;
    address: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
    mapUrl: string;
    hours: OpeningDay[];
    /** Rendered as a small notes list: parking, bookings, large groups. */
    notes: { title: string; body: string }[];
    image: { src: string; alt: string };
    /** The full-bleed dark band + footer that closes the page. */
    closing: {
      label: string;
      heading: string;
      body: string;
      whatsappLabel: string;
      whatsappMessage: string;
      callLabel: string;
    };
  };

  contact: {
    /** Human-readable phone number. */
    phone: string;
    /** E.164 without punctuation, for tel: links. */
    phoneHref: string;
    /** Digits only, country code first, no + — for wa.me links. */
    whatsapp: string;
    /** Prefilled message so the customer never faces an empty box. */
    whatsappMessage: string;
    email: string;
    /** Leave the array empty to hide the social block entirely. TODO(client). */
    social: SocialLink[];
  };
};

export const site: Site = {
  name: "Ember & Oak",
  industry: "Wood-fired pizzeria",
  tagline: "Wood-fired pizza on South Congress, Austin",
  description:
    "A small wood-fired pizzeria on South Congress, Austin. Slow dough, live oak, and a short list of pies.",
  url: "https://emartsantos.github.io/ember-and-oak", // TODO(client): swap for the real domain if one is bought

  brand: {
    ink: "#17120F",
    paper: "#F7F2E8",
    ember: "#D1461C",
    crust: "#E3D5BE",
  },

  usingPlaceholderPhotography: true, // TODO(client): set false once real photos are supplied

  nav: [
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Visit", href: "#visit" },
  ],

  hero: {
    headline: [
      { text: "Baked over live oak," },
      { text: "ninety seconds at a time.", emphasis: true },
    ],
    intro:
      "A small kitchen on South Congress making Neapolitan-style pizza in a wood oven. Slow dough, a short list of pies, and a counter you can watch from.",
    primaryCta: { label: "Order on WhatsApp" },
    secondaryCta: { label: "See the menu", href: "#menu" },
    image: {
      src: asset("/images/hero.webp"),
      alt: "A slice of wood-fired pizza being lifted, the crust blistered and the cheese still molten",
    },
  },

  serviceModes: ["Dine in", "Takeaway", "Catering", "Walk-ins welcome"], // TODO(client): confirm

  about: {
    label: "The kitchen",
    heading: "One oven, one short list, no shortcuts.",
    paragraphs: [
      "We cook one way: dough that ferments slowly, tomatoes we leave alone, and a fire we keep lit through service. Everything else follows from that.",
      "The room is small on purpose. You can watch the oven from most tables, and the person who bakes your pizza is usually the person who hands it to you.",
    ],
    principles: [
      {
        title: "Slow dough",
        body: "Mixed in the morning, proofed cold, shaped by hand. Two days from flour to oven.",
      },
      {
        title: "One live fire",
        body: "Live oak kept at around 450°C. Every pizza is in and out in roughly ninety seconds.",
      },
      {
        title: "Named suppliers",
        body: "Tomatoes, cheese and greens from growers and makers we can point to by name.",
      },
    ],
    image: {
      src: asset("/images/dough.webp"),
      alt: "Hands shaping a ball of pizza dough on a floured wooden bench",
    },
    secondaryImage: {
      src: asset("/images/oven.webp"),
      alt: "A wood-fired oven with a pizza baking on the hearth",
    },
    pullQuote: {
      text: "If it isn't good enough for the table by the door, it doesn't leave the pass.",
      attribution: "The kitchen", // TODO(client): attribute to a named person
    },
  },

  menu: {
    label: "The menu",
    heading: "Six pies, and a few things beside them.",
    intro:
      "The list changes with the season and with what the market has that morning. These are the items that rarely leave.",
    legend: [
      { code: "V", meaning: "Vegetarian" },
      { code: "VG", meaning: "Vegan on request" },
      { code: "GF", meaning: "Gluten-free base available" },
    ],
    groups: [
      {
        title: "Pizza",
        note: "All pies are 12 inch unless noted.",
        items: [
          {
            name: "Margherita",
            description: "San Marzano tomato, fior di latte, basil, olive oil.",
            price: "$17",
            tags: ["V"],
            signature: true,
          },
          {
            name: "Soppressata & Chilli Honey",
            description: "Hot soppressata, mozzarella, chilli honey, oregano.",
            price: "$20",
            signature: true,
          },
          {
            name: "Mushroom & Taleggio",
            description: "Wood-roasted mushrooms, taleggio, thyme, black pepper.",
            price: "$21",
            tags: ["V"],
          },
          {
            name: "Green Chile & Brisket",
            description: "Hatch green chile, Oaxaca cheese, smoked brisket, pickled onion.",
            price: "$22",
          },
          {
            name: "Marinara",
            description: "Tomato, garlic, oregano, olive oil. No cheese.",
            price: "$15",
            tags: ["V", "VG"],
          },
          {
            name: "Courgette & Lemon",
            description: "Grilled courgette, ricotta, lemon zest, mint.",
            price: "$19",
            tags: ["V"],
          },
        ],
      },
      {
        title: "Small plates",
        items: [
          {
            name: "Burrata & Grilled Bread",
            description: "Puglian burrata, olive oil, sea salt, charred sourdough.",
            price: "$14",
            tags: ["V"],
          },
          {
            name: "Wood-Roasted Olives",
            description: "Warm olives, orange peel, rosemary, chilli.",
            price: "$7",
            tags: ["V", "VG", "GF"],
          },
          {
            name: "Bitter Leaf Salad",
            description: "Radicchio, endive, pecorino, walnuts, lemon.",
            price: "$12",
            tags: ["V", "GF"],
          },
        ],
      },
      {
        title: "Sweet & drinks",
        items: [
          {
            name: "Olive Oil Cake",
            description: "Rosemary, mascarpone, flaked sea salt.",
            price: "$9",
            tags: ["V"],
          },
          {
            name: "Affogato",
            description: "Vanilla gelato, espresso, amaretti.",
            price: "$8",
            tags: ["V"],
          },
          {
            name: "House Lemon Soda",
            description: "Lemon, bay leaf, soda. Made here, poured over ice.",
            price: "$5",
            tags: ["V", "VG", "GF"],
          },
        ],
      },
    ],
    image: {
      src: asset("/images/menu.webp"),
      alt: "A whole pizza photographed from above on a dark surface, basil scattered over the top",
    },
  },

  visit: {
    label: "Visit",
    heading: "1907 South Congress Avenue",
    intro:
      "Between the vintage shops, one block up from the food trucks. There is a small car park behind the building.",
    address: {
      street: "1907 South Congress Avenue",
      locality: "Austin",
      region: "TX",
      postalCode: "78704",
      country: "US",
    }, // TODO(client): confirm the exact address
    mapUrl: "https://maps.google.com/?q=1907+South+Congress+Avenue+Austin+TX+78704",
    hours: [
      { day: "Monday", opens: null, closes: null },
      { day: "Tuesday", opens: "16:00", closes: "22:00" },
      { day: "Wednesday", opens: "16:00", closes: "22:00" },
      { day: "Thursday", opens: "16:00", closes: "22:00" },
      { day: "Friday", opens: "15:00", closes: "24:00" },
      { day: "Saturday", opens: "12:00", closes: "24:00" },
      { day: "Sunday", opens: "12:00", closes: "21:00" },
    ], // TODO(client): confirm trading hours
    notes: [
      {
        title: "Larger tables",
        body: "We hold two tables for six or more. Message us and we will confirm the time.",
      },
      {
        title: "Catering",
        body: "The oven travels. Tell us the date and headcount and we will send a quote.",
      },
      {
        title: "Parking",
        body: "Free lot behind the building, plus street parking after 6pm.",
      },
    ],
    image: {
      src: asset("/images/room.webp"),
      alt: "A warmly lit dining room with wooden tables and people eating together",
    },
    closing: {
      label: "Bookings & orders",
      heading: "The fastest way to a table is usually a message.",
      body: "Tell us what you would like and roughly when you will arrive. We will confirm and hold it on the pass.",
      whatsappLabel: "Order on WhatsApp",
      whatsappMessage: "Hi Ember & Oak — I'd like to place an order.",
      callLabel: "Call",
    },
  },

  contact: {
    phone: "(512) 555-0147", // TODO(client): confirm
    phoneHref: "+15125550147",
    whatsapp: "15125550147",
    whatsappMessage: "Hi Ember & Oak — I'd like to ask about a table.",
    email: "hello@emberandoak.example.com",
    social: [], // TODO(client): add Instagram / Facebook URLs when supplied
  },
};

/** Builds a wa.me deep link with the prefilled message from the config. */
export function whatsappHref(override?: string): string {
  const text = encodeURIComponent(override ?? site.contact.whatsappMessage);
  return `https://wa.me/${site.contact.whatsapp}?text=${text}`;
}

/** Full street address on one line. */
export function fullAddress(): string {
  const a = site.visit.address;
  return `${a.street}, ${a.locality}, ${a.region} ${a.postalCode}`;
}

/**
 * Turns "16:00" into "4:00 pm". The opening hours exist in the config only as
 * 24-hour values, so the visible table and the JSON-LD below are both derived
 * from them and can never drift out of sync.
 */
function toTwelveHour(value: string): string {
  const [rawHour, rawMinutes = "00"] = value.split(":");
  const hour = Number(rawHour) % 24;
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${rawMinutes} ${suffix}`;
}

/** "4:00 pm – 10:00 pm", or null when the business is closed that day. */
export function openingLabel(day: OpeningDay): string | null {
  if (!day.opens || !day.closes) return null;
  return `${toTwelveHour(day.opens)} – ${toTwelveHour(day.closes)}`;
}

/** openingHoursSpecification nodes for the Restaurant schema. */
export function openingHoursSpecification() {
  return site.visit.hours
    .filter((day) => day.opens && day.closes)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day.day,
      opens: day.opens,
      closes: day.closes,
    }));
}

/** The four brand colours, handed to the layout as CSS custom properties. */
export function brandVariables(): Record<string, string> {
  const { ink, paper, ember, crust } = site.brand;
  return {
    "--brand-ink": ink,
    "--brand-paper": paper,
    "--brand-ember": ember,
    "--brand-crust": crust,
  };
}
