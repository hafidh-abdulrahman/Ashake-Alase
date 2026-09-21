import { Link } from "react-router-dom";
import { AtSign, Mail, Phone } from "lucide-react";
import { navLinks, site } from "@/config/site";

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14.5 3.5c.7 1.7 2 2.9 4.2 3.3v2.8a7.6 7.6 0 0 1-4.1-1.2v7.1a5.5 5.5 0 1 1-5.5-5.5c.4 0 .9.1 1.3.2v2.8a2.7 2.7 0 1 0 1.8 2.5V3.5h2.3Z"
        fill="currentColor"
      />
      <path
        d="M14.5 3.5c.4 1.2 1.3 2.2 2.8 2.8v2.4c-1.1-.2-2-.8-2.8-1.7V3.5Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

export function Footer() {
  const { phone, email, instagram, tiktok } = site.contact;
  const hasContact = phone || email || instagram || tiktok;
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
                  <a
                    href={instagram}
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {tiktok && (
                <li className="flex items-center gap-2.5">
                  <TikTokIcon className="size-4" />{" "}
                  <a
                    href={tiktok}
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    TikTok
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-surface/75">
              Contact details will appear here soon.
            </p>
          )}

          {(instagram || tiktok) && (
            <div className="mt-5 flex items-center gap-3">
              {instagram && (
                <a
                  href={instagram}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-surface/15 bg-surface/5 text-surface transition hover:border-surface/40 hover:bg-surface/10 hover:text-white"
                >
                  <InstagramIcon className="size-4" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  aria-label="TikTok"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-surface/15 bg-surface/5 text-surface transition hover:border-surface/40 hover:bg-surface/10 hover:text-white"
                >
                  <TikTokIcon className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-surface/15">
        <div className="container-page flex flex-col gap-2 px-5 pb-24 pt-5 text-sm text-surface/60 sm:flex-row sm:justify-between sm:pb-5">
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
