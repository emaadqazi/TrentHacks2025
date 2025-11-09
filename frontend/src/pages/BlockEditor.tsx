import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Blocks, ArrowLeft, Save, Download } from "lucide-react"
import type { Resume, JobDescription, SuggestionBlock, MatchAnalysis, Section } from "@/types/resume"
import JobDescriptionPanel from "@/components/block-editor/JobDescriptionPanel"
import ResumeCanvas from "@/components/block-editor/ResumeCanvas"
import SuggestionsPanel from "@/components/block-editor/SuggestionsPanel"
import MatchScoreBar from "@/components/block-editor/MatchScoreBar"
import LivePreview from "@/components/block-editor/LivePreview"
import AISuggestionsPanel from "@/components/block-editor/AISuggestionsPanel"

export default function BlockEditor() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestionBlock[]>([])
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showJobDescription, setShowJobDescription] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState<{
    skills?: string[]
    summary?: string[]
    bullets?: Array<{ text: string; sectionType?: Section['type'] }>
  }>({})

  // Load uploaded resume from localStorage on mount
  useEffect(() => {
    const uploadedResumeData = localStorage.getItem('uploadedResume')
    if (uploadedResumeData) {
      try {
        const parsedResume = JSON.parse(uploadedResumeData)
        setResume(parsedResume)
        // Clear localStorage after loading
        localStorage.removeItem('uploadedResume')
      } catch (error) {
        console.error('Error parsing uploaded resume:', error)
      }
    }
  }, [])

  const handleJobDescriptionAnalyze = (jd: JobDescription) => {
    setJobDescription(jd)
    // TODO: Call API to analyze JD and generate suggestions
    // For now, we'll mock some AI suggestions
    setAiSuggestions({
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
      summary: [
        'Experienced software engineer with expertise in full-stack development',
        'Passionate about building scalable web applications',
        'Strong problem-solving and collaboration skills'
      ],
      bullets: [
        { text: 'Developed and maintained React applications', sectionType: 'experience' },
        { text: 'Implemented RESTful APIs using Node.js', sectionType: 'experience' },
        { text: 'Collaborated with cross-functional teams', sectionType: 'experience' }
      ]
    })
    console.log("Analyzing job description:", jd)
  }

  const handleAddSkill = (skill: string) => {
    if (!resume) return
    
    // Find or create skills section
    let skillsSection = resume.sections.find(s => s.type === 'skills')
    
    if (!skillsSection) {
      skillsSection = {
        id: `section-${Date.now()}`,
        type: 'skills',
        label: 'Skills',
        blocks: [],
        order: resume.sections.length,
      }
      setResume({
        ...resume,
        sections: [...resume.sections, skillsSection],
      })
    } else {
      // Add skill to existing section
      const newBlock = {
        id: `block-${Date.now()}`,
        type: 'skill-item' as const,
        text: skill,
      }
      
      setResume({
        ...resume,
        sections: resume.sections.map(section =>
          section.id === skillsSection!.id
            ? { ...section, blocks: [...section.blocks, newBlock] }
            : section
        ),
      })
    }
  }

  const handleAddSummary = (summary: string) => {
    if (!resume) return
    
    // Find or create summary section
    let summarySection = resume.sections.find(s => s.type === 'summary')
    
    if (!summarySection) {
      summarySection = {
        id: `section-${Date.now()}`,
        type: 'summary',
        label: 'Professional Summary',
        blocks: [],
        order: 0,
      }
      setResume({
        ...resume,
        sections: [summarySection, ...resume.sections.map((s, idx) => ({ ...s, order: idx + 1 }))],
      })
    } else {
      // Add summary to existing section
      const newBlock = {
        id: `block-${Date.now()}`,
        type: 'bullet' as const,
        text: summary,
      }
      
      setResume({
        ...resume,
        sections: resume.sections.map(section =>
          section.id === summarySection!.id
            ? { ...section, blocks: [...section.blocks, newBlock] }
            : section
        ),
      })
    }
  }

  const handleAddBullet = (bullet: string, sectionId: string) => {
    if (!resume) return
    
    const newBlock = {
      id: `block-${Date.now()}`,
      type: 'bullet' as const,
      text: bullet,
    }
    
    setResume({
      ...resume,
      sections: resume.sections.map(section =>
        section.id === sectionId
          ? { ...section, blocks: [...section.blocks, newBlock] }
          : section
      ),
    })
  }

  const handleBlockReplace = (originalBlockId: string, suggestionId: string) => {
    // TODO: Replace block with suggestion
    console.log("Replacing block:", originalBlockId, "with:", suggestionId)
  }

  const handleSaveResume = () => {
    // TODO: Save resume
    console.log("Saving resume")
  }

  const handleExport = () => {
    // TODO: Export resume
    console.log("Exporting resume")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Blocks className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">
                  {resume?.title || "New Resume"}
                </span>
                <p className="text-xs text-muted-foreground">Block Editor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveResume}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </nav>

      {/* Match Score Bar */}
      {matchAnalysis && <MatchScoreBar analysis={matchAnalysis} />}

          {/* Main Layout - AI Suggestions and Preview Side by Side (Caffine AI Style) */}
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-4 h-[calc(100vh-10rem)]">
              {/* Left Panel - AI Suggestions (Caffine AI Style) */}
              <div className="order-2 lg:order-1 overflow-hidden">
                <AISuggestionsPanel
                  suggestions={aiSuggestions}
                  resume={resume}
                  onAddSkill={handleAddSkill}
                  onAddSummary={handleAddSummary}
                  onAddBullet={handleAddBullet}
                />
              </div>

              {/* Right Panel - Live Preview (Caffine AI Style) */}
              <div className="order-1 lg:order-2 overflow-hidden">
                <LivePreview
                  resume={resume}
                  setResume={setResume}
                  onBlockUpdate={(sectionId, blockId, text) => {
                    // Sync updates between preview and editor
                    if (resume) {
                      const updatedResume = {
                        ...resume,
                        sections: resume.sections.map((section) =>
                          section.id === sectionId
                            ? {
                                ...section,
                                blocks: section.blocks.map((block) =>
                                  block.id === blockId ? { ...block, text } : block
                                ),
                                subsections: section.subsections?.map((subsection) => ({
                                  ...subsection,
                                  blocks: subsection.blocks.map((block) =>
                                    block.id === blockId ? { ...block, text } : block
                                  ),
                                })),
                              }
                            : section
                        ),
                      }
                      setResume(updatedResume)
                    }
                  }}
                />
              </div>
            </div>
          </div>

      {/* Job Description Panel (Collapsible - Top Right) */}
      {showJobDescription && (
        <div className="fixed top-20 right-6 z-50 w-80 max-h-96 overflow-y-auto">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Job Description</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJobDescription(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <JobDescriptionPanel
                onAnalyze={handleJobDescriptionAnalyze}
                jobDescription={jobDescription}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {!showJobDescription && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJobDescription(true)}
            className="shadow-md"
          >
            Job Description
          </Button>
        )}
      </div>
    </div>
  )
}

