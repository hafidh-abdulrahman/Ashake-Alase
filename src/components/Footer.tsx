import { Link } from "react-router-dom";
import { AtSign, Phone, MapPin } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream/80">
      <div className="container-wide grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Ashake Alase"
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="font-display text-lg font-semibold text-cream">
              Ashake Alase
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            Freshly prepared meals and celebration packages, made for
            gatherings, weddings and everyday cravings.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-gold-light">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-cream">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-cream">
                Menu &amp; Offers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-gold-light">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} /> 0800 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} /> Lagos, Nigeria
            </li>
            <li className="flex items-center gap-2">
              <AtSign size={15} /> ashakealase
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-gold-light">
            Ordering hours
          </h4>
          <p className="mt-4 text-sm text-cream/60">
            Monday – Saturday
            <br />
            9:00am – 8:00pm
          </p>
          <Link
            to="/menu"
            className="mt-5 inline-block rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ember-light"
          >
            Order Now
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Ashake Alase. All rights reserved.
      </div>
    </footer>
  );
}
