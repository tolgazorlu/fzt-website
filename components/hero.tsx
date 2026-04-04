"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, ArrowRight, CheckCircle2 } from "lucide-react"
import type { HomepageContent } from "@/lib/homepage-content/schema"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

const photoVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.3 },
  },
}

export function Hero({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section
      id="anasayfa"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.98_0.005_250)_0%,oklch(0.96_0.008_250)_50%,oklch(0.97_0.006_250)_100%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 100% 80% at 20% 0%, oklch(0.45 0.12 195 / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 100% 100%, oklch(0.55 0.18 165 / 0.06) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.2_0_0)_1px, transparent 1px),
            linear-gradient(90deg, oklch(0.2_0_0)_1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            className="lg:col-span-7"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-semibold mb-8 border border-primary/15">
              <CheckCircle2 className="h-4 w-4" />
              {content.badge}
            </motion.div>

            <motion.h1 variants={item} className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-bold text-foreground leading-[1.08] mb-6 tracking-tight">
              {content.headlineLine1}
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                {content.headlineAccent}
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg text-foreground/80 leading-relaxed mb-8 max-w-xl font-medium">
              {content.subtitle}
            </motion.p>

            <motion.p variants={item} className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
              {content.description}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base px-8 h-14 rounded-xl group font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all" asChild>
                  <Link href={content.primaryCtaHref} className="flex items-center gap-2">
                    {content.primaryCtaLabel}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-14 rounded-xl border-2 font-medium text-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-foreground"
                  asChild
                >
                  <Link href={content.secondaryCtaHref}>{content.secondaryCtaLabel}</Link>
                </Button>
              </div>
              <a
                href={content.phoneHref}
                className="flex items-center gap-3 text-foreground font-semibold hover:text-primary transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span>{content.phoneDisplay}</span>
              </a>
            </motion.div>

            <motion.div variants={item} className="mt-12 pt-8 border-t border-border/60 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{content.locationLine}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>{content.hoursLine}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative"
            variants={photoVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-black/5">
                <Image
                  src={content.imageSrc}
                  alt={content.imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-2xl bg-primary/10" />
              <div className="absolute -left-4 -bottom-4 lg:left-0 lg:bottom-8 bg-card rounded-xl p-4 shadow-xl border border-border/50 shadow-primary/5">
                <p className="text-xs font-medium text-muted-foreground mb-1">{content.floatingCardLabel}</p>
                <p className="text-sm font-semibold text-foreground">{content.floatingCardText}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground/70 font-medium tracking-wider uppercase">{content.scrollHint}</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-muted-foreground/40 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
