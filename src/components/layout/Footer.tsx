import { Link } from "react-router-dom";
import { AtSign, Mail, Phone } from "lucide-react";
import { navLinks, site } from "@/config/site";

export function Footer() {
  const { phone, email, instagram } = site.contact;
  const hasContact = phone || email || instagram;
  return (
    <footer className="bg-ink text-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <img
            src={site.logo}
            alt={site.name}
            width={72}
            height={72}
            className="size-[4.5rem]"
          />
          <p className="mt-5 max-w-xs text-surface/75">
            Fresh food and special food packages, ordered directly and delivered
            to you.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold text-surface/60">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-surface/90 hover:text-white hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/menu"
                className="text-surface/90 hover:text-white hover:underline"
              >
                Order Now
              </Link>
            </li>
            <li>
              <Link
                to="/track"
                className="text-surface/90 hover:text-white hover:underline"
              >
                Track Order
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold text-surface/60">
            Contact
          </h2>
          {hasContact ? (
            <ul className="mt-4 space-y-2.5 text-surface/90">
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4" aria-hidden />{" "}
                  <a href={`tel:${phone}`} className="hover:underline">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4" aria-hidden />{" "}
                  <a href={`mailto:${email}`} className="hover:underline">
                    {email}
                  </a>
                </li>
              )}
              {instagram && (
                <li className="flex items-center gap-2.5">
                  <AtSign className="size-4" aria-hidden />{" "}
                  <a href={instagram} className="hover:underline">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-surface/75">
              Contact details will appear here soon.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-surface/15">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-surface/60 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <Link to="/admin" className="hover:text-surface">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
