"use client"

import { useState } from 'react'
import { use } from 'react'
import { useAuth, demoUsers } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Lock,
  Database,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings2,
  Cloud,
  Mail,
  FileText,
  RefreshCw,
  Eye,
  Trash2,
  UserPlus
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataSource {
  id: string
  name: string
  type: string
  status: 'connected' | 'syncing' | 'error' | 'disconnected'
  lastSync: string
  documents: number
}

interface AuditLogEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
}

const getSampleDataSources = (tenantSlug: string): DataSource[] => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', name: 'SharePoint - Projects', type: 'SharePoint', status: 'connected', lastSync: '5 mins ago', documents: 1284 },
      { id: '2', name: 'Google Drive - Executive', type: 'Google Drive', status: 'connected', lastSync: '12 mins ago', documents: 456 },
      { id: '3', name: 'Email - Legal', type: 'Email', status: 'syncing', lastSync: 'In progress', documents: 892 },
      { id: '4', name: 'SharePoint - Finance', type: 'SharePoint', status: 'connected', lastSync: '1 hour ago', documents: 234 },
    ]
  }
  return [
    { id: '1', name: 'SharePoint - Consulting', type: 'SharePoint', status: 'connected', lastSync: '3 mins ago', documents: 2156 },
    { id: '2', name: 'Google Drive - Research', type: 'Google Drive', status: 'connected', lastSync: '8 mins ago', documents: 789 },
    { id: '3', name: 'OneDrive - Client Docs', type: 'OneDrive', status: 'error', lastSync: 'Failed', documents: 0 },
    { id: '4', name: 'Email Archives', type: 'Email', status: 'connected', lastSync: '30 mins ago', documents: 1567 },
  ]
}

const getSampleAuditLogs = (): AuditLogEntry[] => [
  { id: '1', action: 'Document Accessed', user: 'Kwame Asante', timestamp: '2 mins ago', details: 'Viewed Q4 Risk Report' },
  { id: '2', action: 'Query Executed', user: 'Ama Mensah', timestamp: '15 mins ago', details: 'Asked about vendor contracts' },
  { id: '3', action: 'User Role Changed', user: 'System Admin', timestamp: '1 hour ago', details: 'Promoted Kofi to Middle' },
  { id: '4', action: 'Document Uploaded', user: 'Ama Mensah', timestamp: '2 hours ago', details: 'Added new policy document' },
  { id: '5', action: 'High-Impact Query', user: 'Kofi Owusu', timestamp: '3 hours ago', details: 'Financial data query - pending review' },
]

export default function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: tenantSlug } = use(params)
  const { user, tenant } = useAuth()
  const [activeTab, setActiveTab] = useState('data-sources')
  const [humanReviewEnabled, setHumanReviewEnabled] = useState(true)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const dataSources = getSampleDataSources(tenantSlug)
  const auditLogs = getSampleAuditLogs()
  const tenantUsers = demoUsers[tenantSlug] || []

  // Check if user is Senior
  if (user?.role !== 'senior') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="w-12 h-12 text-[#94a3b8] mb-4" />
        <h2 className="text-xl font-semibold text-[#0f172a] mb-2">Access Restricted</h2>
        <p className="text-[#64748b] text-center max-w-md">
          Settings are only available to Senior users. Contact your administrator if you need access.
        </p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-100' }
      case 'syncing': return { icon: <RefreshCw className="w-4 h-4 animate-spin" />, color: 'text-blue-600 bg-blue-100' }
      case 'error': return { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-100' }
      default: return { icon: <Clock className="w-4 h-4" />, color: 'text-gray-600 bg-gray-100' }
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'SharePoint': return <Cloud className="w-5 h-5 text-[#0078d4]" />
      case 'Google Drive': return <Database className="w-5 h-5 text-[#4285f4]" />
      case 'Email': return <Mail className="w-5 h-5 text-[#ea4335]" />
      case 'OneDrive': return <Cloud className="w-5 h-5 text-[#0078d4]" />
      default: return <FileText className="w-5 h-5 text-[#64748b]" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'senior': return 'bg-[#dbeafe] text-[#1e40af]'
      case 'middle': return 'bg-[#fef3c7] text-[#92400e]'
      default: return 'bg-[#e0e7ff] text-[#4338ca]'
    }
  }

  const tabs = [
    { id: 'data-sources', name: 'Data Sources', icon: Database },
    { id: 'access-levels', name: 'Access Levels', icon: Users },
    { id: 'governance', name: 'Governance', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
        <p className="text-[#64748b]">Manage data sources, user access, and governance policies</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-[#e2e8f0] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-[#f1f5f9] text-[#0f172a]' 
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Data Sources Tab */}
      {activeTab === 'data-sources' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#0f172a]">Connected Data Sources</h3>
                <p className="text-sm text-[#64748b]">Manage which systems NyasapoAI can access</p>
              </div>
              <Button variant="outline" className="border-[#e2e8f0]">
                <Database className="w-4 h-4 mr-2" />
                Add Data Source
              </Button>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {dataSources.map((source) => {
                const status = getStatusBadge(source.status)
                return (
                  <div key={source.id} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <p className="font-medium text-[#0f172a]">{source.name}</p>
                        <p className="text-sm text-[#64748b]">{source.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#0f172a]">{source.documents.toLocaleString()} docs</p>
                        <p className="text-xs text-[#94a3b8]">Last sync: {source.lastSync}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        <span className="capitalize">{source.status}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings2 className="w-4 h-4 text-[#64748b]" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-sm text-[#64748b] mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {dataSources.reduce((acc, s) => acc + s.documents, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-sm text-[#64748b] mb-1">Connected Sources</p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {dataSources.filter(s => s.status === 'connected').length} / {dataSources.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-sm text-[#64748b] mb-1">Last Full Sync</p>
              <p className="text-2xl font-bold text-[#0f172a]">2 hours ago</p>
            </div>
          </div>
        </div>
      )}

      {/* Access Levels Tab */}
      {activeTab === 'access-levels' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#0f172a]">User Access Management</h3>
                <p className="text-sm text-[#64748b]">Manage which users are Senior, Middle, or Junior</p>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white" style={{ backgroundColor: tenant?.primaryColor }}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Invite a new user to the workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input id="user-email" type="email" placeholder="user@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input id="user-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Access Level</Label>
                      <Select defaultValue="junior">
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-dept">Department</Label>
                      <Select defaultValue="operations">
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: tenant?.primaryColor }}
                      onClick={() => setIsAddUserOpen(false)}
                    >
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc]">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Access Level</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: tenant?.primaryColor }}
                        >
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[#0f172a]">{u.name}</p>
                          <p className="text-xs text-[#64748b]">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#64748b]">{u.department}</TableCell>
                    <TableCell>
                      <Select defaultValue={u.role}>
                        <SelectTrigger className="w-28 h-8 border-[#e2e8f0]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-[#64748b]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Role Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadge('senior')}`}>Senior</span>
              </div>
              <p className="text-sm text-[#64748b]">Full access to all documents, insights, and settings. Can manage users and governance policies.</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadge('middle')}`}>Middle</span>
              </div>
              <p className="text-sm text-[#64748b]">Access to documents, workspaces, and can create briefs. Cannot access settings or manage users.</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadge('junior')}`}>Junior</span>
              </div>
              <p className="text-sm text-[#64748b]">Limited to their department. Can ask questions and view pinned answers. Some queries may need approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Governance Tab */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Governance Settings */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h3 className="font-semibold text-[#0f172a] mb-4">Governance Policies</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">Human Review for High-Impact Answers</p>
                    <p className="text-sm text-[#64748b]">Require senior approval for queries involving sensitive data</p>
                  </div>
                </div>
                <Switch
                  checked={humanReviewEnabled}
                  onCheckedChange={setHumanReviewEnabled}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">Document-Level Permissions</p>
                    <p className="text-sm text-[#64748b]">Enforce source system permissions in RAG results</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a]">Audit Trail</p>
                    <p className="text-sm text-[#64748b]">Log all queries, document access, and user actions</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#0f172a]">Audit Log Summary</h3>
                <p className="text-sm text-[#64748b]">Recent activity in the workspace</p>
              </div>
              <Button variant="outline" className="border-[#e2e8f0]">
                Export Full Log
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc]">
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Details</TableHead>
                  <TableHead className="font-semibold">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        log.action.includes('High-Impact') ? 'bg-amber-100 text-amber-700' :
                        log.action.includes('Role') ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#0f172a]">{log.user}</TableCell>
                    <TableCell className="text-[#64748b]">{log.details}</TableCell>
                    <TableCell className="text-[#94a3b8]">{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
