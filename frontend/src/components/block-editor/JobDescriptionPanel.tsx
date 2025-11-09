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
        <Label htmlFor="jd-text" className="text-sm font-medium mb-2 block text-[#F5F1E8]">
          Paste Job Description
        </Label>
        <textarea
          id="jd-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full min-h-[300px] p-3 text-sm border border-[#8B6F47]/30 rounded-md bg-[#18100a]/60 text-[#F5F1E8] placeholder:text-[#8B6F47] resize-none focus:outline-none focus:ring-2 focus:ring-[#3a5f24] focus:border-[#3a5f24]"
          disabled={analyzing}
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={!text.trim() || analyzing}
        className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]"
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
        <div className="space-y-3 pt-4 border-t border-[#8B6F47]/30">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-[#F5F1E8]">Extracted Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.keywords.map((keyword, idx) => (
                <Badge key={idx} className="text-xs bg-[#8B6F47]/20 text-[#C9B896] border-[#8B6F47]/30">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2 text-[#F5F1E8]">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {jobDescription.requiredSkills.map((skill, idx) => (
                <Badge key={idx} className="text-xs bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white">
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

