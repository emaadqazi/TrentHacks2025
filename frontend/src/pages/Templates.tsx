import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Blocks, Check, ArrowLeft } from "lucide-react"

const templates = [
  {
    id: 1,
    name: "Jake's Classic",
    description: "Traditional, professional layout perfect for corporate roles",
    tags: ["Professional", "Corporate"],
    atsOptimized: true,
  },
  {
    id: 2,
    name: "Modern Minimal",
    description: "Clean, contemporary design with plenty of white space",
    tags: ["Modern", "Clean"],
    atsOptimized: true,
  },
  {
    id: 3,
    name: "ATS-Optimized",
    description: "Specifically designed to pass applicant tracking systems",
    tags: ["ATS-Friendly", "Simple"],
    atsOptimized: true,
  },
  {
    id: 4,
    name: "Creative",
    description: "Bold design for creative professionals and designers",
    tags: ["Creative", "Bold"],
    atsOptimized: false,
  },
  {
    id: 5,
    name: "Executive",
    description: "Sophisticated layout for senior leadership positions",
    tags: ["Executive", "Premium"],
    atsOptimized: true,
  },
  {
    id: 6,
    name: "Tech Pro",
    description: "Modern template optimized for tech industry roles",
    tags: ["Tech", "Modern"],
    atsOptimized: true,
  },
]

export default function TemplatesPage() {
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
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Resumes
              </Link>
              <Link to="/templates" className="text-sm font-medium text-foreground">
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
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Resume Templates</h1>
          <p className="text-muted-foreground">Choose a template to start building your perfect resume</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            All Templates
          </Button>
          <Button variant="outline" size="sm">
            Professional
          </Button>
          <Button variant="outline" size="sm">
            Modern
          </Button>
          <Button variant="outline" size="sm">
            ATS-Friendly
          </Button>
          <Button variant="outline" size="sm">
            Creative
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="group border-2 overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-[8.5/11] bg-card border-b relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted p-6">
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded bg-foreground/20" />
                    <div className="h-2 w-1/2 rounded bg-foreground/10" />
                    <div className="mt-8 space-y-2">
                      <div className="h-2 w-full rounded bg-foreground/10" />
                      <div className="h-2 w-5/6 rounded bg-foreground/10" />
                      <div className="h-2 w-4/6 rounded bg-foreground/10" />
                      <div className="mt-4 h-2 w-3/4 rounded bg-foreground/10" />
                      <div className="h-2 w-full rounded bg-foreground/10" />
                      <div className="h-2 w-5/6 rounded bg-foreground/10" />
                    </div>
                  </div>
                </div>
                {template.atsOptimized && (
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    <Check className="mr-1 h-3 w-3" />
                    ATS-Friendly
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Use Template</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

