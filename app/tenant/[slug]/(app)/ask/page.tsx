"use client"

import { useState } from 'react'
import { use } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Send, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Building2,
  CheckCircle,
  ExternalLink,
  Bookmark,
  Sparkles,
  MessageSquare
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Answer {
  id: string
  question: string
  answer: string
  citations: { title: string; source: string; page?: number }[]
  tags: string[]
  timestamp: Date
  pendingReview?: boolean
}

// Sample data for different tenants
const getSampleAlerts = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', severity: 'high', title: 'Project delays on Tema Harbour expansion', source: 'Q3 Progress Report', date: '2 hours ago' },
      { id: '2', severity: 'medium', title: 'Material cost overrun on Airport City Phase 2', source: 'Cost Analysis', date: '5 hours ago' },
      { id: '3', severity: 'low', title: 'New zoning regulations affecting Spintex projects', source: 'Legal Memo', date: 'Yesterday' },
    ]
  }
  return [
    { id: '1', severity: 'high', title: 'Cybersecurity audit findings require immediate action', source: 'Security Assessment', date: '1 hour ago' },
    { id: '2', severity: 'medium', title: 'FinTech client contract renewal pending', source: 'CRM Report', date: '4 hours ago' },
    { id: '3', severity: 'low', title: 'New digital transformation framework published', source: 'Industry Update', date: 'Today' },
  ]
}

const getSampleBriefs = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', title: 'Board Meeting Pack - Q4 2024', date: 'Dec 15, 2024' },
      { id: '2', title: 'Infrastructure Development Policy', date: 'Dec 10, 2024' },
      { id: '3', title: 'Risk Assessment - Accra Metro', date: 'Dec 5, 2024' },
    ]
  }
  return [
    { id: '1', title: 'Digital Transformation Roadmap', date: 'Dec 15, 2024' },
    { id: '2', title: 'FinTech Market Analysis', date: 'Dec 12, 2024' },
    { id: '3', title: 'Cybersecurity Best Practices', date: 'Dec 8, 2024' },
  ]
}

const getSampleThemes = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      'Construction material price volatility',
      'Permitting delays in Greater Accra',
      'Labour shortage in skilled trades',
      'Increased infrastructure investment opportunities',
    ]
  }
  return [
    'AI adoption acceleration across sectors',
    'Regulatory changes in digital payments',
    'Growing demand for cybersecurity services',
    'Knowledge management digitization trends',
  ]
}

const getSampleWorkspaces = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', name: 'Q4 Risk Review', docs: 12, lastUpdated: '2 days ago' },
      { id: '2', name: 'Vendor Comparison - Steel Suppliers', docs: 8, lastUpdated: '1 week ago' },
      { id: '3', name: 'Airport City Analysis', docs: 15, lastUpdated: '3 days ago' },
    ]
  }
  return [
    { id: '1', name: 'FinTech Client Portfolio', docs: 18, lastUpdated: '1 day ago' },
    { id: '2', name: 'Digital Transformation Projects', docs: 24, lastUpdated: '3 days ago' },
    { id: '3', name: 'Cybersecurity Assessments', docs: 10, lastUpdated: '1 week ago' },
  ]
}

const getSampleRecentQuestions = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', question: 'What are the main risks in the Tema project?', tags: ['risk', 'projects'], date: 'Today' },
      { id: '2', question: 'Compare steel suppliers by delivery time', tags: ['vendors', 'procurement'], date: 'Yesterday' },
      { id: '3', question: 'Summarize the new building codes', tags: ['compliance', 'legal'], date: '2 days ago' },
    ]
  }
  return [
    { id: '1', question: 'What are the key findings from the security audit?', tags: ['cybersecurity', 'audit'], date: 'Today' },
    { id: '2', question: 'Summarize client feedback from Q3', tags: ['clients', 'feedback'], date: 'Yesterday' },
    { id: '3', question: 'What are trending topics in digital transformation?', tags: ['research', 'trends'], date: '2 days ago' },
  ]
}

const getPinnedAnswers = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', title: 'Project Approval Process', sharedBy: 'Kwame Asante', date: 'Dec 10' },
      { id: '2', title: 'Safety Compliance Checklist', sharedBy: 'Ama Mensah', date: 'Dec 8' },
    ]
  }
  return [
    { id: '1', title: 'Client Onboarding Procedures', sharedBy: 'Dr. Abena Osei', date: 'Dec 12' },
    { id: '2', title: 'Data Privacy Guidelines', sharedBy: 'Yaw Boateng', date: 'Dec 5' },
  ]
}

export default function AskPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: tenantSlug } = use(params)
  const { user, tenant } = useAuth()
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState(user?.role === 'junior' ? user.department : 'all')
  const [isSearching, setIsSearching] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)
  const [showEvidence, setShowEvidence] = useState(false)

  const alerts = getSampleAlerts(tenantSlug)
  const briefs = getSampleBriefs(tenantSlug)
  const themes = getSampleThemes(tenantSlug)
  const workspaces = getSampleWorkspaces(tenantSlug)
  const recentQuestions = getSampleRecentQuestions(tenantSlug)
  const pinnedAnswers = getPinnedAnswers(tenantSlug)

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearching(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))

    const sampleAnswer: Answer = {
      id: Date.now().toString(),
      question: query,
      answer: tenantSlug === 'devtraco' 
        ? `Based on analysis of 23 internal documents, the main risks identified include:\n\n1. **Supply Chain Delays**: Current lead times for steel and cement have increased by 35% due to port congestion.\n\n2. **Regulatory Compliance**: New building codes effective January 2025 will require modifications to 3 ongoing projects.\n\n3. **Labour Availability**: Skilled labour shortage projected to impact Q1 2025 timelines by 2-3 weeks.\n\nRecommended actions include early procurement for Q1 materials and accelerated permit applications.`
        : `Based on analysis of 18 client documents and market reports:\n\n1. **Digital Transformation Demand**: 73% of clients have increased their digital transformation budgets for 2025.\n\n2. **Cybersecurity Priority**: Security assessments requested increased by 45% in Q4.\n\n3. **FinTech Growth**: Mobile payment integration projects up 60% year-over-year.\n\nRecommended focus areas: AI-powered analytics services and expanded cybersecurity offerings.`,
      citations: [
        { title: tenantSlug === 'devtraco' ? 'Q3 Risk Assessment Report' : 'Q4 Client Survey Results', source: 'SharePoint', page: 12 },
        { title: tenantSlug === 'devtraco' ? 'Supply Chain Analysis 2024' : 'Market Trends Analysis', source: 'Google Drive', page: 5 },
        { title: tenantSlug === 'devtraco' ? 'Project Status Dashboard' : 'Service Portfolio Review', source: 'Internal Database' },
      ],
      tags: tenantSlug === 'devtraco' ? ['risk', 'projects', 'compliance'] : ['trends', 'clients', 'strategy'],
      timestamp: new Date(),
      pendingReview: user?.role === 'junior'
    }

    setCurrentAnswer(sampleAnswer)
    setIsSearching(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Ask Box */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${tenant?.primaryColor}15` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: tenant?.primaryColor }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">Ask any question about your internal documents</h1>
            <p className="text-sm text-[#64748b]">Get decision-ready answers with citations you can trust</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
            <Input
              placeholder="What would you like to know?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 pl-12 pr-4 text-base border-[#e2e8f0] focus:border-[#2563eb] focus:ring-[#2563eb]"
            />
          </div>
          
          {user?.role !== 'junior' && (
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-48 h-12 border-[#e2e8f0]">
                <Building2 className="w-4 h-4 mr-2 text-[#64748b]" />
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="h-12 px-6 text-white"
            style={{ backgroundColor: tenant?.primaryColor }}
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Answer Display */}
      {currentAnswer && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#64748b] mb-1">Your question</p>
              <p className="font-medium text-[#0f172a]">{currentAnswer.question}</p>
            </div>
            {currentAnswer.pendingReview && (
              <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                Pending senior review
              </span>
            )}
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Verified by NyasapoAI</span>
            </div>
            <div className="prose prose-sm max-w-none text-[#0f172a] whitespace-pre-line">
              {currentAnswer.answer}
            </div>
          </div>

          {/* Citations */}
          <div className="mb-4">
            <p className="text-sm font-medium text-[#64748b] mb-2">Sources ({currentAnswer.citations.length})</p>
            <div className="flex flex-wrap gap-2">
              {currentAnswer.citations.map((citation, i) => (
                <button
                  key={i}
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-lg text-sm text-[#0f172a] transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  {citation.title}
                  {citation.page && <span className="text-[#64748b]">p.{citation.page}</span>}
                  <ExternalLink className="w-3 h-3 text-[#64748b]" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions for Middle+ users */}
          {user?.role !== 'junior' && (
            <div className="flex items-center gap-2 pt-4 border-t border-[#e2e8f0]">
              <Button variant="outline" size="sm" onClick={() => setShowEvidence(!showEvidence)}>
                <FileText className="w-4 h-4 mr-2" />
                View evidence
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save as brief
              </Button>
              {user?.role === 'middle' && (
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Compare options
                </Button>
              )}
            </div>
          )}

          {/* Evidence Panel */}
          {showEvidence && (
            <div className="mt-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <h4 className="font-medium text-[#0f172a] mb-3">Evidence snippets</h4>
              {currentAnswer.citations.map((citation, i) => (
                <div key={i} className="mb-3 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-[#0f172a]">{citation.title}</span>
                    <span className="text-xs text-[#64748b]">{citation.source}</span>
                  </div>
                  <p className="text-sm text-[#64748b] italic">
                    &quot;...relevant excerpt from the document would appear here with the specific text that supports the answer...&quot;
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 mt-4">
            {currentAnswer.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-[#e0e7ff] text-[#4338ca] rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Widgets - Role Based */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Senior: Key Alerts */}
        {user?.role === 'senior' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Today&apos;s Key Alerts
              </h3>
              <span className="text-xs text-[#64748b]">{alerts.length} alerts</span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <p className="text-sm font-medium mb-1">{alert.title}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{alert.source}</span>
                    <span>{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Senior: Recent Executive Briefs */}
        {user?.role === 'senior' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563eb]" />
                Recent Executive Briefs
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">View all</Button>
            </div>
            <div className="space-y-2">
              {briefs.map((brief) => (
                <button key={brief.id} className="w-full text-left p-3 rounded-lg hover:bg-[#f8fafc] transition-colors flex items-center justify-between">
                  <span className="text-sm font-medium text-[#0f172a]">{brief.title}</span>
                  <span className="text-xs text-[#64748b]">{brief.date}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Senior: Emerging Themes */}
        {user?.role === 'senior' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Themes Emerging This Month
              </h3>
            </div>
            <ul className="space-y-2">
              {themes.map((theme, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#64748b]">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-[#94a3b8]" />
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Middle: Your Workspaces */}
        {user?.role === 'middle' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a]">Your Workspaces</h3>
              <Button variant="outline" size="sm" className="text-xs">+ New</Button>
            </div>
            <div className="space-y-2">
              {workspaces.map((ws) => (
                <button key={ws.id} className="w-full text-left p-3 rounded-lg hover:bg-[#f8fafc] transition-colors border border-[#e2e8f0]">
                  <p className="font-medium text-sm text-[#0f172a] mb-1">{ws.name}</p>
                  <div className="flex items-center gap-3 text-xs text-[#64748b]">
                    <span>{ws.docs} docs</span>
                    <span>Updated {ws.lastUpdated}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Middle & Junior: Recent Questions */}
        {(user?.role === 'middle' || user?.role === 'junior') && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#64748b]" />
                Your Recent Questions
              </h3>
            </div>
            <div className="space-y-2">
              {recentQuestions.map((q) => (
                <button key={q.id} className="w-full text-left p-3 rounded-lg hover:bg-[#f8fafc] transition-colors">
                  <p className="text-sm text-[#0f172a] mb-2">{q.question}</p>
                  <div className="flex items-center gap-2">
                    {q.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-[#f1f5f9] text-[#64748b] rounded">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-[#94a3b8] ml-auto">{q.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Junior: Pinned Answers */}
        {user?.role === 'junior' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                Pinned Answers
              </h3>
            </div>
            <div className="space-y-2">
              {pinnedAnswers.map((answer) => (
                <button key={answer.id} className="w-full text-left p-3 rounded-lg hover:bg-[#f8fafc] transition-colors border border-[#e2e8f0]">
                  <p className="font-medium text-sm text-[#0f172a] mb-1">{answer.title}</p>
                  <p className="text-xs text-[#64748b]">Shared by {answer.sharedBy} · {answer.date}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Alerts widget for Middle users too */}
        {user?.role === 'middle' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#64748b]" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg bg-[#f8fafc]">
                  <p className="text-sm text-[#0f172a] mb-1">{alert.title}</p>
                  <p className="text-xs text-[#64748b]">{alert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
