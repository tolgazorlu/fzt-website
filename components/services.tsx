"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Activity, 
  Hand, 
  Bone, 
  Dumbbell, 
  Brain, 
  Heart,
  ArrowRight
} from "lucide-react"
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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
}

const services = [
  {
    icon: Activity,
    title: "Fizyoterapi ve Rehabilitasyon",
    description: "Kas-iskelet sistemi rahatsızlıkları, spor yaralanmaları, bel ve boyun ağrısı, omuz ve diz problemleri gibi durumlara yönelik değerlendirme ve uygulamalar yapılmaktadır.",
    details: ["Bireysel değerlendirme", "Kişiye özel egzersiz programları", "Hareket fonksiyonlarının desteklenmesi"],
  },
  {
    icon: Hand,
    title: "Manuel Terapi",
    description: "Avrupa'nın ileri teknikleriyle hareket kabiliyetinizi artırıyor, ağrılarınızı azaltıyor ve yaşam kalitenizi yükseltiyorum.",
    details: ["Eklem mobilizasyonu", "Yumuşak doku teknikleri", "Kişiye özel uygulama"],
  },
  {
    icon: Bone,
    title: "Spor Yaralanmaları",
    description: "Sporcularda performans ve sakatlanma sonrası rehabilitasyon süreçlerine yönelik fizyoterapi yaklaşımları uygulanmaktadır.",
    details: ["Ön çapraz bağ kopması", "Diz ağrısı", "Tenisçi dirseği"],
  },
  {
    icon: Dumbbell,
    title: "Kişiye Özel Egzersiz",
    description: "Değerlendirme sonrası kişiye uygun fizyoterapi ve egzersiz programları planlanarak hareket fonksiyonlarının desteklenmesi amaçlanır.",
    details: ["Bel fıtığı", "Boyun fıtığı", "Omuz ağrısı"],
  },
  {
    icon: Brain,
    title: "Medikal Masaj",
    description: "Sağlığınıza bilimsel ve profesyonel bir dokunuş sunuyorum. Manuel terapi ve medikal masaj ile ağrı yönetimi.",
    details: ["Fibromiyalji", "Skolyoz", "Kronik ağrı"],
  },
  {
    icon: Heart,
    title: "Nörolojik Rehabilitasyon",
    description: "Felç sonrası rehabilitasyon ve hareket fonksiyonlarının geri kazanılmasına yönelik bütüncül yaklaşım.",
    details: ["Felç rehabilitasyonu", "Fonksiyonel iyileşme", "Yaşam kalitesi artırma"],
  },
]

export function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
            Profesyonel Çözümler
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Uzmanlık Alanları
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Randevu sistemi ile sunulan, bireysel değerlendirme sonrası kişiye özel fizyoterapi hizmetleri
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className={cn(
                "group relative bg-card rounded-2xl p-6 border border-border transition-all duration-300 cursor-pointer overflow-hidden",
                hoveredIndex === index 
                  ? "shadow-xl shadow-primary/10 border-primary/30 -translate-y-1" 
                  : "hover:shadow-lg hover:border-primary/20"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Gradient accent on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 transition-opacity duration-300",
                hoveredIndex === index ? "opacity-100" : "opacity-0"
              )} />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    hoveredIndex === index 
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25" 
                      : "bg-primary/10 text-primary"
                  )}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {service.title}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Details list */}
                <ul className="space-y-2 mb-4">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className={cn(
                  "flex items-center gap-2 text-primary text-sm font-medium transition-all duration-300",
                  hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                )}>
                  <span>Daha Fazla</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
