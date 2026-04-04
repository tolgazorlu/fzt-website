"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { HomepageContent, HomepageIconName } from "@/lib/homepage-content/schema"
import { HOMEPAGE_ICON_OPTIONS } from "@/lib/homepage-content/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"

function LinkRows({
  links,
  onChange,
}: {
  links: { href: string; label: string }[]
  onChange: (next: { href: string; label: string }[]) => void
}) {
  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[120px] space-y-1">
            <Label className="text-xs text-muted-foreground">href</Label>
            <Input
              value={link.href}
              onChange={(e) => {
                const next = [...links]
                next[i] = { ...next[i], href: e.target.value }
                onChange(next)
              }}
              placeholder="#hizmetler"
            />
          </div>
          <div className="flex-1 min-w-[120px] space-y-1">
            <Label className="text-xs text-muted-foreground">Etiket</Label>
            <Input
              value={link.label}
              onChange={(e) => {
                const next = [...links]
                next[i] = { ...next[i], label: e.target.value }
                onChange(next)
              }}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => onChange(links.filter((_, j) => j !== i))}
            aria-label="Satırı sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => onChange([...links, { href: "#", label: "Yeni" }])}
      >
        <Plus className="h-3.5 w-3.5" />
        Satır ekle
      </Button>
    </div>
  )
}

function IconSelect({
  value,
  onChange,
}: {
  value: HomepageIconName
  onChange: (v: HomepageIconName) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as HomepageIconName)}>
      <SelectTrigger className="w-full max-w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {HOMEPAGE_ICON_OPTIONS.map((name) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function HomepageEditor({ initial }: { initial: HomepageContent }) {
  const router = useRouter()
  const [content, setContent] = useState<HomepageContent>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Kayıt başarısız" })
        return
      }
      setMessage({ type: "ok", text: "Ana sayfa içeriği güncellendi." })
      router.refresh()
    } catch {
      setMessage({ type: "err", text: "Bağlantı hatası" })
    } finally {
      setSaving(false)
    }
  }

  const tabContentClass = "space-y-4 mt-4 max-w-4xl"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Site içeriği
          </p>
          <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Ana sayfa bölümleri</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Metinler, linkler ve listeler kaydedildiğinde canlı siteye yansır.
          </p>
        </div>
        <Button type="button" onClick={save} disabled={saving} className="gap-2 shrink-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Tümünü kaydet
        </Button>
      </div>

      {message ? (
        <p
          className={
            message.type === "ok"
              ? "text-sm font-medium text-foreground"
              : "text-sm text-foreground/90 border border-destructive/25 bg-destructive/5 rounded-md px-3 py-2"
          }
        >
          {message.text}
        </p>
      ) : null}

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 p-1 bg-muted/80">
          <TabsTrigger value="header">Üst bar</TabsTrigger>
          <TabsTrigger value="hero">Kahraman</TabsTrigger>
          <TabsTrigger value="stats">Öne çıkanlar</TabsTrigger>
          <TabsTrigger value="services">Hizmetler</TabsTrigger>
          <TabsTrigger value="about">Hakkımda</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="footer">Alt bilgi</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marka başlığı</Label>
                  <Input
                    value={content.header.brandTitle}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, header: { ...c.header, brandTitle: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marka alt başlığı</Label>
                  <Input
                    value={content.header.brandSubtitle}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        header: { ...c.header, brandSubtitle: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefon (görünen)</Label>
                  <Input
                    value={content.header.phoneDisplay}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        header: { ...c.header, phoneDisplay: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefon linki (tel:)</Label>
                  <Input
                    value={content.header.phoneHref}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, header: { ...c.header, phoneHref: e.target.value } }))
                    }
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA düğmesi</Label>
                  <Input
                    value={content.header.ctaLabel}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, header: { ...c.header, ctaLabel: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA hedefi (href)</Label>
                  <Input
                    value={content.header.ctaHref}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, header: { ...c.header, ctaHref: e.target.value } }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Menü linkleri</Label>
                <LinkRows
                  links={content.header.nav}
                  onChange={(nav) => setContent((c) => ({ ...c, header: { ...c.header, nav } }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["badge", "Rozet"],
                  ["headlineLine1", "Başlık satırı 1"],
                  ["headlineAccent", "Vurgulu başlık"],
                  ["subtitle", "Alt başlık"],
                  ["primaryCtaLabel", "Birincil düğme"],
                  ["primaryCtaHref", "Birincil href"],
                  ["secondaryCtaLabel", "İkincil düğme"],
                  ["secondaryCtaHref", "İkincil href"],
                  ["phoneDisplay", "Telefon görünen"],
                  ["phoneHref", "Telefon href"],
                  ["locationLine", "Konum satırı"],
                  ["hoursLine", "Saat satırı"],
                  ["imageSrc", "Görsel yolu"],
                  ["imageAlt", "Görsel alt metni"],
                  ["floatingCardLabel", "Kart etiketi"],
                  ["floatingCardText", "Kart metni"],
                  ["scrollHint", "Kaydırma ipucu"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    value={content.hero[key]}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        hero: { ...c.hero, [key]: e.target.value },
                      }))
                    }
                  />
                </div>
              ))}
              <div className="space-y-2 sm:col-span-2">
                <Label>Açıklama paragrafı</Label>
                <Textarea
                  rows={5}
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, hero: { ...c.hero, description: e.target.value } }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rozet</Label>
                  <Input
                    value={content.stats.badge}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, stats: { ...c.stats, badge: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input
                    value={content.stats.title}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, stats: { ...c.stats, title: e.target.value } }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Kartlar</Label>
                {content.stats.items.map((it, i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-3">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">İkon</Label>
                        <IconSelect
                          value={it.icon}
                          onChange={(icon) => {
                            const items = [...content.stats.items]
                            items[i] = { ...items[i], icon }
                            setContent((c) => ({ ...c, stats: { ...c.stats, items } }))
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            stats: {
                              ...c.stats,
                              items: c.stats.items.filter((_, j) => j !== i),
                            },
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Başlık</Label>
                      <Input
                        value={it.label}
                        onChange={(e) => {
                          const items = [...content.stats.items]
                          items[i] = { ...items[i], label: e.target.value }
                          setContent((c) => ({ ...c, stats: { ...c.stats, items } }))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Açıklama</Label>
                      <Textarea
                        value={it.description}
                        onChange={(e) => {
                          const items = [...content.stats.items]
                          items[i] = { ...items[i], description: e.target.value }
                          setContent((c) => ({ ...c, stats: { ...c.stats, items } }))
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      stats: {
                        ...c.stats,
                        items: [
                          ...c.stats.items,
                          { icon: "Users", label: "Yeni başlık", description: "" },
                        ],
                      },
                    }))
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Kart ekle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Rozet</Label>
                <Input
                  value={content.services.badge}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      services: { ...c.services, badge: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input
                  value={content.services.title}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      services: { ...c.services, title: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alt başlık</Label>
                <Textarea
                  value={content.services.subtitle}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      services: { ...c.services, subtitle: e.target.value },
                    }))
                  }
                />
              </div>
              {content.services.items.map((svc, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-3">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="space-y-2">
                      <Label className="text-xs">İkon</Label>
                      <IconSelect
                        value={svc.icon}
                        onChange={(icon) => {
                          const items = [...content.services.items]
                          items[i] = { ...items[i], icon }
                          setContent((c) => ({ ...c, services: { ...c.services, items } }))
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          services: {
                            ...c.services,
                            items: c.services.items.filter((_, j) => j !== i),
                          },
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Başlık"
                    value={svc.title}
                    onChange={(e) => {
                      const items = [...content.services.items]
                      items[i] = { ...items[i], title: e.target.value }
                      setContent((c) => ({ ...c, services: { ...c.services, items } }))
                    }}
                  />
                  <Textarea
                    placeholder="Açıklama"
                    value={svc.description}
                    onChange={(e) => {
                      const items = [...content.services.items]
                      items[i] = { ...items[i], description: e.target.value }
                      setContent((c) => ({ ...c, services: { ...c.services, items } }))
                    }}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Madde işaretleri (satır satır)</Label>
                    <Textarea
                      value={svc.details.join("\n")}
                      onChange={(e) => {
                        const items = [...content.services.items]
                        items[i] = {
                          ...items[i],
                          details: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                        setContent((c) => ({ ...c, services: { ...c.services, items } }))
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    services: {
                      ...c.services,
                      items: [
                        ...c.services.items,
                        {
                          icon: "Activity",
                          title: "Yeni hizmet",
                          description: "",
                          details: [],
                        },
                      ],
                    },
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Hizmet ekle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rozet</Label>
                  <Input
                    value={content.about.badge}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, about: { ...c.about, badge: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input
                    value={content.about.title}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, about: { ...c.about, title: e.target.value } }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paragraflar (aralarına boş satır veya ayrım için --- kullanın)</Label>
                <Textarea
                  rows={10}
                  value={content.about.paragraphs.join("\n\n---\n\n")}
                  onChange={(e) => {
                    const parts = e.target.value
                      .split(/\n---\n/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                    setContent((c) => ({ ...c, about: { ...c.about, paragraphs: parts } }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Başarılar (her satır bir madde)</Label>
                <Textarea
                  rows={6}
                  value={content.about.achievements.join("\n")}
                  onChange={(e) => {
                    const list = e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setContent((c) => ({ ...c, about: { ...c.about, achievements: list } }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>İlgi alanları başlığı</Label>
                <Input
                  value={content.about.interestTitle}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      about: { ...c.about, interestTitle: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>İlgi alanları (her satır)</Label>
                <Textarea
                  rows={6}
                  value={content.about.interestAreas.join("\n")}
                  onChange={(e) => {
                    const list = e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setContent((c) => ({ ...c, about: { ...c.about, interestAreas: list } }))
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Görsel yolu</Label>
                  <Input
                    value={content.about.imageSrc}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, about: { ...c.about, imageSrc: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Görsel alt metni</Label>
                  <Input
                    value={content.about.imageAlt}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, about: { ...c.about, imageAlt: e.target.value } }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 grid gap-4">
              {(
                [
                  ["badge", "Rozet"],
                  ["title", "Başlık"],
                  ["intro", "Giriş metni"],
                  ["phoneTitle", "Telefon başlığı"],
                  ["phoneDisplay", "Telefon (görünen)"],
                  ["phoneHref", "Telefon linki"],
                  ["appointmentTitle", "Randevu başlığı"],
                  ["appointmentText", "Randevu metni"],
                  ["addressTitle", "Adres başlığı"],
                  ["hoursTitle", "Saatler başlığı"],
                  ["socialTitle", "Hızlı iletişim başlığı"],
                  ["instagramHref", "Instagram URL"],
                  ["whatsappHref", "WhatsApp URL (ör. wa.me)"],
                  ["formTitle", "Form başlığı"],
                  ["formSubtitle", "Form alt başlığı"],
                  ["formSuccessTitle", "Gönderim başarı başlığı"],
                  ["formSuccessText", "Gönderim başarı metni"],
                  ["privacyNote", "Gizlilik notu"],
                  ["mapEmbedSrc", "Harita embed URL"],
                ] as const
              ).map(([key, labelTr]) => (
                <div key={key} className="space-y-2">
                  <Label>{labelTr}</Label>
                  {key === "intro" ||
                  key === "appointmentText" ||
                  key === "privacyNote" ||
                  key === "mapEmbedSrc" ? (
                    <Textarea
                      rows={key === "mapEmbedSrc" ? 3 : key === "intro" ? 4 : 3}
                      value={content.contact[key]}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          contact: { ...c.contact, [key]: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    <Input
                      value={content.contact[key]}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          contact: { ...c.contact, [key]: e.target.value },
                        }))
                      }
                    />
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <Label>Adres (çok satır)</Label>
                <Textarea
                  rows={4}
                  value={content.contact.addressText}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      contact: { ...c.contact, addressText: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Çalışma saatleri metni</Label>
                <Textarea
                  rows={3}
                  value={content.contact.hoursText}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      contact: { ...c.contact, hoursText: e.target.value },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className={tabContentClass}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marka</Label>
                  <Input
                    value={content.footer.brandTitle}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, brandTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt başlık</Label>
                  <Input
                    value={content.footer.brandSubtitle}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, brandSubtitle: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kısa açıklama</Label>
                <Textarea
                  value={content.footer.description}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      footer: { ...c.footer, description: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input
                    value={content.footer.phoneDisplay}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, phoneDisplay: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefon linki</Label>
                  <Input
                    value={content.footer.phoneHref}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, phoneHref: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adres bloğu (çok satır)</Label>
                <Textarea
                  value={content.footer.addressBlock}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      footer: { ...c.footer, addressBlock: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input
                    value={content.footer.instagramHref}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, instagramHref: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp URL</Label>
                  <Input
                    value={content.footer.whatsappHref}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, whatsappHref: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telif son eki</Label>
                <Input
                  value={content.footer.copyrightSuffix}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      footer: { ...c.footer, copyrightSuffix: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gizlilik etiketi</Label>
                  <Input
                    value={content.footer.privacyLabel}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, privacyLabel: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gizlilik URL</Label>
                  <Input
                    value={content.footer.privacyHref}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, privacyHref: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>KVKK etiketi</Label>
                  <Input
                    value={content.footer.kvkkLabel}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, kvkkLabel: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>KVKK URL</Label>
                  <Input
                    value={content.footer.kvkkHref}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        footer: { ...c.footer, kvkkHref: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hızlı bağlantılar</Label>
                <LinkRows
                  links={content.footer.quickLinks}
                  onChange={(quickLinks) =>
                    setContent((c) => ({ ...c, footer: { ...c.footer, quickLinks } }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hizmet linkleri</Label>
                <LinkRows
                  links={content.footer.serviceLinks}
                  onChange={(serviceLinks) =>
                    setContent((c) => ({ ...c, footer: { ...c.footer, serviceLinks } }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
