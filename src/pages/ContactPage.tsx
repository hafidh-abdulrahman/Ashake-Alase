import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { site } from "@/config/site";
import { Seo } from "@/components/Seo";

function InstagramIcon({ className = "size-6" }: { className?: string }) {
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

function TikTokIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 11.14 4.15c.08-.12.15-.25.21-.39V10.2a8.3 8.3 0 0 0 3.24.66Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ContactPage() {
  const { phone, email, address, instagram, tiktok } = site.contact;
  const locationHref = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [gmailUrl, setGmailUrl] = useState<string | null>(null);

  const updateForm = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submitContactForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `Customer Name: ${form.name.trim()}`,
      `Customer Email: ${form.email.trim()}`,
      `Customer Phone: ${form.phone.trim() || "Not provided"}`,
      `Subject: ${form.subject.trim()}`,
      "",
      "Message:",
      form.message.trim(),
    ].join("\n");
    const gmailUrl =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(email)}` +
      `&su=${encodeURIComponent(form.subject.trim())}` +
      `&body=${encodeURIComponent(body)}`;
    const gmailWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");
    if (!gmailWindow) setGmailUrl(gmailUrl);
  };

  return (
    <div className="container-page max-w-[80rem] pb-20 pt-10 sm:pb-24 lg:pt-16">
      <Seo
        title="Contact Ashake Alase | Food Orders and Enquiries"
        description="Contact Ashake Alase in Lagos for food orders, catering enquiries, delivery questions and customer support."
        path="/contact"
      />
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl text-ink md:text-5xl">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
          Have a question, feedback, or need help with an order? We&apos;re here
          for you. Drop us a line and we&apos;ll get back to you as soon as
          possible.
        </p>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-3xl border border-line/80 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(36,25,22,0.55)] sm:p-8">
          <h2 className="text-2xl text-ink">Contact Information</h2>
          <div className="mt-6 space-y-4">
            <div className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-primary/5 sm:p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Mail className="size-6" aria-hidden />
              </span>
              <span className="min-w-0 pt-0.5">
                <span className="block text-base font-bold text-ink">
                  Email Us
                </span>
                <span className="mt-1 block wrap-break-word text-sm text-ink-soft group-hover:text-primary">
                  {email}
                </span>
              </span>
            </div>

            <a
              href={`tel:${phone}`}
              className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-primary/5 sm:p-4"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Phone className="size-6" aria-hidden />
              </span>
              <span className="pt-0.5">
                <span className="block text-base font-bold text-ink">
                  Phone
                </span>
                <span className="mt-1 block text-sm text-ink-soft group-hover:text-primary">
                  {phone}
                </span>
              </span>
            </a>

            <div className="flex items-start gap-4 rounded-2xl p-3 sm:p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-6" aria-hidden />
              </span>
              <span className="pt-0.5">
                <span className="block text-base font-bold text-ink">
                  Our Location
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {address}
                </span>
                <a
                  href={locationHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-dark"
                >
                  Open in Google Maps
                  <MapPin className="size-4" aria-hidden />
                </a>
              </span>
            </div>

            {(instagram || tiktok) && (
              <div className="border-t border-line/80 pt-6">
                <h3 className="text-base font-bold text-ink">Follow Us</h3>
                <div className="mt-4 flex items-center gap-4">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex size-14 items-center justify-center rounded-2xl bg-ink/5 text-ink transition-colors hover:bg-primary hover:text-white"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="size-6" />
                    </a>
                  )}
                  {tiktok && (
                    <a
                      href={tiktok}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-ink/5 px-5 font-bold text-ink transition-colors hover:bg-primary hover:text-white"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="size-5" />
                      TikTok
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-line/80 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(36,25,22,0.55)] sm:p-8">
          <h2 className="text-2xl text-ink">Send a Message</h2>
          <form className="mt-6 space-y-5" onSubmit={submitContactForm}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-primary/5 px-3 text-base text-ink placeholder:text-ink-soft/70 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Email
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-primary/5 px-3 text-base text-ink placeholder:text-ink-soft/70 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:text-sm"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Phone{" "}
                <span className="font-normal text-ink-soft">(Optional)</span>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-primary/5 px-3 text-base text-ink placeholder:text-ink-soft/70 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Subject
                <select
                  value={form.subject}
                  onChange={(event) =>
                    updateForm("subject", event.target.value)
                  }
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-primary/5 px-3 text-base text-ink transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:text-sm"
                >
                  <option value="" disabled>
                    What is this about?
                  </option>
                  <option>General Enquiry</option>
                  <option>Order Enquiry</option>
                  <option>Catering / Event</option>
                  <option>Delivery</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-ink">
              Message
              <textarea
                rows={5}
                placeholder="How can we help you?"
                value={form.message}
                onChange={(event) => updateForm("message", event.target.value)}
                required
                className="mt-2 min-h-[132px] w-full resize-y rounded-xl border border-line bg-primary/5 px-3 py-3 text-base text-ink placeholder:text-ink-soft/70 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:text-sm"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-lg font-bold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              <Send className="size-5" aria-hidden />
              Send Message
            </button>
            {gmailUrl && (
              <a
                href={gmailUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Open Gmail
              </a>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
