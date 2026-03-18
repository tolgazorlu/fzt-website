import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function BlogNotFound() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Yazı Bulunamadı</h1>
        <p className="text-muted-foreground mb-6">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
        <Button asChild>
          <Link href="/blog">Blog&apos;a Dön</Link>
        </Button>
      </div>
      <Footer />
    </main>
  )
}
