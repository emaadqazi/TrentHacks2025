import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Blocks, Check, ArrowLeft, LogOut } from "lucide-react"
import { getUserProfile } from "@/lib/userProfile"
import { useEffect, useState } from "react"

// Sprite options - pixel art characters
const SPRITE_OPTIONS = [
  { id: 'sprite1', name: 'Sprite 1', image: '/sprite1.png' },
  { id: 'sprite2', name: 'Sprite 2', image: '/sprite2.png' },
  { id: 'sprite3', name: 'Sprite 3', image: '/sprite3.png' },
];

// Component to render sprite avatar
const SpriteAvatar = ({ spriteId, size = 64 }: { spriteId: string; size?: number }) => {
  const sprite = SPRITE_OPTIONS.find(s => s.id === spriteId) || SPRITE_OPTIONS[0];
  
  return (
    <div 
      className="rounded-lg overflow-hidden bg-[#527853]/20 flex items-center justify-center" 
      style={{ width: size, height: size }}
    >
      <img 
        src={sprite.image} 
        alt={sprite.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

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
  const navigate = useNavigate()
  const { logout, currentUser } = useAuth()
  const [selectedAvatar, setSelectedAvatar] = useState<string>('sprite1')
  
  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid).then((profile: any) => {
        if (profile?.selectedAvatar) {
          setSelectedAvatar(profile.selectedAvatar);
        }
      }).catch(console.error);
    }
  }, [currentUser]);
  
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
              <span className="text-xl font-bold text-[#F5F1E8]">Mission Employed</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              <Link 
                to="/dashboard" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard', { state: { skipAnimation: true } });
                }}
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Home
              </Link>
              <Link
                to="/critique"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Resume Critique
              </Link>
              <Link
                to="/job-tracker"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-[#F5F1E8]/10 p-0 overflow-hidden flex items-center justify-center">
                <SpriteAvatar spriteId={selectedAvatar} size={36} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#221410] border-[#8B6F47]/30" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[#F5F1E8]">John Doe</p>
                  <p className="text-xs leading-none text-[#C9B896]">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]"
              >
                Profile Settings
              </DropdownMenuItem>
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
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#C9B896] hover:text-[#F5F1E8] mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F1E8] mb-2">Resume Templates</h1>
          <p className="text-[#C9B896]">Choose a template to start building your perfect resume</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="bg-[#3a5f24]/20 border-[#3a5f24]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/30">
            All Templates
          </Button>
          <Button variant="outline" size="sm" className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50 hover:text-[#F5F1E8]">
            Professional
          </Button>
          <Button variant="outline" size="sm" className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50 hover:text-[#F5F1E8]">
            Modern
          </Button>
          <Button variant="outline" size="sm" className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50 hover:text-[#F5F1E8]">
            ATS-Friendly
          </Button>
          <Button variant="outline" size="sm" className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50 hover:text-[#F5F1E8]">
            Creative
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="group border-2 border-[#8B6F47]/30 overflow-hidden transition-all hover:shadow-xl hover:shadow-[#3a5f24]/10 bg-[#221410]/90 backdrop-blur-xl">
              <div className="aspect-[8.5/11] bg-[#18100a]/60 border-b border-[#8B6F47]/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#221410]/50 to-[#18100a] p-6">
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded bg-[#F5F1E8]/20" />
                    <div className="h-2 w-1/2 rounded bg-[#F5F1E8]/10" />
                    <div className="mt-8 space-y-2">
                      <div className="h-2 w-full rounded bg-[#F5F1E8]/10" />
                      <div className="h-2 w-5/6 rounded bg-[#F5F1E8]/10" />
                      <div className="h-2 w-4/6 rounded bg-[#F5F1E8]/10" />
                      <div className="mt-4 h-2 w-3/4 rounded bg-[#F5F1E8]/10" />
                      <div className="h-2 w-full rounded bg-[#F5F1E8]/10" />
                      <div className="h-2 w-5/6 rounded bg-[#F5F1E8]/10" />
                    </div>
                  </div>
                </div>
                {template.atsOptimized && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white border-0">
                    <Check className="mr-1 h-3 w-3" />
                    ATS-Friendly
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-[#F5F1E8] mb-1">{template.name}</h3>
                <p className="text-sm text-[#C9B896] mb-3 leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} className="text-xs bg-[#3a5f24]/20 text-[#3a5f24] border border-[#3a5f24]/30 hover:bg-[#3a5f24]/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]">Use Template</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

