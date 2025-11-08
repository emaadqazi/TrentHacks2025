import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Blocks, ArrowLeft, Save, Download, Upload } from "lucide-react"
import type { Resume, JobDescription, SuggestionBlock, MatchAnalysis } from "@/types/resume"
import JobDescriptionPanel from "@/components/block-editor/JobDescriptionPanel"
import ResumeCanvas from "@/components/block-editor/ResumeCanvas"
import SuggestionsPanel from "@/components/block-editor/SuggestionsPanel"
import MatchScoreBar from "@/components/block-editor/MatchScoreBar"
import { PDFUploader } from "@/components/resume/PDFUploader"
import { motion, AnimatePresence } from "framer-motion"

export default function BlockEditor() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [suggestions, setSuggestions] = useState<SuggestionBlock[]>([])
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showUploader, setShowUploader] = useState(true)

  const handleResumeLoaded = (loadedResume: Resume) => {
    setResume(loadedResume)
    setShowUploader(false)
  }

  const handleJobDescriptionAnalyze = (jd: JobDescription) => {
    setJobDescription(jd)
    // TODO: Call API to analyze JD and generate suggestions
    // For now, we'll mock this
    console.log("Analyzing job description:", jd)
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

  const toggleUploader = () => {
    setShowUploader(!showUploader)
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
            {resume && (
              <Button variant="ghost" size="sm" onClick={toggleUploader}>
                <Upload className="mr-2 h-4 w-4" />
                {showUploader ? "Hide" : "Show"} Uploader
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSaveResume} disabled={!resume}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button size="sm" onClick={handleExport} disabled={!resume}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </nav>

      {/* Match Score Bar */}
      {matchAnalysis && <MatchScoreBar analysis={matchAnalysis} />}

      {/* PDF Uploader Section */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b bg-muted/30"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {resume ? "Upload Another Resume" : "Upload Your Resume"}
                </h2>
                <p className="text-muted-foreground">
                  Upload a PDF resume to automatically parse it into editable blocks
                </p>
              </div>
              <PDFUploader
                onResumeLoaded={handleResumeLoaded}
                onFileSelect={setUploadedFile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3-Panel Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Job Description */}
          <div className="col-span-3 overflow-y-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Your Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeCanvas
                  resume={resume}
                  setResume={setResume}
                  selectedBlockId={selectedBlockId}
                  onBlockSelect={setSelectedBlockId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Suggestions */}
          <div className="col-span-3 overflow-y-auto">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <SuggestionsPanel
                  suggestions={suggestions}
                  selectedBlockId={selectedBlockId}
                  onReplace={handleBlockReplace}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

