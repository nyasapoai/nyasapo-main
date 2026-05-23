import { SovereignHeader } from "@/components/sovereign-header"
import { SovereignFooter } from "@/components/sovereign-footer"

export default function SovereignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SovereignHeader />
      <main className="flex-1">{children}</main>
      <SovereignFooter />
    </div>
  )
}
