import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Blocks, Lightbulb, Upload, Wand2, FileDown, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Blocks className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResuBlocks</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/templates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Templates
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container relative mx-auto overflow-hidden px-4 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="blob-animate absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
            style={{
              clipPath: "polygon(50% 0%, 80% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 20% 20%)",
            }}
          />
          <div
            className="blob-animate-alt absolute -right-20 top-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            Free for students • No credit card required
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Build Your Resume Like <span className="hand-drawn-underline">Building with Blocks</span>
          </h1>
          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
            The AI-powered resume builder that makes creating tailored resumes as intuitive as Scratch made coding.
            Drag, drop, and optimize your way to your dream job.
          </p>
          
          {/* Hero Illustration */}
          <div className="mb-10 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-primary/20">
              <img 
                src="/hero-illustration.jpg" 
                alt="Happy person building resume with colorful blocks" 
                className="w-full max-w-md h-auto object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/login">
              <Button
                size="lg"
                className="btn-playful h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="btn-playful h-12 px-8 text-base bg-transparent">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="texture-paper border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything You Need to Stand Out
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Powerful features designed to help you land your dream job
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="card-wiggle border-2 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Blocks className="h-6 w-6 text-primary" style={{ transform: "rotate(-3deg)" }} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Block-Based Editor</h3>
                <p className="text-pretty text-muted-foreground leading-relaxed">
                  Drag and drop resume sections like building blocks. Rearrange, customize, and perfect your layout with
                  ease.
                </p>
              </CardContent>
            </Card>
            <Card className="card-wiggle border-2 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Wand2 className="h-6 w-6 text-secondary" style={{ transform: "rotate(5deg)" }} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">AI-Powered Critique</h3>
                <p className="text-pretty text-muted-foreground leading-relaxed">
                  Get instant feedback on your resume content, formatting, and ATS optimization from our advanced AI.
                </p>
              </CardContent>
            </Card>
            <Card className="card-wiggle border-2 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/20">
                  <Lightbulb className="h-6 w-6 text-chart-3" style={{ transform: "rotate(-5deg)" }} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Smart Suggestions</h3>
                <p className="text-pretty text-muted-foreground leading-relaxed">
                  Receive intelligent recommendations for skills, achievements, and keywords tailored to your target
                  role.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="texture-coffee relative py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="blob-animate absolute left-1/4 top-20 h-72 w-72 rounded-full bg-chart-3/5 blur-3xl"
            style={{
              clipPath: "polygon(40% 0%, 60% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)",
            }}
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Three Simple Steps to Success
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">From upload to download in minutes</p>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mb-4 flex justify-center">
                  <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    1
                  </div>
                </div>
                <div className="mb-4 flex justify-center">
                  <Upload className="h-10 w-10 text-primary" style={{ transform: "rotate(-8deg)" }} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Upload Any Resume</h3>
                <p className="text-pretty text-sm text-muted-foreground leading-relaxed">
                  Start with your existing resume in any format - Word, PDF, or plain text
                </p>
              </div>
              <div className="relative text-center">
                <div className="mb-4 flex justify-center">
                  <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                    2
                  </div>
                </div>
                <div className="mb-4 flex justify-center">
                  <Wand2 className="h-10 w-10 text-secondary" style={{ transform: "rotate(6deg)" }} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">AI Restructures & Improves</h3>
                <p className="text-pretty text-sm text-muted-foreground leading-relaxed">
                  Our AI analyzes, optimizes, and transforms your resume into blocks
                </p>
              </div>
              <div className="relative text-center">
                <div className="mb-4 flex justify-center">
                  <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-chart-3 text-2xl font-bold text-primary-foreground">
                    3
                  </div>
                </div>
                <div className="mb-4 flex justify-center">
                  <FileDown className="h-10 w-10 text-chart-3" style={{ transform: "rotate(-4deg)" }} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Export Professional PDF</h3>
                <p className="text-pretty text-sm text-muted-foreground leading-relaxed">
                  Download your polished, ATS-friendly resume ready for applications
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/login">
              <Button
                size="lg"
                className="btn-playful h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Blocks className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">ResuBlocks</span>
              </Link>
              <p className="text-sm text-muted-foreground">Build your future, one block at a time.</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Career Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 ResuBlocks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

