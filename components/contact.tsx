"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, MapPin, Clock, Send, Instagram, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", phone: "", email: "", message: "" })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="iletisim" className="py-24 bg-background">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              İletişim
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Randevu ve Bilgi İçin
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Sorularınız için bize ulaşın veya randevu almak için formu doldurun. 
              En kısa sürede size dönüş yapacağız.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <Phone className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                  <a
                    href="tel:+905427674299"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    0542 767 42 99
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Randevu</h3>
                  <p className="text-muted-foreground">
                    Randevu için 0542 767 42 99 numaralı telefondan arayabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Adres</h3>
                  <p className="text-muted-foreground">
                    Kubist Park Residence, Adnan Kahveci, Avrupa Cd. no:108 / Daire:370<br />
                    34528 Beylikdüzü/İstanbul
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Çalışma Saatleri</h3>
                  <p className="text-muted-foreground">
                    Pazartesi - Cumartesi: 09:00 - 20:00<br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">Sosyal Medya</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-3 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-foreground" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label="Youtube"
                >
                  <Youtube className="h-5 w-5 text-foreground" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-card rounded-2xl p-8 shadow-xl shadow-primary/5 border border-border"
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
              Bilgilerinizi Bırakın
            </h3>
            <p className="text-muted-foreground mb-6">
              Biz sizi arayalım
            </p>

            {isSubmitted ? (
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  Mesajınız Alındı!
                </h4>
                <p className="text-muted-foreground text-sm">
                  En kısa sürede sizinle iletişime geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Ad Soyad
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Telefon
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    E-posta
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@ornek.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Mesajınız (Opsiyonel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Şikayetiniz veya sorularınızı yazabilirsiniz..."
                    value={formData.message}
                    onChange={handleChange}
                    className={cn(
                      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      "resize-none"
                    )}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Kişisel verileriniz sizinle irtibat kurmak için alınmakta ve işlenmektedir.
                </p>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Gönderiliyor...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Gönder
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 rounded-2xl overflow-hidden border border-border shadow-sm h-[400px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1505.13!2d28.625225528835433!3d41.00817107692577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjQiTiAyOMKwMzcnMzAuOCJF!5e0!3m2!1str!2str!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Konum Haritası"
          />
        </motion.div>
      </div>
    </section>
  )
}
