import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Blocks,
  Plus,
  FileText,
  LayoutTemplate,
  BarChart3,
  MoreVertical,
  Download,
  Pencil,
  Trash2,
  Upload,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const recentResumes = [
  { id: 1, title: "Software Engineer Resume", date: "2 days ago", template: "Modern Minimal" },
  { id: 2, title: "Product Manager CV", date: "1 week ago", template: "ATS-Optimized" },
  { id: 3, title: "Marketing Resume", date: "2 weeks ago", template: "Jake's Classic" },
]

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
  const userEmail = currentUser?.email || ''
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      // Error handled by AuthContext
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08]">
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />
      
      {/* Top Navigation */}
      <nav className="border-b border-[#8B6F47]/20 bg-[#221410]/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
                <Blocks className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#F5F1E8]">ResuBlocks</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-[#F5F1E8]">
                My Resumes
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Templates
              </Link>
              <Link
                to="#"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Analytics
              </Link>
            </div>
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
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
              <CardContent className="p-4 space-y-3">
                <Link to="/editor" className="block">
                  <Button
                    className="w-full justify-start gap-2 bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    New Resume
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2 bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50" size="default">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#F5F1E8] mb-2">Quick Actions</h3>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-[#3a5f24]/20 text-[#F5F1E8]"
                >
                  <FileText className="h-4 w-4" />
                  Recent Resumes
                </Link>
                <Link
                  to="/templates"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#C9B896] hover:bg-[#3a5f24]/10 hover:text-[#F5F1E8] transition-colors"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Template Library
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#C9B896] hover:bg-[#3a5f24]/10 hover:text-[#F5F1E8] transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#F5F1E8] mb-2">My Resumes</h1>
              <p className="text-[#C9B896]">Manage and edit your resume collection</p>
            </div>

            {recentResumes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentResumes.map((resume) => (
                  <Card key={resume.id} className="group border-2 border-[#8B6F47]/30 overflow-hidden transition-all hover:shadow-xl hover:shadow-[#3a5f24]/10 bg-[#221410]/90 backdrop-blur-xl">
                    <div className="aspect-[8.5/11] bg-[#18100a]/60 border-b border-[#8B6F47]/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#221410]/50 to-[#18100a] p-6">
                        <div className="space-y-3">
                          <div className="h-3 w-3/4 rounded bg-[#F5F1E8]/20" />
                          <div className="h-2 w-1/2 rounded bg-[#F5F1E8]/10" />
                          <div className="mt-6 space-y-2">
                            <div className="h-2 w-full rounded bg-[#F5F1E8]/10" />
                            <div className="h-2 w-5/6 rounded bg-[#F5F1E8]/10" />
                            <div className="h-2 w-4/6 rounded bg-[#F5F1E8]/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#F5F1E8] truncate">{resume.title}</h3>
                          <p className="text-xs text-[#C9B896] mt-1">{resume.template}</p>
                          <p className="text-xs text-[#C9B896]">{resume.date}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#F5F1E8]/10 text-[#C9B896] hover:text-[#F5F1E8]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#221410] border-[#8B6F47]/30">
                            <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
                            <DropdownMenuItem className="text-red-400 focus:bg-red-500/20 focus:text-red-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link to="/editor" className="flex-1">
                          <Button size="sm" className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]">
                            <Pencil className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:text-[#F5F1E8] hover:border-[#3a5f24]/50">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-[#8B6F47]/30 bg-[#221410]/50 backdrop-blur-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#3a5f24]/20">
                    <FileText className="h-10 w-10 text-[#3a5f24]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#F5F1E8]">No resumes yet</h3>
                  <p className="mb-6 text-sm text-[#C9B896] max-w-sm">
                    Start building your first resume or upload an existing one to get started
                  </p>
                  <div className="flex gap-3">
                    <Link to="/editor">
                      <Button className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Resume
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:text-[#F5F1E8] hover:border-[#3a5f24]/50">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

