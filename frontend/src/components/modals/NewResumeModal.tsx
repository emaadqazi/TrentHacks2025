import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2, FileText, Target, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NewResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateResume: (resumeData: {
    title: string
    targetRole?: string
    goals?: string
    createdAt: string
    template?: string
  }) => Promise<string>
}

export function NewResumeModal({ isOpen, onClose, onCreateResume }: NewResumeModalProps) {
  const [resumeTitle, setResumeTitle] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [goals, setGoals] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const resumeData = {
        title: resumeTitle,
        targetRole: targetRole || undefined,
        goals: goals || undefined,
        createdAt: new Date().toISOString(),
      }

      // Call the parent callback to create the resume (await the promise)
      const resumeId = await onCreateResume(resumeData)

      // Only proceed if we got a valid resume ID
      if (resumeId) {
        // Close modal and reset form
        onClose()
        setResumeTitle("")
        setTargetRole("")
        setGoals("")

        // Navigate to editor with the new resume ID
        navigate(`/editor/${resumeId}`)
      }
    } catch (error) {
      console.error("Error creating resume:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg"
            >
              <Card className="border-2 border-[#8B6F47]/30 bg-gradient-to-br from-[#221410]/98 to-[#18100a]/98 backdrop-blur-xl shadow-2xl">
                <CardHeader className="relative">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 hover:bg-[#F5F1E8]/10 transition-colors"
                  >
                    <X className="h-5 w-5 text-[#C9B896]" />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#F5F1E8]">
                        Create New Resume
                      </CardTitle>
                      <CardDescription className="text-[#C9B896]">
                        Let's start building your perfect resume
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Resume Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-[#F5F1E8] flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Resume Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Software Engineer Resume"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        required
                        disabled={loading}
                        className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#3a5f24] focus:ring-[#3a5f24]"
                      />
                    </div>

                    {/* Target Role */}
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-[#F5F1E8] flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Target Role (Optional)
                      </Label>
                      <Input
                        id="role"
                        placeholder="e.g., Senior Frontend Developer"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        disabled={loading}
                        className="bg-[#18100a]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#3a5f24] focus:ring-[#3a5f24]"
                      />
                    </div>

                    {/* Goals */}
                    <div className="space-y-2">
                      <Label htmlFor="goals" className="text-[#F5F1E8] flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Your Goals (Optional)
                      </Label>
                      <textarea
                        id="goals"
                        placeholder="What do you want to achieve with this resume? Any specific companies or industries you're targeting?"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        disabled={loading}
                        rows={4}
                        className="w-full rounded-md bg-[#18100a]/60 border border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#8B6F47] focus:border-[#3a5f24] focus:ring-[#3a5f24] focus:ring-1 px-3 py-2 text-sm resize-none"
                      />
                      <p className="text-xs text-[#C9B896]">
                        This helps our AI provide better suggestions tailored to your goals
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:text-[#F5F1E8] hover:border-[#3a5f24]/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222] shadow-lg shadow-[#3a5f24]/20"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Resume"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

