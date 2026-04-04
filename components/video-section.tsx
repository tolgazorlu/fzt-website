"use client"

import { useCallback, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomepageContent } from "@/lib/homepage-content/schema"

const listContainerAnimated = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
}

const listItemAnimated = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function VideoSection({ content }: { content: HomepageContent["videos"] }) {
  const ref = useRef(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.08 })
  const items = content.items.filter((i) => i.videoId.trim())
  if (items.length === 0) return null

  const scrollByDirection = useCallback((dir: "prev" | "next") => {
    const el = trackRef.current
    if (!el) return
    const slide = el.querySelector<HTMLElement>("[data-carousel-slide]")
    const gap = 16
    const step = slide ? slide.offsetWidth + gap : Math.round(el.clientWidth * 0.75)
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" })
  }, [])

  return (
    <section
      id="videolar"
      className="relative overflow-hidden py-24 bg-linear-to-b from-muted/45 via-background to-background"
    >
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/7 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-accent/8 blur-3xl"
        aria-hidden
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Play className="h-4 w-4 fill-current" aria-hidden />
            {content.badge}
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
        </motion.div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Önceki videolar"
            className="hidden h-11 w-11 shrink-0 rounded-full border-border/80 bg-background/90 text-foreground shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/15 dark:hover:text-primary md:inline-flex"
            onClick={() => scrollByDirection("prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <motion.div
            ref={trackRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            variants={listContainerAnimated}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            role="list"
          >
            {items.map((item, index) => {
              const id = item.videoId.trim()
              const title = item.caption?.trim() || `YouTube Shorts — ${index + 1}`
              return (
                <motion.div
                  key={`${id}-${index}`}
                  data-carousel-slide
                  variants={listItemAnimated}
                  role="listitem"
                  className="flex w-[min(280px,calc(100vw-4.5rem))] shrink-0 snap-start flex-col gap-2 sm:w-[min(280px,42vw)] lg:w-[260px]"
                >
                  <div className="relative aspect-9/16 w-full overflow-hidden rounded-3xl bg-muted">
                    <iframe
                      className="absolute inset-0 h-full w-full rounded-3xl border-0"
                      src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0`}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  {item.caption?.trim() ? (
                    <p className="line-clamp-2 text-center text-sm font-medium text-foreground">
                      {item.caption.trim()}
                    </p>
                  ) : null}
                </motion.div>
              )
            })}
          </motion.div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Sonraki videolar"
            className="hidden h-11 w-11 shrink-0 rounded-full border-border/80 bg-background/90 text-foreground shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/15 dark:hover:text-primary md:inline-flex"
            onClick={() => scrollByDirection("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
