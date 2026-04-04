"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { getHomepageIcon } from "@/lib/homepage-content/icons"
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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function Stats({ content }: { content: HomepageContent["stats"] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="istatistikler" className="py-24 bg-gradient-to-b from-secondary to-background">
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
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {content.title}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {content.items.map((stat, index) => {
            const Icon = getHomepageIcon(stat.icon)
            return (
              <motion.div
                key={`${stat.label}-${index}`}
                variants={item}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary transition-[background-color,box-shadow] duration-200 group-hover:bg-primary/13 group-hover:shadow-sm group-hover:ring-2 group-hover:ring-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {stat.label}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
