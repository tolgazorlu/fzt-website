"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, GraduationCap, TrendingUp, Award } from "lucide-react"

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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
}

const stats = [
  {
    icon: Users,
    label: "Bireysel Değerlendirme",
    description: "Her danışana özel değerlendirme sonrası kişiye uygun fizyoterapi ve egzersiz programları planlanır.",
  },
  {
    icon: GraduationCap,
    label: "Uluslararası Deneyim",
    description: "Almanya'da Physiocorpus (Köln) deneyimi ve Bezmialem Vakıf Üniversitesi eğitimi.",
  },
  {
    icon: TrendingUp,
    label: "Spor Fizyoterapisi",
    description: "Sporcularda performans ve sakatlanma sonrası rehabilitasyon süreçlerine yönelik uzmanlık.",
  },
  {
    icon: Award,
    label: "Avrupa Teknikleri",
    description: "Manuel terapi, medikal masaj ve kişiye özel egzersiz programlarıyla bilimsel yaklaşım.",
  },
]

export function Stats() {
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
            Neden Biz
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Uzmanlık Alanlarım
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border hover:border-primary/20 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <stat.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {stat.label}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
