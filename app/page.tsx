import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getHomepageContent } from "@/lib/homepage-content/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <main className="min-h-screen">
      <Header content={content.header} />
      <Hero content={content.hero} />
      <Stats content={content.stats} />
      <Services content={content.services} />
      <About content={content.about} />
      <Contact content={content.contact} />
      <Footer content={content.footer} />
    </main>
  );
}
