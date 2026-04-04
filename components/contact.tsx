"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, MapPin, Clock, Send, Instagram } from "lucide-react"
import { WhatsappIcon } from "@/components/icons/whatsapp"
import { cn } from "@/lib/utils"
import type { HomepageContent } from "@/lib/homepage-content/schema"

export function Contact({ content }: { content: HomepageContent["contact"] }) {
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
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Gönderim başarısız")
      }
      setIsSubmitted(true)
      setFormData({ name: "", phone: "", email: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch {
      setIsSubmitted(true)
      setFormData({ name: "", phone: "", email: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const addressLines = content.addressText.split("\n").filter(Boolean)

  return (
    <section id="iletisim" className="py-24 bg-background">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              {content.badge}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {content.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {content.intro}
            </p>

            <div className="space-y-6">
              <div className="group flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary transition-[background-color,box-shadow] duration-200 group-hover:bg-primary/13 group-hover:shadow-sm group-hover:ring-2 group-hover:ring-primary/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">{content.phoneTitle}</h3>
                  <a
                    href={content.phoneHref}
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {content.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{content.appointmentTitle}</h3>
                  <p className="text-muted-foreground">
                    {content.appointmentText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{content.addressTitle}</h3>
                  <p className="text-muted-foreground">
                    {addressLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < addressLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{content.hoursTitle}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {content.hoursText}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="mb-4 font-semibold text-foreground">{content.socialTitle}</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={content.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-3 text-foreground transition-colors hover:border-foreground/15 hover:bg-muted/70"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={content.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-3 text-foreground transition-colors hover:border-foreground/15 hover:bg-muted/70"
                  aria-label="WhatsApp"
                >
                  <WhatsappIcon className="h-5 w-5" />
                </a>
                <a
                  href={content.phoneHref}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-3 text-foreground transition-colors hover:border-foreground/15 hover:bg-muted/70"
                  aria-label={`Telefon: ${content.phoneDisplay}`}
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-card rounded-2xl p-8 shadow-xl shadow-primary/5 border border-border"
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
              {content.formTitle}
            </h3>
            <p className="text-muted-foreground mb-6">
              {content.formSubtitle}
            </p>

            {isSubmitted ? (
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {content.formSuccessTitle}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {content.formSuccessText}
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
                      "resize-none",
                    )}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {content.privacyNote}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 rounded-2xl overflow-hidden border border-border shadow-sm h-[400px]"
        >
          <iframe
            src={content.mapEmbedSrc}
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
