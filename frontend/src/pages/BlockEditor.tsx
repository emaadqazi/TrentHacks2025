import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Blocks, ArrowLeft, Loader2 } from "lucide-react"
import type { Resume, JobDescription, MatchAnalysis, SectionType, Section, Block } from "@/types/resume"
import JobDescriptionPanel from "@/components/block-editor/JobDescriptionPanel"
import LivePreview from "@/components/block-editor/LivePreview"
import AISuggestionsPanel from "@/components/block-editor/AISuggestionsPanel"
import MatchScoreBar from "@/components/block-editor/MatchScoreBar"
import { getResume, updateResumeData } from "@/lib/firestore"
import type { UserResume } from "@/lib/firestore"
import toast from "react-hot-toast"

interface AiSuggestions {
  skills?: string[]
  summary?: string[]
  bullets?: Array<{ text: string; sectionType?: SectionType }>
}

export default function BlockEditor() {
  const { id: resumeId } = useParams<{ id: string }>()
  const [resumeMetadata, setResumeMetadata] = useState<UserResume | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestions | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load resume data from Firestore
  useEffect(() => {
    async function loadResume() {
      if (!resumeId) {
        setLoading(false)
        return
      }

      try {
        const data = await getResume(resumeId)
        if (data) {
          setResumeMetadata(data)
          if (data.resumeData) {
            setResume(data.resumeData)
          }
        } else {
          toast.error('Resume not found')
        }
      } catch (error) {
        console.error('Error loading resume:', error)
        toast.error('Failed to load resume')
      } finally {
        setLoading(false)
      }
    }

    loadResume()
  }, [resumeId])

  // Auto-save resume data when it changes
  useEffect(() => {
    if (!resumeId || !resume || loading) return

    const timeoutId = setTimeout(async () => {
      try {
        setSaving(true)
        await updateResumeData(resumeId, resume)
      } catch (error) {
        console.error('Error saving resume:', error)
        toast.error('Failed to save changes')
      } finally {
        setSaving(false)
      }
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(timeoutId)
  }, [resume, resumeId, loading])

  const handleJobDescriptionAnalyze = (jd: JobDescription) => {
    setJobDescription(jd)
    // Mock AI suggestions for now
    setAiSuggestions({
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
      summary: [
        "Experienced software engineer with expertise in full-stack development",
        "Passionate about building scalable web applications",
        "Strong problem-solving and collaboration skills",
      ],
      bullets: [
        { text: "Developed and maintained React applications", sectionType: "experience" },
        { text: "Implemented RESTful APIs using Node.js", sectionType: "experience" },
        { text: "Collaborated with cross-functional teams", sectionType: "experience" },
      ],
    })

    // Mock match analysis while backend integration is pending
    setMatchAnalysis({
      overallScore: 72,
      matchedKeywords: jd.keywords.slice(0, 3),
      missingKeywords: jd.keywords.slice(3),
      strongSections: resume?.sections
        .filter((section) => section.blocks.some((block) => block.score && block.score >= 70))
        .map((section) => ({
          ...section,
          blocks: section.blocks.filter((block) => block.score && block.score >= 70),
        })) ?? [],
      weakSections: resume?.sections
        .filter((section) => section.blocks.some((block) => !block.score || block.score < 50))
        .map((section) => ({
          ...section,
          blocks: section.blocks.filter((block) => !block.score || block.score < 50),
        })) ?? [],
    })
  }

  const handleAddSkill = (skill: string) => {
    setResume((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      let sectionIndex = sections.findIndex((section) => section.type === "skills")

      if (sectionIndex === -1) {
        const newSection: Section = {
          id: `section-${Date.now()}`,
          type: "skills",
          label: "Skills",
          order: sections.length,
          blocks: [],
        }
        sections.push(newSection)
        sectionIndex = sections.length - 1
      }

      const section = sections[sectionIndex]
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: "skill-item",
        text: skill,
      }

      sections[sectionIndex] = {
        ...section,
        blocks: [...section.blocks, newBlock],
      }

      return {
        ...prev,
        sections,
      }
    })
  }

  const handleAddSummary = (summary: string) => {
    setResume((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      let sectionIndex = sections.findIndex((section) => section.type === "summary")

      if (sectionIndex === -1) {
        const newSection: Section = {
          id: `section-${Date.now()}`,
          type: "summary",
          label: "Professional Summary",
          order: 0,
          blocks: [],
        }

        const updatedSections = [
          newSection,
          ...sections.map((section, idx) => ({
            ...section,
            order: idx + 1,
          })),
        ]

        const newBlock: Block = {
          id: `block-${Date.now()}`,
          type: "bullet",
          text: summary,
        }

        updatedSections[0] = {
          ...newSection,
          blocks: [newBlock],
        }

        return {
          ...prev,
          sections: updatedSections,
        }
      }

      const section = sections[sectionIndex]
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: "bullet",
        text: summary,
      }

      sections[sectionIndex] = {
        ...section,
        blocks: [...section.blocks, newBlock],
      }

      return {
        ...prev,
        sections,
      }
    })
  }

  const handleAddBullet = (bullet: string, sectionId: string) => {
    setResume((prev) => {
      if (!prev) return prev

      const sections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section

        const newBlock: Block = {
          id: `block-${Date.now()}`,
          type: "bullet",
          text: bullet,
        }

        return {
          ...section,
          blocks: [...section.blocks, newBlock],
        }
      })

      return {
        ...prev,
        sections,
      }
    })
  }

  const updateResume = (updatedResume: Resume) => {
    setResume(updatedResume)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#3a5f24] mx-auto mb-4" />
          <p className="text-[#C9B896]">Loading your resume...</p>
        </div>
      </div>
    )
  }

  if (!resumeMetadata && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5F1E8] text-xl mb-4">Resume not found</p>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18100a] via-[#221410] to-[#0f0b08]">
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />

      {/* Top Navigation */}
      <nav className="border-b border-[#8B6F47]/20 bg-[#221410]/80 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-[#C9B896] hover:bg-[#F5F1E8]/10 hover:text-[#F5F1E8]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
                <Blocks className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#F5F1E8]">
                  {resumeMetadata?.title || "New Resume"}
                </span>
                {resumeMetadata?.targetRole && (
                  <p className="text-xs text-[#C9B896]">{resumeMetadata.targetRole}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-[#C9B896] text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {!saving && resume && (
              <span className="text-[#3a5f24] text-sm">✓ Saved</span>
            )}
          </div>
        </div>
      </nav>

      {/* Match Score Bar */}
      {matchAnalysis && <MatchScoreBar analysis={matchAnalysis} />}

      {/* Main 3-Panel Layout */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Job Description */}
          <div className="col-span-3 overflow-y-auto">
            <Card className="h-full border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#F5F1E8]">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <JobDescriptionPanel
                  onAnalyze={handleJobDescriptionAnalyze}
                  jobDescription={jobDescription}
                />
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Resume Canvas */}
            <div className="col-span-6 overflow-y-auto">
              <Card className="h-full border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg text-[#F5F1E8]">Your Resume</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <LivePreview resume={resume} setResume={updateResume} />
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Suggestions */}
            <div className="col-span-3 overflow-y-auto">
              <AISuggestionsPanel
                suggestions={aiSuggestions ?? undefined}
                resume={resume}
                onAddSkill={handleAddSkill}
                onAddSummary={handleAddSummary}
                onAddBullet={handleAddBullet}
              />
            </div>
        </div>
      </div>
    </div>
  )
}

