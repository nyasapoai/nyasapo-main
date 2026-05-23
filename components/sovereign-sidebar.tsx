"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, Globe, FolderOpen, Settings, Sparkles, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const sidebarItems = [
  { name: "Dashboard", href: "/sovereign/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/sovereign/analytics", icon: TrendingUp },
  { name: "AI Models", href: "/sovereign/ai-models", icon: Globe },
  { name: "Library", href: "/sovereign/library", icon: FolderOpen },
  { name: "Settings", href: "/sovereign/settings", icon: Settings },
]

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: ["5,000 AI tokens/month", "Basic document editing", "2 translations/day"],
    current: false,
  },
  {
    name: "Pro",
    price: "GH₵ 99/mo",
    features: ["50,000 AI tokens/month", "Advanced AI features", "Unlimited translations", "Priority support"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited AI tokens", "Custom AI models", "Dedicated support", "SLA guarantee", "On-premise deployment"],
    current: false,
  },
]

export function SovereignSidebar() {
  const pathname = usePathname()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName)
    setTimeout(() => {
      setShowUpgradeDialog(false)
      setSelectedPlan(null)
    }, 1500)
  }

  return (
    <>
      <aside className="flex flex-col w-[200px] min-h-[calc(100vh-64px)] bg-white border-r border-[#e2e2e2]">
        <div className="p-4 border-b border-[#e2e2e2]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] border border-[#e2e2e2]">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#785900] to-[#004fcb] flex items-center justify-center">
                <span className="text-xs text-white font-bold">G</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#0f172a] text-sm">Admin Portal</p>
              <p className="text-xs text-[#2563eb]">Verified Access</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-[#f1f5f9] text-[#2563eb]"
                    : "text-[#424656] hover:bg-[#f8fafc]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
          
          {/* AI Assistant Link */}
          <Link
            href="/sovereign/ai-assistant"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
              pathname === "/sovereign/ai-assistant"
                ? "bg-[#f1f5f9] text-[#2563eb]"
                : "text-[#424656] hover:bg-[#f8fafc]"
            )}
          >
            <Bot className="h-5 w-5" />
            AI Assistant
          </Link>
        </nav>
        <div className="p-4">
          <div className="bg-[#f8fafc] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#2563eb] mb-1">PRO PLAN</p>
            <p className="text-xs text-[#6b7280] mb-3">
              You&apos;ve used 85% of your AI generation tokens.
            </p>
            <div className="h-2 bg-[#e2e2e2] rounded-full mb-3">
              <div className="h-2 bg-[#2563eb] rounded-full" style={{ width: "85%" }}></div>
            </div>
            <button 
              onClick={() => setShowUpgradeDialog(true)}
              className="w-full bg-[#2563eb] hover:bg-[#004fcb] text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your organization&apos;s needs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-xl p-4 border-2 transition-colors",
                  plan.current 
                    ? "border-[#2563eb] bg-[#2563eb]/5" 
                    : "border-[#e2e2e2] hover:border-[#2563eb]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#0f172a]">{plan.name}</h3>
                  {plan.current && (
                    <span className="text-xs font-medium text-[#2563eb] bg-[#2563eb]/10 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#0f172a] mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6b7280]">
                      <Sparkles className="h-4 w-4 text-[#2563eb] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.current || selectedPlan === plan.name}
                  className={cn(
                    "w-full",
                    plan.current
                      ? "bg-[#e2e2e2] text-[#6b7280] cursor-not-allowed"
                      : selectedPlan === plan.name
                      ? "bg-green-500 text-white"
                      : "bg-[#2563eb] hover:bg-[#004fcb] text-white"
                  )}
                >
                  {selectedPlan === plan.name 
                    ? "Processing..." 
                    : plan.current 
                    ? "Current Plan" 
                    : plan.name === "Enterprise" 
                    ? "Contact Sales" 
                    : "Upgrade"
                  }
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
