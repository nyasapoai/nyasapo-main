"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  FolderSearch,
  Briefcase,
  AlertTriangle,
  ClipboardList,
  Users,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { TENANTS } from "@/lib/tenant-config"

export default function HomePage() {
  const [showDemoDialog, setShowDemoDialog] = useState(false)
  const [showPilotDialog, setShowPilotDialog] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [demoForm, setDemoForm] = useState({ name: "", email: "", company: "", role: "" })
  const [pilotForm, setPilotForm] = useState({ name: "", email: "", company: "" })

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setShowDemoDialog(false)
      setFormSubmitted(false)
      setDemoForm({ name: "", email: "", company: "", role: "" })
    }, 2000)
  }

  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setShowPilotDialog(false)
      setFormSubmitted(false)
      setPilotForm({ name: "", email: "", company: "" })
    }, 2000)
  }

  // Generate tenant URL based on environment
  const getTenantLoginUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      // Local development - use path-based route
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `/tenant/${slug}`
      }
    }
    // Production - use subdomain with bare domain
    return `https://${slug}.nyasapoai.com`
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">NyasapoAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors">
              How it works
            </Link>
            <Link href="#use-cases" className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors">
              Use cases
            </Link>
            <Link href="#security" className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors">
              Security
            </Link>
            <Link href="/sovereign" className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-colors">
              Sovereign AI
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-[#64748b] hover:text-[#0f172a] gap-1">
                  Login to workspace
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-xs font-medium text-[#94a3b8]">
                  Select your organization
                </div>
                <DropdownMenuSeparator />
                {Object.values(TENANTS).map((tenant) => (
                  <DropdownMenuItem key={tenant.slug} asChild>
                    <a 
                      href={getTenantLoginUrl(tenant.slug)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div 
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tenant.primaryColor}15` }}
                      >
                        <Building2 className="h-4 w-4" style={{ color: tenant.primaryColor }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#0f172a]">{tenant.name}</span>
                        <span className="text-xs text-[#64748b]">{tenant.slug}.nyasapoai.com</span>
                      </div>
                    </a>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button 
                    onClick={() => setShowDemoDialog(true)}
                    className="flex items-center gap-2 w-full text-[#2563eb]"
                  >
                    <span className="text-sm">Request a new workspace</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={() => setShowDemoDialog(true)}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium"
            >
              Book a demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#0f172a] leading-[1.15] mb-6 text-balance">
                Turn your internal documents into decision-ready answers
              </h1>
              <p className="text-lg text-[#64748b] mb-8 leading-relaxed max-w-xl">
                NyasapoAI is a secure RAG-based insight platform that answers questions from your own files, flags risks, and recommends actions — with citations you can trust.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Button 
                  onClick={() => setShowDemoDialog(true)}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-6 py-3 h-auto text-base"
                >
                  Book a demo
                </Button>
                <button 
                  onClick={() => setShowPilotDialog(true)}
                  className="text-[#2563eb] font-medium hover:underline underline-offset-4 flex items-center gap-1"
                >
                  Start a free pilot
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side - Mock Chat Window */}
            <div className="bg-[#f8fafc] rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                <div className="h-3 w-3 rounded-full bg-[#f59e0b]"></div>
                <div className="h-3 w-3 rounded-full bg-[#22c55e]"></div>
                <span className="ml-2 text-xs text-[#94a3b8]">NyasapoAI Workspace</span>
              </div>
              
              {/* User Question */}
              <div className="flex items-start gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-[#e2e8f0] flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-[#64748b]" />
                </div>
                <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 border border-[#e5e7eb]">
                  <p className="text-sm text-[#0f172a]">What risks are most likely to affect next quarter&apos;s revenue?</p>
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#2563eb] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-xl rounded-tl-sm px-4 py-4 border border-[#e5e7eb] flex-1">
                  <p className="text-sm text-[#0f172a] mb-3">Based on your Q3 reports and market analysis:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm text-[#374151]">
                      <AlertTriangle className="h-4 w-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                      <span><strong>Supply chain delays</strong> — 3 vendors flagged as high-risk</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#374151]">
                      <AlertTriangle className="h-4 w-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                      <span><strong>Currency fluctuation</strong> — GHS exposure up 12%</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#374151]">
                      <AlertTriangle className="h-4 w-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                      <span><strong>Contract renewal</strong> — 2 major clients pending</span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-4 pt-3 border-t border-[#e5e7eb]">
                    <span className="text-xs text-[#94a3b8]">Sources: Q3 Report, Risk Register, Vendor Assessment</span>
                    <button className="text-xs text-[#2563eb] font-medium hover:underline flex items-center gap-1">
                      View source document
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-4">How it works</h2>
          <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
            Get decision-ready answers from your documents in three simple steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
                <FolderSearch className="h-8 w-8 text-[#2563eb]" />
              </div>
              <div className="text-sm font-medium text-[#2563eb] mb-2">Step 1</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Connect your data</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Securely connect SharePoint, Google Drive, email, PDFs, and spreadsheets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-[#2563eb]" />
              </div>
              <div className="text-sm font-medium text-[#2563eb] mb-2">Step 2</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Ask in plain language</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Search across all your documents with natural-language questions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#2563eb]" />
              </div>
              <div className="text-sm font-medium text-[#2563eb] mb-2">Step 3</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Get decision-ready answers</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Receive summaries, risks, trends, and recommended actions with citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] text-center mb-4">Built for real business challenges</h2>
          <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
            From boardroom to operations floor, NyasapoAI transforms how teams work with information
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] hover:border-[#2563eb] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Executive briefings</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Summarise board packs and policies into 5 bullet decisions.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] hover:border-[#2563eb] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Risk and compliance</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Detect recurring issues, contract risks, and policy breaches early.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] hover:border-[#2563eb] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Operations & projects</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                See which projects may slip and why.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] hover:border-[#2563eb] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#2563eb]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Customer & stakeholder insights</h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Spot themes in feedback and complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-tenant Security Section */}
      <section id="security" className="px-6 py-16 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#2563eb]/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-[#2563eb]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Multi-tenant security</h2>
          <p className="text-lg text-[#94a3b8] leading-relaxed max-w-3xl mx-auto">
            Each customer gets a private subdomain (e.g. <span className="text-[#60a5fa] font-medium">yourorg.nyasapoai.com</span>) with its own users, documents, and access controls — no data is shared across tenants.
          </p>
          
          {/* Tenant Examples */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {Object.values(TENANTS).map((tenant) => (
              <div 
                key={tenant.slug}
                className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-[#60a5fa]" />
                <span className="text-sm text-white font-medium">{tenant.slug}.nyasapoai.com</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Subscribe Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">How to subscribe</h2>
          <p className="text-[#64748b] mb-12">Get started in under a week</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2563eb] text-white font-semibold flex items-center justify-center">1</div>
              <span className="text-[#0f172a] font-medium">Sign up form</span>
            </div>
            <div className="hidden md:block h-px w-12 bg-[#e5e7eb]"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2563eb] text-white font-semibold flex items-center justify-center">2</div>
              <span className="text-[#0f172a] font-medium">Processing of request</span>
            </div>
            <div className="hidden md:block h-px w-12 bg-[#e5e7eb]"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2563eb] text-white font-semibold flex items-center justify-center">3</div>
              <span className="text-[#0f172a] font-medium">Subscribe and customisation completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0f172a]">NyasapoAI</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/security" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
                Security & Compliance
              </Link>
              <Link href="/docs" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
                Documentation
              </Link>
              <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
                Contact
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-[#2563eb] font-medium hover:underline transition-colors flex items-center gap-1">
                  Login to workspace
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {Object.values(TENANTS).map((tenant) => (
                    <DropdownMenuItem key={tenant.slug} asChild>
                      <a href={getTenantLoginUrl(tenant.slug)} className="cursor-pointer">
                        <Building2 className="h-4 w-4 mr-2" style={{ color: tenant.primaryColor }} />
                        {tenant.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-[#e5e7eb] text-center">
            <p className="text-sm text-[#94a3b8]">
              © 2024 NyasapoAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Book a Demo Dialog */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a demo</DialogTitle>
            <DialogDescription>
              See how NyasapoAI can transform your document workflows. Our team will reach out within 24 hours.
            </DialogDescription>
          </DialogHeader>
          {formSubmitted ? (
            <div className="py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-[#0f172a]">Demo request submitted!</p>
              <p className="text-sm text-[#6b7280]">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Full Name</label>
                <Input 
                  required
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="Your name"
                  className="border-[#e5e7eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Work Email</label>
                <Input 
                  required
                  type="email"
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  placeholder="you@company.com"
                  className="border-[#e5e7eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Company</label>
                <Input 
                  required
                  value={demoForm.company}
                  onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                  placeholder="Your company name"
                  className="border-[#e5e7eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Role</label>
                <Input 
                  value={demoForm.role}
                  onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                  placeholder="Your role (optional)"
                  className="border-[#e5e7eb]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
                Request Demo
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Start Pilot Dialog */}
      <Dialog open={showPilotDialog} onOpenChange={setShowPilotDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a free pilot</DialogTitle>
            <DialogDescription>
              Try NyasapoAI with your own documents. No commitment required.
            </DialogDescription>
          </DialogHeader>
          {formSubmitted ? (
            <div className="py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-[#0f172a]">Pilot request submitted!</p>
              <p className="text-sm text-[#6b7280]">We&apos;ll set up your workspace within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handlePilotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Full Name</label>
                <Input 
                  required
                  value={pilotForm.name}
                  onChange={(e) => setPilotForm({ ...pilotForm, name: e.target.value })}
                  placeholder="Your name"
                  className="border-[#e5e7eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Work Email</label>
                <Input 
                  required
                  type="email"
                  value={pilotForm.email}
                  onChange={(e) => setPilotForm({ ...pilotForm, email: e.target.value })}
                  placeholder="you@company.com"
                  className="border-[#e5e7eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Company</label>
                <Input 
                  required
                  value={pilotForm.company}
                  onChange={(e) => setPilotForm({ ...pilotForm, company: e.target.value })}
                  placeholder="Your company name"
                  className="border-[#e5e7eb]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
                Start Free Pilot
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
