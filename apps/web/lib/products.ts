export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  badge?: string;
  category: string;
  features: string[];
  checkoutUrl: string;
}

export const products: Product[] = [
  {
    id: "supplier-vault",
    title: "The Supplier Vault",
    description:
      "The manufacturer and supplier contacts I use to actually make Rebel Reaper product — cut & sew, screen printing, blanks, leather, and embroidery.",
    price: 75,
    category: "Sourcing",
    features: [
      "Vetted manufacturer & supplier list across categories",
      "Typical MOQs and price ranges for each",
      "How to message a new supplier and what to ask first",
    ],
    checkoutUrl: "#",
  },
  {
    id: "inbox-to-income",
    title: "Inbox to Income",
    description:
      "The email marketing setup I run for Rebel Reaper — the flows, templates, and cadence that turn a list into actual revenue.",
    price: 97,
    category: "Marketing",
    features: [
      "Welcome, abandoned cart, and post-purchase flows",
      "Drop-launch email sequence templates",
      "Subject line swipe file that's actually been used",
    ],
    checkoutUrl: "#",
  },
  {
    id: "brand-foundations",
    title: "Brand Foundations Blueprint",
    description:
      "How to go from an idea to a first real drop — positioning, pricing, sourcing, and building a community before you ever ask anyone to buy.",
    price: 147,
    category: "Strategy",
    features: [
      "Positioning your brand without sounding like everyone else",
      "Pricing product so it's sustainable, not just sellable",
      "Building an audience before you have inventory",
    ],
    checkoutUrl: "#",
  },
  {
    id: "drop-playbook",
    title: "The Drop Playbook",
    description:
      "How I plan, build up to, and run a product drop with no ad budget — from teaser to sell-out, the way Rebel Reaper actually does it.",
    price: 75,
    badge: "New",
    category: "Marketing",
    features: [
      "Drop timeline from concept to launch day",
      "How to build anticipation organically",
      "What to do in the 48 hours after a drop goes live",
    ],
    checkoutUrl: "#",
  },
];
