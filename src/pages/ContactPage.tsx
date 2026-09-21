import { AtSign, Mail, Phone } from 'lucide-react'
import { site } from '@/config/site'

export default function ContactPage() {
  const { phone, email, instagram } = site.contact
  const rows = [
    { icon: Phone, label: 'Phone', value: phone, href: phone ? `tel:${phone}` : '' },
    { icon: Mail, label: 'Email', value: email, href: email ? `mailto:${email}` : '' },
    { icon: AtSign, label: 'Instagram', value: instagram ? 'Follow us' : '', href: instagram },
  ]
  return (
    <div className="container-page pb-20 pt-6 lg:pb-28 lg:pt-12">
      <h1 className="text-[clamp(2.75rem,8vw,5.5rem)]">Contact</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-soft">Questions about an order or an upcoming event? Reach us here. Have your order number ready if you are asking about an existing order.</p>

      <ul className="mt-10 max-w-xl divide-y divide-line border-y border-line">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex items-center gap-4 py-5">
            <span className="grid size-12 place-items-center rounded-full bg-surface-alt text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-ink-soft">{label}</p>
              {value ? (
                <a href={href} className="text-lg font-semibold underline-offset-4 hover:underline">
                  {value}
                </a>
              ) : (
                <p className="text-lg text-ink-soft">To be added</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
