import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Blocks, Sparkles, Loader2, CheckCircle, Github } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"

export default function LandingAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { login, signup, signInWithGoogle, signInWithGithub } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      navigate("/dashboard")
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate("/dashboard")
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGithub()
      navigate("/dashboard")
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08] relative overflow-hidden">
      {/* Wood grain texture - primary layer */}
      <div className="absolute inset-0 opacity-[0.20] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />
      
      {/* Vertical wood lines */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 80px,
          rgba(89, 71, 51, 0.4) 80px,
          rgba(89, 71, 51, 0.4) 82px,
          transparent 82px,
          transparent 200px,
          rgba(89, 71, 51, 0.3) 200px,
          rgba(89, 71, 51, 0.3) 201px
        )`
      }} />
      
      {/* Fine grain noise texture */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.6'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }} />
      
      {/* Darker wood knots/imperfections */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(15, 11, 8, 0.9) 0%, transparent 3%),
                          radial-gradient(circle at 75% 60%, rgba(15, 11, 8, 0.7) 0%, transparent 4%),
                          radial-gradient(circle at 45% 80%, rgba(15, 11, 8, 0.8) 0%, transparent 2.5%),
                          radial-gradient(circle at 85% 15%, rgba(15, 11, 8, 0.6) 0%, transparent 3.5%),
                          radial-gradient(circle at 30% 70%, rgba(15, 11, 8, 0.7) 0%, transparent 2%)`
      }} />
      
      {/* Subtle forest green accent blobs */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-[#3a5f24]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-[#3a5f24]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#3a5f24]/5 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -40, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3a5f24] to-[#253f12] shadow-2xl shadow-[#3a5f24]/20">
              <Blocks className="h-12 w-12 text-white" />
            </div>
            <span className="text-5xl font-bold text-[#F5F1E8]">Mission Employed</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#C9B896] hidden sm:block">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-[#F5F1E8] hover:text-[#3a5f24] hover:bg-[#F5F1E8]/10"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left: Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3a5f24]/20 border border-[#3a5f24]/40 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#3a5f24]" />
                <span className="text-sm font-medium text-[#3a5f24]">AI-Powered Resume Builder</span>
              </div>
              
              <h1 className="text-5xl font-bold text-[#F5F1E8] leading-tight drop-shadow-lg">
                {("Complete Your Mission, ").split("").map((char, index) => (
                  <motion.span
                    key={`char-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="text-[#3a5f24]">
                  {("Land Your Dream Job").split("").map((char, index) => (
                    <motion.span
                      key={`mission-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: (24 + index) * 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </h1>
              
              <p className="text-lg text-[#C9B896]">
                The career platform that turns your job search into achievable missions,
                guiding you step-by-step to employment success.
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <CheckCircle 
                    key={i} 
                    className="h-5 w-5 text-[#3a5f24] fill-[#3a5f24]/20" 
                  />
                ))}
              </div>
              <p className="text-sm text-[#C9B896]">
                Trusted by <span className="font-semibold text-[#F5F1E8]">5,000+</span> students
              </p>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div>
            <Card className="border-2 border-[#8B6F47]/20 shadow-2xl bg-gradient-to-br from-[#221410]/95 to-[#18100a]/95 backdrop-blur-xl">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-[#F5F1E8]">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </CardTitle>
                <CardDescription className="text-[#C9B896]">
                  {isSignUp 
                    ? "Sign up to start building your resume" 
                    : "Enter your credentials to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-[#2c1810]/50 border-[#8B6F47]/30 text-[#F5F1E8] hover:bg-[#4A7C2C]/20 hover:border-[#4A7C2C]/50 hover:text-[#4A7C2C] transition-all"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] hover:bg-[#3a5f24]/20 hover:border-[#3a5f24]/50 hover:text-[#3a5f24] transition-all"
                  type="button"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#8B6F47]/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-r from-[#221410] to-[#18100a] px-2 text-[#C9B896]">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#F5F1E8]">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignUp}
                        disabled={loading}
                        className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#3a5f24] focus:ring-[#3a5f24]"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#F5F1E8]">Email</Label>
                    <Input
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#4A7C2C] focus:ring-[#4A7C2C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#F5F1E8]">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#4A7C2C] focus:ring-[#4A7C2C]"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222] shadow-lg shadow-[#3a5f24]/20 transition-all"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSignUp ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      isSignUp ? "Sign Up" : "Sign In"
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-[#C9B896]">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

