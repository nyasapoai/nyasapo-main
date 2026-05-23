"use client"

import { useState } from 'react'
import { use } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Filter,
  Download,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Insight {
  id: string
  title: string
  description: string
  type: 'risk' | 'trend' | 'decision' | 'alert'
  severity?: 'high' | 'medium' | 'low'
  department: string
  date: string
  change?: number
  sources: number
}

const getSampleInsights = (tenantSlug: string): Insight[] => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', title: 'Material Cost Escalation', description: 'Steel prices increased 18% in Q4, affecting 5 active projects', type: 'risk', severity: 'high', department: 'Procurement', date: 'Dec 15, 2024', change: 18, sources: 12 },
      { id: '2', title: 'Project Timeline Delays', description: '3 projects showing 2+ week delays due to permit processing', type: 'alert', severity: 'medium', department: 'Projects', date: 'Dec 14, 2024', sources: 8 },
      { id: '3', title: 'Labour Productivity Up', description: 'Site productivity improved 12% after new safety training', type: 'trend', department: 'Operations', date: 'Dec 12, 2024', change: 12, sources: 6 },
      { id: '4', title: 'Vendor Performance Review', description: 'Top 3 suppliers meeting 95%+ delivery targets', type: 'decision', department: 'Procurement', date: 'Dec 10, 2024', sources: 15 },
      { id: '5', title: 'Regulatory Compliance Gap', description: 'New building codes require updates to 2 project designs', type: 'risk', severity: 'medium', department: 'Legal', date: 'Dec 8, 2024', sources: 4 },
      { id: '6', title: 'Cash Flow Improvement', description: 'Collections improved 8% following new invoicing process', type: 'trend', department: 'Finance', date: 'Dec 5, 2024', change: 8, sources: 9 },
    ]
  }
  return [
    { id: '1', title: 'Cybersecurity Threat Increase', description: 'Phishing attempts up 34% across client networks in Q4', type: 'risk', severity: 'high', department: 'Security', date: 'Dec 15, 2024', change: 34, sources: 18 },
    { id: '2', title: 'Digital Transformation Demand', description: 'Client inquiries for DT services increased 45%', type: 'trend', department: 'Consulting', date: 'Dec 14, 2024', change: 45, sources: 22 },
    { id: '3', title: 'FinTech Regulatory Changes', description: 'New mobile money regulations affecting 3 client projects', type: 'alert', severity: 'medium', department: 'FinTech', date: 'Dec 12, 2024', sources: 7 },
    { id: '4', title: 'AI Adoption Case Studies', description: 'Compiled 8 successful AI implementation stories from clients', type: 'decision', department: 'Innovation', date: 'Dec 10, 2024', sources: 8 },
    { id: '5', title: 'Knowledge Base Growth', description: 'Internal KB expanded by 23% with new client learnings', type: 'trend', department: 'Research', date: 'Dec 8, 2024', change: 23, sources: 31 },
    { id: '6', title: 'Client Satisfaction Scores', description: 'NPS improved from 72 to 81 in Q4 survey', type: 'trend', department: 'Operations', date: 'Dec 5, 2024', change: 12.5, sources: 45 },
  ]
}

const getTopRisks = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { title: 'Supply chain disruption', occurrences: 23, trend: 'up' },
      { title: 'Permit delays', occurrences: 18, trend: 'stable' },
      { title: 'Labour shortages', occurrences: 15, trend: 'up' },
      { title: 'Cost overruns', occurrences: 12, trend: 'down' },
    ]
  }
  return [
    { title: 'Data breaches', occurrences: 28, trend: 'up' },
    { title: 'Regulatory non-compliance', occurrences: 19, trend: 'stable' },
    { title: 'Project delays', occurrences: 14, trend: 'down' },
    { title: 'Talent retention', occurrences: 11, trend: 'up' },
  ]
}

const getTrendData = (tenantSlug: string) => {
  if (tenantSlug === 'devtraco') {
    return [
      { month: 'Jul', value: 65 },
      { month: 'Aug', value: 72 },
      { month: 'Sep', value: 68 },
      { month: 'Oct', value: 78 },
      { month: 'Nov', value: 85 },
      { month: 'Dec', value: 91 },
    ]
  }
  return [
    { month: 'Jul', value: 45 },
    { month: 'Aug', value: 52 },
    { month: 'Sep', value: 58 },
    { month: 'Oct', value: 71 },
    { month: 'Nov', value: 82 },
    { month: 'Dec', value: 94 },
  ]
}

export default function InsightsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: tenantSlug } = use(params)
  const { user, tenant } = useAuth()
  const [dateRange, setDateRange] = useState('30d')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')

  const insights = getSampleInsights(tenantSlug)
  const topRisks = getTopRisks(tenantSlug)
  const trendData = getTrendData(tenantSlug)

  const filteredInsights = insights.filter(insight => {
    if (departmentFilter !== 'all' && insight.department !== departmentFilter) return false
    if (topicFilter !== 'all' && insight.type !== topicFilter) return false
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'trend': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'alert': return <Activity className="w-4 h-4 text-amber-500" />
      case 'decision': return <FileText className="w-4 h-4 text-blue-500" />
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'risk': return 'bg-red-100 text-red-700'
      case 'trend': return 'bg-green-100 text-green-700'
      case 'alert': return 'bg-amber-100 text-amber-700'
      case 'decision': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const maxTrendValue = Math.max(...trendData.map(d => d.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Insights</h1>
          <p className="text-[#64748b]">Trends, risks, and decisions from your documents</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#e2e8f0]">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-[#e2e8f0] p-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#64748b]" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 border-[#e2e8f0]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#64748b]" />
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-36 border-[#e2e8f0]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Projects">Projects</SelectItem>
              <SelectItem value="Procurement">Procurement</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>

          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-32 border-[#e2e8f0]">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="risk">Risks</SelectItem>
              <SelectItem value="trend">Trends</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="decision">Decisions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748b]">Total Insights</span>
            <BarChart3 className="w-4 h-4 text-[#94a3b8]" />
          </div>
          <p className="text-2xl font-bold text-[#0f172a]">{insights.length}</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748b]">Active Risks</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-[#0f172a]">{insights.filter(i => i.type === 'risk').length}</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> 2 high priority
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748b]">Positive Trends</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-[#0f172a]">{insights.filter(i => i.type === 'trend').length}</p>
          <p className="text-xs text-[#64748b] mt-1">Across {new Set(insights.filter(i => i.type === 'trend').map(i => i.department)).size} departments</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748b]">Documents Analyzed</span>
            <FileText className="w-4 h-4 text-[#94a3b8]" />
          </div>
          <p className="text-2xl font-bold text-[#0f172a]">{insights.reduce((acc, i) => acc + i.sources, 0)}</p>
          <p className="text-xs text-[#64748b] mt-1">Sources contributing</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0f172a]">Recent Insights</h2>
            <span className="text-sm text-[#64748b]">{filteredInsights.length} results</span>
          </div>

          <div className="space-y-3">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.type === 'risk' ? 'bg-red-100' :
                      insight.type === 'trend' ? 'bg-green-100' :
                      insight.type === 'alert' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">{insight.title}</h3>
                      <p className="text-sm text-[#64748b]">{insight.description}</p>
                    </div>
                  </div>
                  {insight.change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {insight.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-1 rounded-full capitalize font-medium ${getTypeBadge(insight.type)}`}>
                    {insight.type}
                  </span>
                  {insight.severity && (
                    <span className={`px-2 py-1 rounded-full capitalize font-medium ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-700' :
                      insight.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {insight.severity}
                    </span>
                  )}
                  <span className="text-[#94a3b8]">{insight.department}</span>
                  <span className="text-[#94a3b8]">·</span>
                  <span className="text-[#94a3b8]">{insight.date}</span>
                  <span className="text-[#94a3b8] ml-auto">{insight.sources} sources</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Top Recurring Risks */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Top Recurring Risks
              </h3>
            </div>
            <div className="space-y-3">
              {topRisks.map((risk, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#0f172a]">{risk.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#64748b]">{risk.occurrences}</span>
                    {risk.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                    {risk.trend === 'down' && <TrendingDown className="w-3 h-3 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#2563eb]" />
                Trends Over Time
              </h3>
            </div>
            <div className="h-32 flex items-end justify-between gap-2">
              {trendData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t-sm"
                    style={{ 
                      height: `${(item.value / maxTrendValue) * 100}%`,
                      backgroundColor: tenant?.primaryColor || '#2563eb',
                      opacity: 0.6 + (i * 0.07)
                    }}
                  />
                  <span className="text-xs text-[#94a3b8]">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions on Similar Issues */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0f172a]">Decisions on Similar Issues</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors">
                <p className="text-sm font-medium text-[#0f172a] mb-1">Q3 Cost Containment Plan</p>
                <p className="text-xs text-[#64748b]">Approved budget cuts of 8%</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors">
                <p className="text-sm font-medium text-[#0f172a] mb-1">Vendor Diversification</p>
                <p className="text-xs text-[#64748b]">Added 3 backup suppliers</p>
              </button>
            </div>
            <Button variant="ghost" className="w-full mt-3 text-sm" style={{ color: tenant?.primaryColor }}>
              View all decisions <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
