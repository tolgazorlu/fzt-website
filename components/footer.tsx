import Link from "next/link"
import { Phone, MapPin, Instagram, Youtube } from "lucide-react"

const quickLinks = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#hakkimda", label: "Hakkımda" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#istatistikler", label: "Başarılarımız" },
  { href: "#yorumlar", label: "Yorumlar" },
  { href: "#iletisim", label: "İletişim" },
]

const services = [
  "Fizyoterapi ve Rehabilitasyon",
  "Manuel Terapi",
  "Spor Yaralanmaları",
  "Medikal Masaj",
  "Kişiye Özel Egzersiz",
  "Bel ve Boyun Ağrısı",
]

export function Footer() {
  return (
    <footer className="relative bg-foreground text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.45_0.12_195/0.15),transparent)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <span className="text-xl font-semibold">Fzt. İlimdar Taştanoğlu</span>
              <p className="text-primary-foreground/60 text-sm mt-1">
                Özel Sağlık Meslek Hizmet Birimi
              </p>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Fizyoterapi ve rehabilitasyon hizmetleri. Randevu sistemi ile hizmet verilmektedir.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 bg-primary-foreground/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-primary-foreground/10 rounded-xl hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
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

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-6">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="#hizmetler"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+905427674299"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  0542 767 42 99
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 mt-1" />
                  <span>
                    Kubist Park Residence,<br />
                    Adnan Kahveci, Avrupa Cd. no:108 / Daire:370,<br />
                    34528 Beylikdüzü/İstanbul
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Fzt. İlimdar Taştanoğlu - Özel Sağlık Meslek Hizmet Birimi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              KVKK Aydınlatma Metni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
