"use client"

import { useState } from 'react'
import { use } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Upload, 
  FolderPlus, 
  FileText, 
  MoreVertical,
  Filter,
  Grid,
  List,
  Lock,
  Eye,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Document {
  id: string
  title: string
  source: string
  department: string
  owner: string
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  type: string
  lastModified: string
  size: string
}

const getSampleDocuments = (tenantSlug: string): Document[] => {
  if (tenantSlug === 'devtraco') {
    return [
      { id: '1', title: 'Q4 Project Status Report', source: 'SharePoint', department: 'Operations', owner: 'Kwame Asante', sensitivity: 'internal', type: 'Report', lastModified: '2 hours ago', size: '2.4 MB' },
      { id: '2', title: 'Construction Safety Guidelines 2024', source: 'Google Drive', department: 'Legal', owner: 'Ama Mensah', sensitivity: 'public', type: 'Policy', lastModified: '1 day ago', size: '1.8 MB' },
      { id: '3', title: 'Vendor Contract - Steel Suppliers', source: 'SharePoint', department: 'Procurement', owner: 'Kofi Owusu', sensitivity: 'confidential', type: 'Contract', lastModified: '3 days ago', size: '540 KB' },
      { id: '4', title: 'Airport City Phase 2 - Risk Assessment', source: 'Email', department: 'Projects', owner: 'Kwame Asante', sensitivity: 'restricted', type: 'Report', lastModified: '1 week ago', size: '3.2 MB' },
      { id: '5', title: 'Employee Handbook 2024', source: 'SharePoint', department: 'HR', owner: 'HR Team', sensitivity: 'internal', type: 'Policy', lastModified: '2 weeks ago', size: '890 KB' },
      { id: '6', title: 'Financial Projections Q1 2025', source: 'Google Drive', department: 'Finance', owner: 'Finance Team', sensitivity: 'restricted', type: 'Report', lastModified: '5 days ago', size: '1.1 MB' },
    ]
  }
  return [
    { id: '1', title: 'Digital Transformation Playbook', source: 'SharePoint', department: 'Consulting', owner: 'Dr. Abena Osei', sensitivity: 'internal', type: 'Guide', lastModified: '1 hour ago', size: '4.2 MB' },
    { id: '2', title: 'FinTech Market Analysis 2024', source: 'Google Drive', department: 'Research', owner: 'Yaw Boateng', sensitivity: 'confidential', type: 'Report', lastModified: '2 days ago', size: '2.8 MB' },
    { id: '3', title: 'Cybersecurity Assessment Framework', source: 'SharePoint', department: 'Security', owner: 'Efua Darko', sensitivity: 'internal', type: 'Framework', lastModified: '4 days ago', size: '1.5 MB' },
    { id: '4', title: 'Client NDA Template', source: 'SharePoint', department: 'Legal', owner: 'Legal Team', sensitivity: 'confidential', type: 'Contract', lastModified: '1 week ago', size: '320 KB' },
    { id: '5', title: 'Knowledge Management Best Practices', source: 'Google Drive', department: 'Consulting', owner: 'Dr. Abena Osei', sensitivity: 'public', type: 'Guide', lastModified: '3 weeks ago', size: '1.9 MB' },
    { id: '6', title: 'AI Implementation Case Studies', source: 'Email', department: 'Innovation', owner: 'Yaw Boateng', sensitivity: 'internal', type: 'Report', lastModified: '1 day ago', size: '5.1 MB' },
  ]
}

export default function DocumentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: tenantSlug } = use(params)
  const { user, tenant } = useAuth()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false)

  const documents = getSampleDocuments(tenantSlug)

  // Filter documents based on user role
  const filteredDocuments = documents.filter(doc => {
    // Junior users can only see documents from their department or public docs
    if (user?.role === 'junior') {
      if (doc.sensitivity === 'restricted' || doc.sensitivity === 'confidential') {
        return doc.department === user.department
      }
    }
    
    // Apply search filter
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    // Apply department filter
    if (departmentFilter !== 'all' && doc.department !== departmentFilter) {
      return false
    }
    
    // Apply type filter
    if (typeFilter !== 'all' && doc.type !== typeFilter) {
      return false
    }
    
    return true
  })

  const getSensitivityBadge = (sensitivity: string) => {
    switch (sensitivity) {
      case 'public': return 'bg-green-100 text-green-700'
      case 'internal': return 'bg-blue-100 text-blue-700'
      case 'confidential': return 'bg-yellow-100 text-yellow-700'
      case 'restricted': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'SharePoint': return '📁'
      case 'Google Drive': return '📄'
      case 'Email': return '📧'
      default: return '📃'
    }
  }

  // Check if user has access
  if (user?.role === 'junior') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="w-12 h-12 text-[#94a3b8] mb-4" />
        <h2 className="text-xl font-semibold text-[#0f172a] mb-2">Access Restricted</h2>
        <p className="text-[#64748b] text-center max-w-md">
          You don&apos;t have access to the Documents tab. Contact your data owner if you think this is needed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Documents</h1>
          <p className="text-[#64748b]">Manage and search your connected data sources</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreateSetOpen} onOpenChange={setIsCreateSetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#e2e8f0]">
                <FolderPlus className="w-4 h-4 mr-2" />
                Create document set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Document Set</DialogTitle>
                <DialogDescription>
                  Group related documents for easier analysis and comparison.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="set-name">Set name</Label>
                  <Input id="set-name" placeholder="e.g., All contracts with Vendor X" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-desc">Description (optional)</Label>
                  <Input id="set-desc" placeholder="Describe this document set" />
                </div>
                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: tenant?.primaryColor }}
                  onClick={() => setIsCreateSetOpen(false)}
                >
                  Create Set
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="text-white" style={{ backgroundColor: tenant?.primaryColor }}>
                <Upload className="w-4 h-4 mr-2" />
                Upload document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add a new document to be indexed and searchable.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center">
                  <Upload className="w-10 h-10 mx-auto text-[#94a3b8] mb-3" />
                  <p className="text-sm text-[#64748b] mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-[#94a3b8]">PDF, DOCX, XLSX, PPTX up to 50MB</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-dept">Department</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="doc-sens">Sensitivity</Label>
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: tenant?.primaryColor }}
                  onClick={() => setIsUploadOpen(false)}
                >
                  Upload Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-[#e2e8f0] p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#e2e8f0]"
          />
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
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Projects">Projects</SelectItem>
              <SelectItem value="Procurement">Procurement</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 border-[#e2e8f0]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Report">Report</SelectItem>
              <SelectItem value="Policy">Policy</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Guide">Guide</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border border-[#e2e8f0] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#f1f5f9]' : 'hover:bg-[#f8fafc]'}`}
            >
              <List className="w-4 h-4 text-[#64748b]" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#f1f5f9]' : 'hover:bg-[#f8fafc]'}`}
            >
              <Grid className="w-4 h-4 text-[#64748b]" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Table/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Sensitivity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Modified</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#64748b]" />
                      <span className="font-medium text-[#0f172a]">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#64748b] flex items-center gap-1">
                      {getSourceIcon(doc.source)} {doc.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748b]">{doc.department}</td>
                  <td className="px-4 py-3 text-sm text-[#64748b]">{doc.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getSensitivityBadge(doc.sensitivity)}`}>
                      {doc.sensitivity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748b]">{doc.lastModified}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" /> Open in source
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#64748b]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0f172a] text-sm">{doc.title}</p>
                    <p className="text-xs text-[#94a3b8]">{doc.size}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Preview</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getSensitivityBadge(doc.sensitivity)}`}>
                  {doc.sensitivity}
                </span>
                <span className="text-xs text-[#94a3b8]">{doc.department}</span>
                <span className="text-xs text-[#94a3b8]">· {doc.lastModified}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-[#94a3b8] mb-3" />
          <p className="text-[#64748b]">No documents found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
