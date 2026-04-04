"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import type { HomepageContent } from "@/lib/homepage-content/schema"

export function About({ content }: { content: HomepageContent["about"] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="hakkimda" className="py-24 bg-background">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-border/50">
              <Image
                src={content.imageSrc}
                alt={content.imageAlt}
                fill
                className="object-cover object-top"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              {content.badge}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {content.title}
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {content.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">{content.interestTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {content.interestAreas.map((area) => (
                  <span
                    key={area}
                    className="cursor-default rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/15 hover:bg-muted/70"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
