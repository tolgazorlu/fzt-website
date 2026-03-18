import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await isAuthenticated()
  if (!auth) {
    redirect("/admin")
  }
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
