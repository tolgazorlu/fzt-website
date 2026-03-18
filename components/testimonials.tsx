"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Sadriye N.",
    text: "İyi ki varsınız. Şubeniz her doğrultuda harika olmuş. Beni de dirilttiniz şükürler olsun. Gönülden selam ve sevgilerimi gönderiyorum.",
    condition: "Kas-İskelet Sistemi Rahatsızlığı",
  },
  {
    name: "Nalan D.",
    text: "Orta seviye bel fıtığım vardı. Omurgamda ciddi ağrılarım vardı. 2020 miladım oldu, iyi ki yolum size düştü. Teşekkür ederim.",
    condition: "Bel Fıtığı",
  },
  {
    name: "Okan T.",
    text: "İyi ki varsınız. Oğlumun bel ağrıları sayenizde yok oldu. Anne, baba olarak bizleri çok rahatlattınız.",
    condition: "Bel Ağrısı",
  },
  {
    name: "Halide N.",
    text: "20 yıllık fibromiyalji hastasıydım. İşin gerçeği size geldiğimde çok da ümidim yoktu ama beni 3 seansta tekrar hayata döndürdünüz. Şimdi size her gün duacıyım.",
    condition: "Fibromiyalji",
  },
  {
    name: "Mehmet A.",
    text: "Spor yaralanması sonrası dizimde ciddi sorunlar yaşıyordum. Profesyonel yaklaşımınız sayesinde kısa sürede eski formuma kavuştum.",
    condition: "Spor Yaralanması",
  },
  {
    name: "Ayşe K.",
    text: "Boyun fıtığı nedeniyle çektiğim ağrılar dayanılmazdı. Manuel terapi seansları sonrasında hayatım değişti. Herkese tavsiye ediyorum.",
    condition: "Boyun Fıtığı",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const visibleTestimonials = () => {
    const items = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length
      items.push({ ...testimonials[index], originalIndex: index })
    }
    return items
  }

  return (
    <section id="yorumlar" className="py-24 bg-secondary">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            Danışan Deneyimleri
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Danışan Yorumları
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Mutlu danışanlarımızın deneyimlerinden bazıları
          </p>
        </motion.div>

        {/* Desktop View */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          className="hidden md:grid md:grid-cols-3 gap-6 mb-8"
        >
          {visibleTestimonials().map((testimonial, index) => (
            <motion.div
              key={testimonial.originalIndex}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className={cn(
                "bg-card rounded-2xl p-6 border border-border transition-all duration-500",
                index === 1 ? "shadow-xl shadow-primary/10 scale-105 border-primary/30 ring-2 ring-primary/10" : "opacity-90 hover:opacity-100 hover:shadow-lg"
              )}
            >
              <Quote className="h-8 w-8 text-primary/40 mb-4" />
              <p className="text-foreground leading-relaxed mb-6 min-h-[120px]">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.condition}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-xl shadow-primary/5"
            >
            <Quote className="h-8 w-8 text-primary/30 mb-4" />
            <p className="text-foreground leading-relaxed mb-6">
              &ldquo;{testimonials[currentIndex].text}&rdquo;
            </p>
            <div className="border-t border-border pt-4">
              <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[currentIndex].condition}</p>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-secondary hover:bg-primary/10 transition-colors border border-border"
            aria-label="Önceki yorum"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex ? "bg-primary w-6" : "bg-border hover:bg-primary/50"
                )}
                aria-label={`Yorum ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-secondary hover:bg-primary/10 transition-colors border border-border"
            aria-label="Sonraki yorum"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  )
}
