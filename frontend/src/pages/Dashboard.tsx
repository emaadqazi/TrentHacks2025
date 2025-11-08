import { Link } from "react-router-dom"
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
} from "lucide-react"

const recentResumes = [
  { id: 1, title: "Software Engineer Resume", date: "2 days ago", template: "Modern Minimal" },
  { id: 2, title: "Product Manager CV", date: "1 week ago", template: "ATS-Optimized" },
  { id: 3, title: "Marketing Resume", date: "2 weeks ago", template: "Jake's Classic" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Blocks className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResuBlocks</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-foreground">
                My Resumes
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </Link>
              <Link
                to="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-2">
              <CardContent className="p-4 space-y-3">
                <Link to="/editor" className="block">
                  <Button
                    className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    New Resume
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="default">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">Quick Actions</h3>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-accent text-accent-foreground"
                >
                  <FileText className="h-4 w-4" />
                  Recent Resumes
                </Link>
                <Link
                  to="/templates"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Template Library
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Resumes</h1>
              <p className="text-muted-foreground">Manage and edit your resume collection</p>
            </div>

            {recentResumes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentResumes.map((resume) => (
                  <Card key={resume.id} className="group border-2 overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-[8.5/11] bg-card border-b relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted p-6">
                        <div className="space-y-3">
                          <div className="h-3 w-3/4 rounded bg-foreground/20" />
                          <div className="h-2 w-1/2 rounded bg-foreground/10" />
                          <div className="mt-6 space-y-2">
                            <div className="h-2 w-full rounded bg-foreground/10" />
                            <div className="h-2 w-5/6 rounded bg-foreground/10" />
                            <div className="h-2 w-4/6 rounded bg-foreground/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{resume.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{resume.template}</p>
                          <p className="text-xs text-muted-foreground">{resume.date}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link to="/editor" className="flex-1">
                          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Pencil className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No resumes yet</h3>
                  <p className="mb-6 text-sm text-muted-foreground max-w-sm">
                    Start building your first resume or upload an existing one to get started
                  </p>
                  <div className="flex gap-3">
                    <Link to="/editor">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Resume
                      </Button>
                    </Link>
                    <Button variant="outline">
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

