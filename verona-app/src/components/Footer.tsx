import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaPinterestP, FaXTwitter } from "react-icons/fa6";

type FooterLink = { label: string; to: string };

const SHOP_LINKS: FooterLink[] = [
  { label: "Shop", to: "/shop" },
  { label: "Wedding & Engagement", to: "/wedding-engagement" },
  { label: "Fine Jewelry", to: "/fine-jewelry" },
  { label: "The Verona Collection", to: "/the-verona-collection" },
  { label: "Necklaces", to: "/necklaces" },
  { label: "Bracelets", to: "/bracelets" },
  { label: "Earrings", to: "/earrings" },
  { label: "Rings", to: "/rings" },
  { label: "Astrology Collection", to: "/astrology-collection" },
  { label: "The Verona Pairing", to: "/the-verona-pairing" },
];

const CUSTOMER_SERVICE: FooterLink[] = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

const POLICIES: FooterLink[] = [
  { label: "Shipping Policy", to: "/shipping" },
  { label: "Returns & Exchanges", to: "/returns" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Newsletter + Social */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-neutral-900">
              Join the House of Verona Circle
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Get updates on new arrivals, exclusive drops, and styling notes.
            </p>

            <form
              className="mt-4 flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: call your newsletter API here
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Sign up
              </button>
            </form>

            <div className="mt-6">
              <div className="text-sm font-semibold text-neutral-900">
                Follow us
              </div>

              <div className="mt-3 flex items-center gap-4">
                <a
                  href="https://instagram.com/yourhandle"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/yourpage"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <FaFacebookF className="h-5 w-5" />
                </a>
                <a
                  href="https://pinterest.com/yourpage"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <FaPinterestP className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/yourhandle"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <FaXTwitter className="h-5 w-5" />
                </a>
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Social icons via react-icons.
              </p>
            </div>
          </div>

          <FooterCol title="Shop links" links={SHOP_LINKS} />
          <FooterCol title="Customer Service links" links={CUSTOMER_SERVICE} />
          <FooterCol title="Policies" links={POLICIES} />
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} House of Verona. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link className="text-neutral-600 hover:text-neutral-900" to={l.to}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
