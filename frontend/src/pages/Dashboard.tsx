import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
  LogOut,
  Send,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserProfile } from "@/lib/userProfile"
import { subscribeToUserJobApplications } from "@/lib/firestore"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import SpriteCharacter from "@/components/dashboard/SpriteCharacter"
import XPBar from "@/components/dashboard/XPBar"

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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Look, the CS job market is absolutely brutal right now. While you're here chatting, your competition is grinding LeetCode. How many problems did you solve today? And don't give me excuses. 💪",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [welcomeText, setWelcomeText] = useState('')
  const [welcomePosition, setWelcomePosition] = useState<'center' | 'top'>('center')
  const [showChat, setShowChat] = useState(false)
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null)
  const [selectedSprite, setSelectedSprite] = useState<string>('sprite1')
  const [selectedAvatar, setSelectedAvatar] = useState<string>('sprite1')
  const [jobApplicationCount, setJobApplicationCount] = useState(0)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // XP System: Each job application = 10 XP
  const XP_PER_JOB = 10
  const XP_PER_LEVEL = 50 // 50 XP per level
  const totalXp = jobApplicationCount * XP_PER_JOB
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpToNextLevel = XP_PER_LEVEL
  const currentXp = totalXp

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
  const userFirstName = userDisplayName.split(' ')[0] // Get only first name
  const userEmail = currentUser?.email || ''
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  // Load user profile photo and selected sprite
  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid).then((profile: any) => {
        if (profile?.profilePhotoUrl) {
          setUserProfilePhoto(profile.profilePhotoUrl)
        }
        if (profile?.selectedAvatar) {
          setSelectedSprite(profile.selectedAvatar)
          setSelectedAvatar(profile.selectedAvatar)
        }
      }).catch(console.error)
    }
  }, [currentUser])

  // Subscribe to job applications for XP tracking
  useEffect(() => {
    if (!currentUser) return

    const unsubscribe = subscribeToUserJobApplications(
      currentUser.uid,
      (applications) => {
        setJobApplicationCount(applications.length)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  // Typewriter effect for welcome message
  useEffect(() => {
    // Check if we should skip animation (coming from profile page)
    const skipAnimation = location.state?.skipAnimation
    
    if (skipAnimation) {
      // Skip animation and show everything immediately
      const fullWelcomeMessage = `Welcome Back, ${userFirstName}!`
      setWelcomeText(fullWelcomeMessage)
      setWelcomePosition('top')
      setShowChat(true)
      
      // Clear the state so it doesn't persist
      window.history.replaceState({}, document.title)
      return
    }

    let typeInterval: ReturnType<typeof setInterval>
    let finalTimeout: ReturnType<typeof setTimeout>

    // Initial 1 second delay before starting animation
    const initialDelay = setTimeout(() => {
      const fullWelcomeMessage = `Welcome Back, ${userFirstName}!` // Use first name, no uppercase
      let currentIndex = 0
      setWelcomeText('') // Start with empty text

      typeInterval = setInterval(() => {
        if (currentIndex < fullWelcomeMessage.length) {
          setWelcomeText(fullWelcomeMessage.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          // After typewriter completes, wait a bit then move welcome to top
          finalTimeout = setTimeout(() => {
            setWelcomePosition('top')
            // Then fade in chat after welcome moves up
            setTimeout(() => {
              setShowChat(true)
            }, 500)
          }, 800)
        }
      }, 100)
    }, 1000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(typeInterval)
      clearTimeout(finalTimeout)
    }
  }, [userFirstName, location.state])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat appears
  useEffect(() => {
    if (showChat) {
      inputRef.current?.focus()
    }
  }, [showChat])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Prepare messages for API (exclude system message, it's handled on backend)
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])

      // Check if AI suggests going to resume critique
      if (data.message.toLowerCase().includes('resume') && 
          (data.message.toLowerCase().includes('critique') || 
           data.message.toLowerCase().includes('work on'))) {
        // Optionally navigate or show a button
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 😅",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f08] via-[#221410] to-[#1a0f08]">
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />
      
      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: welcomePosition === 'top' ? 1 : 0, y: welcomePosition === 'top' ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="border-b border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl relative z-10"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#F5F1E8]">ResuBlocks</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/dashboard" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard', { state: { skipAnimation: true } });
              }}
              className="text-sm font-medium text-[#F5F1E8]"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-[#F5F1E8]/10 p-0 overflow-hidden flex items-center justify-center">
                <SpriteAvatar spriteId={selectedAvatar} size={36} />
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
      </motion.nav>

      {/* Welcome Message - Centered or Top */}
      {welcomePosition === 'center' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: welcomeText ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <h1 className="text-5xl md:text-6xl font-semibold text-[#F5F1E8] tracking-tight">
            {welcomeText}
            {welcomeText && <span className="animate-pulse">|</span>}
          </h1>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-12 pb-4 relative z-10"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-[#F5F1E8] tracking-tight">
            {welcomeText}
            {welcomeText && <span className="animate-pulse">|</span>}
          </h1>
        </motion.div>
      )}

      {/* Main Content - Layout with Sprite on Left, Chat on Right */}
      {showChat && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container mx-auto px-4 py-4 relative z-10"
        >
          <div className="flex gap-6 h-[calc(100vh-6rem)]">
            {/* Left Side - Sprite Character and XP Bar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-shrink-0 w-72 flex flex-col items-center justify-center space-y-6 self-center"
            >
              <SpriteCharacter xp={currentXp} level={level} selectedSprite={selectedSprite} />
              <XPBar currentXp={currentXp} xpToNextLevel={xpToNextLevel} level={level} />
            </motion.div>

            {/* Right Side - Chat Interface (moved up and to the right) */}
            <div className="flex-1 flex flex-col max-w-5xl ml-auto h-[70vh] self-start pt-8">
            {/* Chat Container */}
            <div className="h-full flex flex-col bg-[#221410]/90 backdrop-blur-xl border border-[#8B6F47]/20 rounded-xl shadow-xl overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#527853]/50 shadow-lg">
                          <img 
                            src="/NewAndImproved.jpg" 
                            alt="AI Assistant" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to gradient box if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#527853] to-[#3a5f24] flex items-center justify-center"><span class="text-white font-bold text-sm">AI</span></div>';
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === 'assistant'
                          ? 'bg-gradient-to-br from-[#527853]/20 to-[#3a5f24]/20 border border-[#527853]/30 text-[#F5F1E8]'
                          : 'bg-[#1a0f08]/60 border border-[#8B6F47]/20 text-[#F5F1E8]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser?.photoURL || undefined} alt={userDisplayName} />
                          <AvatarFallback className="bg-gradient-to-br from-[#3a5f24] to-[#253f12] text-white text-xs">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#527853]/50 shadow-lg">
                      <img 
                        src="/NewAndImproved.jpg" 
                        alt="AI Assistant" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#527853] to-[#3a5f24] flex items-center justify-center"><span class="text-white font-bold text-sm">AI</span></div>';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#527853]/20 to-[#3a5f24]/20 border border-[#527853]/30 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-[#527853] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#527853] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#527853] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#8B6F47]/20 p-4 bg-[#1a0f08]/40">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  disabled={isLoading || !showChat}
                  className="flex-1 bg-[#221410]/60 border border-[#8B6F47]/30 rounded-lg px-4 py-3 text-[#F5F1E8] placeholder:text-[#C9B896] focus:outline-none focus:ring-2 focus:ring-[#527853]/50 focus:border-[#527853] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || !showChat}
                  className="bg-gradient-to-r from-[#527853] to-[#3a5f24] hover:from-[#628963] hover:to-[#4a7534] text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
