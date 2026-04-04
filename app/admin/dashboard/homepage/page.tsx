import { getHomepageContent } from "@/lib/homepage-content/store"
import { HomepageEditor } from "./homepage-editor"

export default async function AdminHomepagePage() {
  const content = await getHomepageContent()
  return (
    <div className="p-8">
      <HomepageEditor initial={content} />
    </div>
  )
}
