import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import type { Resume, ExperienceEntry, EducationEntry, SkillCategory } from "@/types/resume"
import { getResume, updateResumeData } from "@/lib/firestore"
import type { UserResume } from "@/lib/firestore"
import toast from "react-hot-toast"
import ExperienceCard from "@/components/editor/ExperienceCard"
import EducationCard from "@/components/editor/EducationCard"
import SkillsEditor from "@/components/editor/SkillsEditor"
import AIAnalyticsPanel from "@/components/editor/AIAnalyticsPanel"
import LatexStylePreview from "@/components/editor/LatexStylePreview"
import HeaderEditor from "@/components/editor/HeaderEditor"

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [resumeMetadata, setResumeMetadata] = useState<UserResume | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true) // Show preview by default

  useEffect(() => {
    if (id) {
      loadResume(id)
    }
  }, [id])

  // Auto-save after changes (debounced)
  useEffect(() => {
    if (!resume || !resumeMetadata || loading) return

    const timeout = setTimeout(async () => {
      try {
        setSaving(true)
        await updateResumeData(resumeMetadata.id, resume)
      } catch (error) {
        console.error('Auto-save error:', error)
      } finally {
        setSaving(false)
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [resume, resumeMetadata, loading])

  // Migration function to convert old block-based resumes to new structure
  const migrateOldResume = (oldResume: any): Resume => {
    // Check if it's already in new format
    if (oldResume.experience && Array.isArray(oldResume.experience)) {
      return oldResume as Resume
    }

    // Migrate from old block format
    const newResume: Resume = {
      id: oldResume.id || '',
      userId: oldResume.userId || '',
      title: oldResume.title || 'Untitled Resume',
      createdAt: oldResume.createdAt || new Date(),
      updatedAt: oldResume.updatedAt || new Date(),
      header: {
        name: oldResume.title || '',
        email: '',
        phone: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    }

    // Migrate from old sections format
    if (oldResume.sections && Array.isArray(oldResume.sections)) {
      oldResume.sections.forEach((section: any) => {
        if (section.type === 'experience') {
          // Convert experience blocks to experience entries
          if (section.subsections) {
            section.subsections.forEach((subsec: any, idx: number) => {
              const bullets = subsec.blocks
                ?.filter((b: any) => b.type === 'bullet')
                .map((b: any) => b.text) || []
              
              const metaBlocks = subsec.blocks?.filter((b: any) => b.type === 'meta') || []
              const dates = metaBlocks.find((b: any) => b.text.includes('-'))?.text || ''
              const [startDate = '', endDate = ''] = dates.split('-').map((d: string) => d.trim())
              
              newResume.experience.push({
                id: subsec.id || `exp-${Date.now()}-${idx}`,
                company: subsec.title?.split('-')[0]?.trim() || 'Company',
                role: subsec.title?.split('-')[1]?.trim() || 'Role',
                location: '',
                startDate,
                endDate,
                bullets,
                order: idx
              })
            })
          }
        } else if (section.type === 'education') {
          // Convert education blocks
          if (section.subsections) {
            section.subsections.forEach((subsec: any, idx: number) => {
              newResume.education.push({
                id: subsec.id || `edu-${Date.now()}-${idx}`,
                school: subsec.title || 'School',
                degree: subsec.blocks?.find((b: any) => b.type === 'header')?.text || '',
                location: '',
                graduationDate: '',
                order: idx
              })
            })
          }
        } else if (section.type === 'skills') {
          // Convert skills
          const skillTexts = section.blocks
            ?.filter((b: any) => b.type === 'skill-item')
            .map((b: any) => b.text) || []
          
          if (skillTexts.length > 0) {
            newResume.skills.push({
              id: `skill-${Date.now()}`,
              category: 'Skills',
              skills: skillTexts,
              order: 0
            })
          }
        }
      })
    }

    return newResume
  }

  const loadResume = async (resumeId: string) => {
    try {
      setLoading(true)
      const data = await getResume(resumeId)
      
      if (data) {
        console.log('📥 Loaded resume from Firestore:', data)
        setResumeMetadata(data)
        
        // Parse resumeData to Resume type
        let parsedResume: Resume = typeof data.resumeData === 'string' 
          ? JSON.parse(data.resumeData)
          : data.resumeData as Resume

        console.log('📦 Parsed resume data:', parsedResume)

        // Migrate old format to new format
        parsedResume = migrateOldResume(parsedResume)

        console.log('🔄 After migration:', parsedResume)

        // Ensure all required fields exist
        if (!parsedResume.header) {
          parsedResume.header = {
            name: parsedResume.title || data.title || '',
            email: '',
            phone: ''
          }
        }
        if (!parsedResume.experience) parsedResume.experience = []
        if (!parsedResume.education) parsedResume.education = []
        if (!parsedResume.skills) parsedResume.skills = []
        if (!parsedResume.projects) parsedResume.projects = []
        if (!parsedResume.certifications) parsedResume.certifications = []

        console.log('✅ Final resume state:', {
          hasHeader: !!parsedResume.header,
          experienceCount: parsedResume.experience.length,
          educationCount: parsedResume.education.length,
          skillsCount: parsedResume.skills.length,
          projectsCount: parsedResume.projects?.length || 0
        })

        setResume(parsedResume)
        toast.success('Resume loaded successfully')
      } else {
        toast.error('Resume not found')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error loading resume:', error)
      toast.error('Failed to load resume')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExperience = (id: string, updates: Partial<ExperienceEntry>) => {
    if (!resume) return
    
    setResume({
      ...resume,
      experience: resume.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    })
  }

  const handleDeleteExperience = (id: string) => {
    if (!resume) return
    
    setResume({
      ...resume,
      experience: resume.experience.filter(exp => exp.id !== id)
    })
    
    if (selectedExperienceId === id) {
      setSelectedExperienceId(null)
    }
  }

  const handleAddExperience = () => {
    if (!resume) return
    
    const newExperience: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      company: "New Company",
      role: "Role Title",
      location: "City, State",
      startDate: "Month Year",
      endDate: "Month Year",
      bullets: ["Add your achievements and responsibilities here"],
      order: resume.experience.length
    }
    
    setResume({
      ...resume,
      experience: [...resume.experience, newExperience]
    })
  }

  const handleAnalyzeExperience = async (experienceId: string) => {
    setShowPreview(false) // Switch to analytics view
    setSelectedExperienceId(experienceId) // Select the experience
    
    // Show loading toast
    const loadingToast = toast.loading('Analyzing with AI...')
    
    try {
      // TODO: Call AI API endpoint
      // For now, mock some data
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (!resume) return
      
      setResume({
        ...resume,
        experience: resume.experience.map(exp => 
          exp.id === experienceId 
            ? {
                ...exp,
                aiScore: {
                  overall: Math.floor(Math.random() * 30) + 70,
                  keywordMatch: Math.floor(Math.random() * 30) + 65,
                  bulletStrengths: exp.bullets.map(() => Math.floor(Math.random() * 30) + 60),
                  suggestions: [
                    "Use stronger action verbs like 'implemented', 'architected', or 'led'",
                    "Quantify your achievements with specific numbers and metrics",
                    "Incorporate more keywords from the job description"
                  ],
                  missingKeywords: ["React", "TypeScript", "AWS", "CI/CD"]
                }
              }
            : exp
        )
      })
      
      toast.success('Analysis complete!', { id: loadingToast })
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze experience', { id: loadingToast })
    }
  }

  const handleUpdateEducation = (id: string, updates: Partial<EducationEntry>) => {
    if (!resume) return
    
    setResume({
      ...resume,
      education: resume.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    })
  }

  const handleDeleteEducation = (id: string) => {
    if (!resume) return
    
    setResume({
      ...resume,
      education: resume.education.filter(edu => edu.id !== id)
    })
  }

  const handleAddEducation = () => {
    if (!resume) return
    
    const newEducation: EducationEntry = {
      id: `edu-${Date.now()}`,
      school: "University Name",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "City, State",
      graduationDate: "Month Year",
      order: resume.education.length
    }
    
    setResume({
      ...resume,
      education: [...resume.education, newEducation]
    })
  }

  const handleUpdateSkills = (skills: SkillCategory[]) => {
    if (!resume) return
    
    setResume({
      ...resume,
      skills
    })
  }

  const handleUpdateHeader = (updates: Partial<Resume['header']>) => {
    if (!resume) return
    
    setResume({
      ...resume,
      header: { ...resume.header, ...updates }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!resume) {
    return null
  }

  const selectedExperience = selectedExperienceId 
    ? resume.experience.find(exp => exp.id === selectedExperienceId) || null
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1810] via-[#3D2415] to-[#1A0F0A]">
      {/* Navigation Bar */}
      <nav className="bg-[#221410]/90 backdrop-blur-xl border-b border-[#8B6F47]/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-[#F5F1E8]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-[#F5F1E8]">{resume.title}</h1>
              {saving && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-[#F5F1E8] border-[#8B6F47]/30"
            >
              {showPreview ? 'Show Analytics' : 'Show Preview'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main 2-Panel Layout */}
      <div className="container-fluid px-4 py-6 relative z-10 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Panel - Editable Cards */}
          <div className="col-span-5 overflow-y-auto">
            <div className="space-y-4">
              {/* Header Section */}
              <HeaderEditor 
                header={resume.header} 
                onUpdate={handleUpdateHeader}
              />

              {/* Education Section */}
              <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#F5F1E8]">Education</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleAddEducation}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resume.education.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No education entries yet
                    </p>
                  ) : (
                    resume.education.map(edu => (
                      <EducationCard
                        key={edu.id}
                        education={edu}
                        onUpdate={(updates) => handleUpdateEducation(edu.id, updates)}
                        onDelete={() => handleDeleteEducation(edu.id)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <SkillsEditor 
                skills={resume.skills} 
                onUpdate={handleUpdateSkills}
              />

              {/* Experience Section */}
              <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#F5F1E8]">Work Experience</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleAddExperience}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resume.experience.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No experience entries yet
                    </p>
                  ) : (
                    resume.experience.map(exp => (
                      <ExperienceCard
                        key={exp.id}
                        experience={exp}
                        onUpdate={(updates) => handleUpdateExperience(exp.id, updates)}
                        onDelete={() => handleDeleteExperience(exp.id)}
                        onAnalyze={() => handleAnalyzeExperience(exp.id)}
                        isSelected={selectedExperienceId === exp.id}
                        onClick={() => setSelectedExperienceId(exp.id)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - AI Analytics or Preview */}
          <div className="col-span-7 overflow-hidden">
            {showPreview ? (
              <LatexStylePreview resume={resume} />
            ) : (
              <AIAnalyticsPanel experience={selectedExperience} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

