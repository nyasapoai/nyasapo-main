import { SovereignSidebar } from "@/components/sovereign-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1">
      <SovereignSidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
    </div>
  )
}
