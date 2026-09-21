import { Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import { site } from "@/config/site";

export default function ContactPage() {
  const phone = site.contact.phone || "+234 800 000 0000";
  const email = site.contact.email || "hello@ashakealase.com";
  const locationLabel = "Lagos, Nigeria";
  const locationHref = "https://maps.google.com/?q=Lagos+Nigeria";

  return (
    <div className="container-page pb-28 pt-6 sm:pb-32 lg:pb-32 lg:pt-10">
      <section className="rounded-[2rem] bg-[#f7f0e8] p-5 shadow-[0_18px_40px_rgba(36,25,22,0.06)] sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="eyebrow text-primary">Contact</p>
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.25rem)] text-ink">
            Get in Touch
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
            Have a question about your order, delivery, or our food? We’re happy
            to help.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(36,25,22,0.04)]">
          <div className="grid size-12 place-items-center rounded-full bg-primary text-white">
            <Phone className="size-5" aria-hidden />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink">Call Us</h2>
          <p className="mt-3 text-base text-ink-soft">
            Speak with our team for quick orders and support.
          </p>
          <a
            href={`tel:${phone}`}
            className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            {phone}
          </a>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(36,25,22,0.04)]">
          <div className="grid size-12 place-items-center rounded-full bg-accent text-ink">
            <Mail className="size-5" aria-hidden />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink">Email Us</h2>
          <p className="mt-3 text-base text-ink-soft">
            For custom orders, enquiries, and event requests.
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            {email}
          </a>
        </div>

        <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_12px_30px_rgba(36,25,22,0.04)]">
          <div className="grid size-12 place-items-center rounded-full bg-surface-alt text-ink">
            <MapPin className="size-5" aria-hidden />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink">Find Us</h2>
          <p className="mt-3 text-base text-ink-soft">
            Visit us in Lagos and enjoy fresh meals made for your moment.
          </p>
          <a
            href={locationHref}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            {locationLabel}
          </a>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-[0_12px_30px_rgba(36,25,22,0.04)] sm:p-6">
          <h2 className="text-2xl font-semibold text-ink">
            Contact Information
          </h2>

          <div className="mt-5 space-y-3">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3.5 text-ink transition hover:border-primary/50 hover:bg-[#fffaf5]"
            >
              <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm uppercase tracking-[0.12em] text-ink-soft">
                  Email Us
                </span>
                <span className="mt-1 block font-medium text-ink">{email}</span>
              </span>
            </a>

            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3.5 text-ink transition hover:border-primary/50 hover:bg-[#fffaf5]"
            >
              <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Phone className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm uppercase tracking-[0.12em] text-ink-soft">
                  WhatsApp
                </span>
                <span className="mt-1 block font-medium text-ink">{phone}</span>
              </span>
            </a>

            <div className="rounded-2xl border border-line bg-paper p-3.5">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] text-ink-soft">
                    Our Location
                  </p>
                  <p className="mt-1 text-base font-medium text-ink">
                    {locationLabel}
                  </p>
                  <a
                    href={locationHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-3.5">
              <p className="text-sm uppercase tracking-[0.12em] text-ink-soft">
                Follow Us
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={
                    site.contact.instagram ||
                    "https://www.instagram.com/ashake_alase/"
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  aria-label="Instagram"
                >
                  <span className="text-lg">◎</span>
                </a>
                <a
                  href={
                    site.contact.tiktok ||
                    "https://www.tiktok.com/@ashake.alase?_r=1&_t=ZS-99uuWweZY1Q"
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  aria-label="TikTok"
                >
                  <span className="text-base font-bold">♪</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.9rem] border border-line bg-[linear-gradient(180deg,#fffaf5_0%,#fff_100%)] p-4 shadow-[0_22px_50px_rgba(36,25,22,0.08)] sm:p-6 lg:p-7">
          <h2 className="text-2xl font-semibold text-ink">Send a Message</h2>

          <form className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink placeholder:text-ink-soft/70 transition duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block text-sm font-medium text-ink">
                Email
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink placeholder:text-ink-soft/70 transition duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Phone (Optional)
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink placeholder:text-ink-soft/70 transition duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block text-sm font-medium text-ink">
                Subject
                <select
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink transition duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="" disabled>
                    What is this about?
                  </option>
                  <option>Order enquiry</option>
                  <option>Delivery enquiry</option>
                  <option>Food / Package enquiry</option>
                  <option>General enquiry</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-ink">
              Message
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink placeholder:text-ink-soft/70 transition duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              <MessageSquareText className="mr-2 size-4" aria-hidden />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
