"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

const achievements = [
  "Bezmialem Vakıf Üniversitesi",
  "Spor Fizyoterapisi Yüksek Lisans (Devam Ediyor)",
  "Physiocorpus, Köln, Almanya - Uluslararası Deneyim",
  "Manuel Terapi Uzmanlığı",
  "Medikal Masaj",
  "Kişiye Özel Egzersiz Programları",
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="hakkimda" className="py-24 bg-background">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-border/50">
              <Image
                src="https://s3-eu-west-1.amazonaws.com/doktortakvimi.com/doctor/ea46ef/ea46ef99f23ad32ae9f61c4af042d689_large.jpg"
                alt="Fizyoterapist İlimdar Taştanoğlu"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Quote Card - Modern glass */}
            <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-card/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl max-w-xs border border-border/50">
              <blockquote className="text-foreground italic text-sm leading-relaxed">
                &ldquo;Almanya&apos;da edindiğim uluslararası deneyimle, Avrupa&apos;nın ileri teknikleriyle 
                hareket kabiliyetinizi artırıyor, ağrılarınızı azaltıyor ve yaşam kalitenizi yükseltiyorum.&rdquo;
              </blockquote>
              <p className="mt-3 text-primary font-semibold text-sm">
                — Fzt. İlimdar Taştanoğlu
              </p>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              Hakkımda
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Fzt. İlimdar Taştanoğlu
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Almanya&apos;da edindiğim uluslararası deneyimle, şimdi Türkiye&apos;de hizmetinizdeyim. Spor fizyoterapisi 
                yüksek lisans eğitimime devam ederken, Avrupa&apos;nın ileri teknikleriyle hareket kabiliyetinizi artırıyor, 
                ağrılarınızı azaltıyor ve yaşam kalitenizi yükseltiyorum.
              </p>
              <p>
                Manuel terapi, medikal masaj ve kişiye özel egzersiz programlarıyla sağlığınıza bilimsel ve 
                profesyonel bir dokunuş sunuyorum.
              </p>
              <p>
                Özel Sağlık Meslek Hizmet Birimi olarak kas-iskelet sistemi rahatsızlıkları, spor yaralanmaları, 
                bel ve boyun ağrısı, omuz ve diz problemleri gibi durumlara yönelik değerlendirme ve uygulamalar 
                yapılmaktadır. Hizmetler randevu sistemi ile sunulmaktadır.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            {/* İlgi Alanları */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">İlgi Alanları</h4>
              <div className="flex flex-wrap gap-2">
                {["Omuz Ağrısı", "Bel fıtığı", "Boyun Fıtığı", "Diz Ağrısı", "Ön Çapraz Bağ Kopması", "Tenisçi Dirseği", "Felç", "Skolyoz", "Fibromiyalji"].map((area) => (
                  <span key={area} className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
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
