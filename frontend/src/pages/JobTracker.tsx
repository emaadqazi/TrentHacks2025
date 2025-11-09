import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Blocks,
  Briefcase,
  LogOut,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"
import type { JobApplication, ApplicationStatus, Position, JobApplicationInput } from "@/types/jobApplication"
import { getUserJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from "@/lib/firestore"

const POSITIONS: Position[] = [
  "SWE",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Data Engineer",
  "Data Scientist",
  "ML Engineer",
  "DevOps",
  "Product Manager",
  "Designer",
  "Other",
]

const STATUSES: ApplicationStatus[] = [
  "Not applied",
  "Applied",
  "OA",
  "R1 Interview",
  "R2 Interview",
  "R3 Interview",
  "F Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
]

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  "Not applied": "bg-gray-500/20 text-gray-300",
  "Applied": "bg-yellow-500/20 text-yellow-300",
  "OA": "bg-blue-500/20 text-blue-300",
  "R1 Interview": "bg-blue-500/20 text-blue-300",
  "R2 Interview": "bg-blue-500/20 text-blue-300",
  "R3 Interview": "bg-blue-500/20 text-blue-300",
  "F Interview": "bg-purple-500/20 text-purple-300",
  "Offer": "bg-green-500/20 text-green-300",
  "Rejected": "bg-red-500/20 text-red-300",
  "Withdrawn": "bg-gray-500/20 text-gray-400",
}

export default function JobTrackerPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "All">("All")
  const [loading, setLoading] = useState(true)

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
  const userEmail = currentUser?.email || ''
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  // Load applications from Firestore
  useEffect(() => {
    async function loadApplications() {
      if (currentUser) {
        try {
          setLoading(true)
          const userApplications = await getUserJobApplications(currentUser.uid)
          setApplications(userApplications)
        } catch (error) {
          console.error('Error loading applications:', error)
          toast.error('Failed to load applications')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    loadApplications()
  }, [currentUser])

  const handleAddApplication = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to add applications')
      return
    }

    try {
      const newAppData: JobApplicationInput = {
        companyName: "",
        position: "SWE",
        location: "",
        dateApplied: "",
        currentStatus: "Not applied",
        notes: "",
      }
      
      await createJobApplication(currentUser.uid, newAppData)
      
      // Reload applications
      const updatedApplications = await getUserJobApplications(currentUser.uid)
      setApplications(updatedApplications)
      
      toast.success('Application added')
    } catch (error: any) {
      console.error('Error creating application:', error)
      toast.error(`Failed to create application: ${error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateField = async (id: string, field: keyof JobApplication, value: string) => {
    try {
      // Optimistically update UI
      setApplications(apps =>
        apps.map(app =>
          app.id === id
            ? { ...app, [field]: value }
            : app
        )
      )

      // Update in Firestore
      await updateJobApplication(id, { [field]: value })
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Failed to update application')
      // Reload to revert optimistic update
      if (currentUser) {
        const updatedApplications = await getUserJobApplications(currentUser.uid)
        setApplications(updatedApplications)
      }
    }
  }

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteJobApplication(id)
      setApplications(apps => apps.filter(app => app.id !== id))
      toast.success('Application deleted')
    } catch (error) {
      console.error('Error deleting application:', error)
      toast.error('Failed to delete application')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      // Error handled by AuthContext
    }
  }

  const filteredApplications = filterStatus === "All" 
    ? applications 
    : applications.filter(app => app.currentStatus === filterStatus)

  const statusCounts = STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter(app => app.currentStatus === status).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08]">
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />
      
      {/* Top Navigation */}
      <nav className="border-b border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl relative z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#F5F1E8]">ResuBlocks</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/dashboard" className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors">
              My Resumes
            </Link>
            <Link
              to="/critique"
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
            >
              Resume Critique
            </Link>
            <Link
              to="/job-tracker"
              className="text-sm font-medium text-[#F5F1E8]"
            >
              Job Tracker
            </Link>
            <Link
              to="/questions"
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
            >
              Questions
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#F5F1E8]/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser?.photoURL || undefined} alt={userDisplayName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#3a5f24] to-[#253f12] text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#221410] border-[#8B6F47]/30" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[#F5F1E8]">{userDisplayName}</p>
                  <p className="text-xs leading-none text-[#C9B896]">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">Billing</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem onClick={handleLogout} className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F5F1E8] mb-2">Job Application Tracker</h1>
            <p className="text-[#C9B896]">Track and manage your job applications in one place</p>
          </div>
          <Button
            onClick={handleAddApplication}
            className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl p-4">
            <div className="text-2xl font-bold text-[#F5F1E8]">{applications.length}</div>
            <div className="text-xs text-[#C9B896]">Total Applications</div>
          </Card>
          <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl p-4">
            <div className="text-2xl font-bold text-yellow-300">{statusCounts["Applied"] || 0}</div>
            <div className="text-xs text-[#C9B896]">Applied</div>
          </Card>
          <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl p-4">
            <div className="text-2xl font-bold text-blue-300">
              {(statusCounts["R1 Interview"] || 0) + (statusCounts["R2 Interview"] || 0) + (statusCounts["R3 Interview"] || 0) + (statusCounts["F Interview"] || 0)}
            </div>
            <div className="text-xs text-[#C9B896]">Interviews</div>
          </Card>
          <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl p-4">
            <div className="text-2xl font-bold text-green-300">{statusCounts["Offer"] || 0}</div>
            <div className="text-xs text-[#C9B896]">Offers</div>
          </Card>
          <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl p-4">
            <div className="text-2xl font-bold text-red-300">{statusCounts["Rejected"] || 0}</div>
            <div className="text-xs text-[#C9B896]">Rejected</div>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <Select
            value={filterStatus}
            onValueChange={(value: string) => setFilterStatus(value as ApplicationStatus | "All")}
          >
            <SelectTrigger className="w-[200px] bg-[#221410]/90 border-[#8B6F47]/30 text-[#F5F1E8]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#221410] border-[#8B6F47]/30">
              <SelectItem value="All" className="text-[#F5F1E8]">All Statuses</SelectItem>
              {STATUSES.map(status => (
                <SelectItem key={status} value={status} className="text-[#F5F1E8]">
                  {status} ({statusCounts[status] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Applications Table */}
        <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#8B6F47]/30">
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Company Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Position</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Location</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Date Applied</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Current Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Notes</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#F5F1E8]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-[#3a5f24] mb-3" />
                        <p className="text-[#C9B896]">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="h-12 w-12 text-[#8B6F47]/50 mb-3" />
                        <p className="text-[#C9B896] mb-2">No applications yet</p>
                        <p className="text-sm text-[#8B6F47]">Click "Add Application" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      className={`border-b border-[#8B6F47]/20 hover:bg-[#3a5f24]/5 transition-colors ${
                        index % 2 === 0 ? 'bg-[#18100a]/20' : 'bg-transparent'
                      }`}
                    >
                      <td className="p-2">
                        <Input
                          value={app.companyName}
                          onChange={(e) => handleUpdateField(app.id, 'companyName', e.target.value)}
                          placeholder="Company Name"
                          className="bg-transparent border-transparent hover:border-[#8B6F47]/30 focus:border-[#3a5f24] text-[#F5F1E8] text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Select
                          value={app.position}
                          onValueChange={(value: string) => handleUpdateField(app.id, 'position', value)}
                        >
                          <SelectTrigger className="bg-transparent border-transparent hover:border-[#8B6F47]/30 text-[#F5F1E8] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#221410] border-[#8B6F47]/30">
                            {POSITIONS.map(pos => (
                              <SelectItem key={pos} value={pos} className="text-[#F5F1E8]">
                                {pos}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          value={app.location}
                          onChange={(e) => handleUpdateField(app.id, 'location', e.target.value)}
                          placeholder="Location"
                          className="bg-transparent border-transparent hover:border-[#8B6F47]/30 focus:border-[#3a5f24] text-[#F5F1E8] text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="date"
                          value={app.dateApplied}
                          onChange={(e) => handleUpdateField(app.id, 'dateApplied', e.target.value)}
                          className="bg-transparent border-transparent hover:border-[#8B6F47]/30 focus:border-[#3a5f24] text-[#F5F1E8] text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Select
                          value={app.currentStatus}
                          onValueChange={(value: string) => handleUpdateField(app.id, 'currentStatus', value)}
                        >
                          <SelectTrigger className="bg-transparent border-transparent hover:border-[#8B6F47]/30 text-[#F5F1E8] text-sm">
                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[app.currentStatus]}`}>
                              {app.currentStatus}
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-[#221410] border-[#8B6F47]/30">
                            {STATUSES.map(status => (
                              <SelectItem key={status} value={status} className="text-[#F5F1E8]">
                                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[status]}`}>
                                  {status}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          value={app.notes}
                          onChange={(e) => handleUpdateField(app.id, 'notes', e.target.value)}
                          placeholder="Add notes..."
                          className="bg-transparent border-transparent hover:border-[#8B6F47]/30 focus:border-[#3a5f24] text-[#F5F1E8] text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteApplication(app.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

