import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Blocks, Lightbulb, Upload, Wand2, FileDown, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0b08] via-[#1a110c] to-[#050402] text-[#f5f1e8]">
      {/* Tactile wood textures */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='260' height='260' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='5' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.18 0 0 0 0 0.12 0 0 0 0 0.07 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundSize: "420px 420px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(42, 27, 18, 0.25) 0px,
            rgba(42, 27, 18, 0.25) 1px,
            transparent 1px,
            transparent 120px
          )`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='280' height='280' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='1.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: "220px 220px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-[#2a1b12] bg-[#1b120d]/85 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12] shadow-lg shadow-[#3a5f24]/30">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#f5f1e8]">ResuBlocks</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="#features"
              className="text-sm font-medium text-[#d3c4a6] transition-colors hover:text-[#f5f1e8]"
            >
              Features
            </Link>
            <Link
              to="#how-it-works"
              className="text-sm font-medium text-[#d3c4a6] transition-colors hover:text-[#f5f1e8]"
            >
              How It Works
            </Link>
            <Link
              to="/templates"
              className="text-sm font-medium text-[#d3c4a6] transition-colors hover:text-[#f5f1e8]"
            >
              Templates
            </Link>
            <Link
              to="/resume-test"
              className="text-sm font-medium text-[#4a7c2c] transition-colors hover:text-[#6c9d45]"
            >
              Resume Test
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-[#d3c4a6] hover:bg-[#3a5f24]/15 hover:text-[#f5f1e8]">
                Log In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white shadow-lg shadow-[#3a5f24]/25 hover:from-[#4a7c2c] hover:to-[#314d1d]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container relative mx-auto overflow-hidden px-4 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] rounded-[320px] bg-gradient-to-b from-[#3a5f24]/15 via-transparent to-transparent blur-3xl" />
          <div
            className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full bg-[#3a5f24]/12 blur-3xl"
            style={{
              clipPath: "polygon(50% 0%, 85% 20%, 100% 65%, 75% 100%, 25% 100%, 0% 60%, 20% 15%)",
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 top-56 h-96 w-96 rounded-full bg-[#8b6f47]/10 blur-3xl"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 65% 100%, 35% 100%, 0% 70%, 0% 30%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4a7c2c]/40 bg-[#1c120d]/80 px-4 py-1.5 text-sm font-medium text-[#4a7c2c]/90 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#6c9d45]" />
              Free for students • No credit card required
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-[#f5f1e8] md:text-6xl lg:text-7xl">
              Build Your Resume Like <span className="hand-drawn-underline text-[#d3c4a6]">Building with Blocks</span>
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-[#c9b896] md:text-xl">
              The AI-powered resume builder that makes crafting tailored resumes as intuitive as stacking building blocks.
              Drag, drop, and optimize your way to the top of the stack.
            </p>

            {/* Hero Illustration */}
            <div className="flex justify-center">
              <div className="relative overflow-hidden rounded-3xl border border-[#2a1b12] bg-[#18100a]/60 shadow-[0_25px_80px_-30px_rgba(74,124,44,0.45)]">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#3a5f24]/15" />
                <img
                  src="/NewHeroImage.jpg"
                  alt="Happy person building resume with colorful blocks"
                  className="relative w-full max-w-md h-auto object-cover mix-blend-screen"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-playful h-12 px-8 text-base bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white shadow-lg shadow-[#3a5f24]/30 hover:from-[#4a7c2c] hover:to-[#314d1d]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-playful h-12 px-8 text-base border border-[#4a7c2c]/40 bg-[#18100a]/70 text-[#c9b896] hover:border-[#4a7c2c] hover:bg-[#3a5f24]/15 hover:text-[#f5f1e8]"
                >
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#18100a]/80 to-[#0f0b08]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Everything You Need to Stand Out
              </h2>
              <p className="text-pretty text-lg text-[#c9b896]">
                Powerful features designed to help you land your dream job
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-wiggle border border-[#2a1b12] bg-[#1a110c]/80 backdrop-blur-xl transition-all hover:border-[#3a5f24]/60 hover:shadow-xl hover:shadow-[#3a5f24]/15">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3a5f24]/20">
                    <Blocks className="h-6 w-6 text-[#6c9d45]" style={{ transform: "rotate(-3deg)" }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f1e8]">Block-Based Editor</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Drag and drop resume sections like building blocks. Rearrange, customize, and perfect your layout with ease.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-wiggle border border-[#2a1b12] bg-[#1a110c]/80 backdrop-blur-xl transition-all hover:border-[#3a5f24]/60 hover:shadow-xl hover:shadow-[#3a5f24]/15">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#8b6f47]/20">
                    <Wand2 className="h-6 w-6 text-[#c7a473]" style={{ transform: "rotate(5deg)" }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f1e8]">AI-Powered Critique</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Get instant feedback on your resume content, formatting, and ATS optimization from our advanced AI.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-wiggle border border-[#2a1b12] bg-[#1a110c]/80 backdrop-blur-xl transition-all hover:border-[#3a5f24]/60 hover:shadow-xl hover:shadow-[#3a5f24]/15">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5f8f3f]/20">
                    <Lightbulb className="h-6 w-6 text-[#8fd85a]" style={{ transform: "rotate(-5deg)" }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f1e8]">Smart Suggestions</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Receive intelligent recommendations for skills, achievements, and keywords tailored to your target role.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-20">
          <div className="pointer-events-none absolute inset-0 bg-[#120a05]/80" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="blob-animate absolute left-1/4 top-20 h-72 w-72 rounded-full bg-[#3a5f24]/15 blur-3xl"
              style={{
                clipPath: "polygon(40% 0%, 60% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)",
              }}
            />
          </div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Three Simple Steps to Success
              </h2>
              <p className="text-pretty text-lg text-[#c9b896]">From upload to download in minutes</p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="relative rounded-2xl border border-[#2a1b12] bg-[#1a110c]/80 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex justify-center">
                    <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3a5f24] to-[#253f12] text-2xl font-bold text-white shadow-lg shadow-[#3a5f24]/30">
                      1
                    </div>
                  </div>
                  <div className="mb-4 flex justify-center">
                    <Upload className="h-10 w-10 text-[#6c9d45]" style={{ transform: "rotate(-8deg)" }} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#f5f1e8]">Upload Any Resume</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Start with your existing resume in any format — Word, PDF, or plain text.
                  </p>
                </div>
                <div className="relative rounded-2xl border border-[#2a1b12] bg-[#1a110c]/80 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex justify-center">
                    <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b6f47] to-[#5f4428] text-2xl font-bold text-white shadow-lg shadow-[#8b6f47]/25">
                      2
                    </div>
                  </div>
                  <div className="mb-4 flex justify-center">
                    <Wand2 className="h-10 w-10 text-[#c7a473]" style={{ transform: "rotate(6deg)" }} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#f5f1e8]">AI Restructures & Improves</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Our AI analyzes, optimizes, and transforms your resume into perfectly organized blocks.
                  </p>
                </div>
                <div className="relative rounded-2xl border border-[#2a1b12] bg-[#1a110c]/80 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex justify-center">
                    <div className="btn-playful-alt flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#5f8f3f] to-[#2f4d1d] text-2xl font-bold text-white shadow-lg shadow-[#5f8f3f]/25">
                      3
                    </div>
                  </div>
                  <div className="mb-4 flex justify-center">
                    <FileDown className="h-10 w-10 text-[#8fd85a]" style={{ transform: "rotate(-4deg)" }} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#f5f1e8]">Export Professional PDF</h3>
                  <p className="text-pretty text-sm leading-relaxed text-[#c9b896]">
                    Download your polished, ATS-friendly resume ready for applications.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-playful h-12 px-8 text-base bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white shadow-lg shadow-[#3a5f24]/30 hover:from-[#4a7c2c] hover:to-[#314d1d]"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2a1b12] bg-[#151009] py-12 texture-wood">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12] shadow-lg shadow-[#3a5f24]/30">
                  <Blocks className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#f5f1e8]">ResuBlocks</span>
              </Link>
              <p className="text-sm text-[#c9b896]">Build your future, one block at a time.</p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[#f5f1e8]">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/templates" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[#f5f1e8]">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Career Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[#f5f1e8]">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#c9b896] transition-colors hover:text-[#f5f1e8]">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#2a1b12] pt-8 text-center text-sm text-[#806d52]">
            © 2025 ResuBlocks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

