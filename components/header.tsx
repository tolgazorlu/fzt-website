"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#hakkimda", label: "Hakkımda" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#istatistikler", label: "Başarılarımız" },
  { href: "#yorumlar", label: "Yorumlar" },
  { href: "/blog", label: "Blog" },
  { href: "#iletisim", label: "İletişim" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground tracking-tight">
                Fzt. İlimdar Taştanoğlu
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Fizyoterapi ve Rehabilitasyon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+905427674299"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>0542 767 42 99</span>
            </a>
            <Button asChild className="rounded-xl">
              <Link href="#iletisim">Randevu Al</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <a
                href="tel:+905427674299"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <Phone className="h-4 w-4" />
                <span>0542 767 42 99</span>
              </a>
              <Button asChild className="w-full mt-3">
                <Link href="#iletisim">Randevu Al</Link>
              </Button>
            </div>
          </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
