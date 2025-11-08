import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { JobDescription } from "@/types/resume"
import { Sparkles, Loader2 } from "lucide-react"

interface JobDescriptionPanelProps {
  onAnalyze: (jd: JobDescription) => void
  jobDescription: JobDescription | null
}

export default function JobDescriptionPanel({ onAnalyze, jobDescription }: JobDescriptionPanelProps) {
  const [text, setText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      const mockJD: JobDescription = {
        id: Date.now().toString(),
        text: text,
        keywords: ["React", "TypeScript", "Node.js", "API", "Teamwork"], // Mock extraction
        requiredSkills: ["React", "TypeScript"],
        preferredSkills: ["Node.js", "API"],
      }
      onAnalyze(mockJD)
      setAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="jd-text" className="text-sm font-medium mb-2 block">
          Paste Job Description
        </Label>
        <textarea
          id="jd-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full min-h-[300px] p-3 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={analyzing}
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={!text.trim() || analyzing}
        className="w-full"
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Job Description
          </>
        )}
      </Button>

      {jobDescription && (
        <div className="space-y-3 pt-4 border-t">
          <div>
            <h4 className="text-sm font-semibold mb-2">Extracted Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.requiredSkills.map((skill, idx) => (
                <Badge key={idx} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

