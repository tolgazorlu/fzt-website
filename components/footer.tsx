import Link from "next/link"
import { Phone, MapPin, Instagram } from "lucide-react"
import { WhatsappIcon } from "@/components/icons/whatsapp"
import type { HomepageContent } from "@/lib/homepage-content/schema"

export function Footer({ content }: { content: HomepageContent["footer"] }) {
  return (
    <footer className="relative bg-foreground text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.45_0.12_195/0.15),transparent)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <span className="text-xl font-semibold">{content.brandTitle}</span>
              <p className="text-primary-foreground/60 text-sm mt-1">
                {content.brandSubtitle}
              </p>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={content.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-primary-foreground/10 p-2.5 transition-colors duration-200 hover:bg-primary-foreground/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={content.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-primary-foreground/10 p-2.5 transition-colors duration-200 hover:bg-primary-foreground/20"
                aria-label="WhatsApp"
              >
                <WhatsappIcon className="h-5 w-5" />
              </a>
              <a
                href={content.phoneHref}
                className="rounded-xl bg-primary-foreground/10 p-2.5 transition-colors duration-200 hover:bg-primary-foreground/20"
                aria-label={`Telefon: ${content.phoneDisplay}`}
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              {content.quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              {content.serviceLinks.map((item) => (
                <li key={item.label + item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={content.phoneHref}
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {content.phoneDisplay}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-1" />
                  <span className="whitespace-pre-line">{content.addressBlock}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} {content.brandTitle} - {content.copyrightSuffix}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href={content.privacyHref} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              {content.privacyLabel}
            </Link>
            <Link href={content.kvkkHref} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              {content.kvkkLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
