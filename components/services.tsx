"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { getHomepageIcon } from "@/lib/homepage-content/icons"
import type { HomepageContent } from "@/lib/homepage-content/schema"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function Services({
  content,
}: {
  content: HomepageContent["services"]
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="hizmetler" className="py-24 bg-background">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            {content.badge}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {content.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.items.map((service, index) => {
            const Icon = getHomepageIcon(service.icon)
            return (
              <motion.div
                key={`${service.title}-${index}`}
                variants={item}
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6",
                  "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-md",
                )}
                whileTap={{ scale: 0.995 }}
              >
                <div className="relative flex flex-1 flex-col">
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "rounded-xl p-3 text-primary transition-[background-color,box-shadow] duration-200",
                        "bg-primary/10",
                        "group-hover:bg-primary/13 group-hover:shadow-sm group-hover:ring-2 group-hover:ring-primary/20",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {service.title}
                    </h3>
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
                    {service.description}
                  </p>

                  <ul className="mt-auto space-y-2 border-t border-border/60 pt-4">
                    {service.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-foreground/80 transition-colors duration-200 group-hover:text-foreground"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
