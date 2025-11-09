import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { Resume } from "@/types/resume"

interface LatexStylePreviewProps {
  resume: Resume | null
}

export default function LatexStylePreview({ resume }: LatexStylePreviewProps) {
  if (!resume) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resume Preview
          </CardTitle>
          <CardDescription>
            Real-time preview of your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No resume loaded</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4 bg-gradient-to-br from-accent/30 to-accent/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resume Preview
        </CardTitle>
        <CardDescription>
          Real-time preview matching your final PDF export
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <div className="flex justify-center">
            {/* A4-sized resume container */}
            <div className="w-[816px] bg-white text-black shadow-xl ring-1 ring-black/10 overflow-hidden">
              <div className="px-10 py-10 font-serif">
                {/* Header / Contact Info */}
                {resume.header && (
                  <div className="text-center mb-6">
                    {resume.header.name && (
                      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                        {resume.header.name}
                      </h1>
                    )}
                    <div className="text-sm space-x-3">
                      {resume.header.email && <span>{resume.header.email}</span>}
                      {resume.header.phone && <span>| {resume.header.phone}</span>}
                      {resume.header.linkedin && <span>| {resume.header.linkedin}</span>}
                      {resume.header.github && <span>| {resume.header.github}</span>}
                      {resume.header.location && <span>| {resume.header.location}</span>}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.education && resume.education.length > 0 && (
                  <section className="mb-4">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide border-b border-black/60 pb-1 mb-2">
                      Education
                    </h2>
                    <div className="space-y-2">
                      {resume.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex items-baseline justify-between">
                            <span className="font-extrabold">{edu.school}</span>
                            {edu.location && <span className="text-sm">{edu.location}</span>}
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="italic text-sm">
                              {edu.degree}
                              {edu.field && ` in ${edu.field}`}
                            </span>
                            <span className="text-sm">{edu.graduationDate}</span>
                          </div>
                          {edu.gpa && (
                            <div className="text-sm">GPA: {edu.gpa}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Technical Skills */}
                {resume.skills && resume.skills.length > 0 && (
                  <section className="mb-4">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide border-b border-black/60 pb-1 mb-2">
                      Technical Skills
                    </h2>
                    <div className="space-y-1">
                      {resume.skills.map((skillCat) => (
                        <div key={skillCat.id} className="text-sm">
                          <span className="font-extrabold">{skillCat.category}:</span>{" "}
                          <span>{skillCat.skills.join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Work Experience */}
                {resume.experience && resume.experience.length > 0 && (
                  <section className="mb-4">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide border-b border-black/60 pb-1 mb-2">
                      Work Experience
                    </h2>
                    <div className="space-y-3">
                      {resume.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-baseline justify-between">
                            <span className="font-extrabold">{exp.company}</span>
                            <div className="text-sm flex gap-3">
                              {exp.location && <span>{exp.location}</span>}
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                          </div>
                          <div className="italic text-sm">{exp.role}</div>
                          {exp.bullets.length > 0 && (
                            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-sm">
                              {exp.bullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {resume.projects && resume.projects.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide border-b border-black/60 pb-1 mb-2">
                      Projects
                    </h2>
                    <div className="space-y-2">
                      {resume.projects.map((project) => (
                        <div key={project.id}>
                          <div className="font-extrabold">{project.name}</div>
                          {project.description && (
                            <p className="text-sm">{project.description}</p>
                          )}
                          {project.technologies.length > 0 && (
                            <p className="text-sm italic">
                              Technologies: {project.technologies.join(", ")}
                            </p>
                          )}
                          {project.link && (
                            <p className="text-sm">{project.link}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {resume.certifications && resume.certifications.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide border-b border-black/60 pb-1 mb-2">
                      Certifications
                    </h2>
                    <ul className="list-disc pl-5 space-y-0.5 text-sm">
                      {resume.certifications.map((cert, i) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

