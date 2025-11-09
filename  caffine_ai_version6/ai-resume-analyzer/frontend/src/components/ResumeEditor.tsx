import { Plus, Trash2, GripVertical, Sparkles, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResumeData } from './AnalyzerForm';
import { useState } from 'react';

interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  aiSuggestions?: {
    skills: string[];
    summary: string[];
  };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400';
  if (score >= 60) return 'border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
  return 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400';
}

function getScoreIndicator(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🟡';
  return '🔴';
}

function getScoreBadgeClass(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
  return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
}

export default function ResumeEditor({ resumeData, setResumeData, aiSuggestions }: ResumeEditorProps) {
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);
  const [draggedSummary, setDraggedSummary] = useState<string | null>(null);

  // Education handlers
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: Date.now().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', score: Math.floor(Math.random() * 30) + 60 },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((item) => item.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  // Experience handlers
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '', score: Math.floor(Math.random() * 30) + 60 },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((item) => item.id !== id),
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  // Project handlers
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { id: Date.now().toString(), name: '', description: '', technologies: '', link: '', score: Math.floor(Math.random() * 30) + 60 },
      ],
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((item) => item.id !== id),
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  // Extracurricular handlers
  const addExtracurricular = () => {
    setResumeData({
      ...resumeData,
      extracurricular: [
        ...resumeData.extracurricular,
        { id: Date.now().toString(), organization: '', role: '', startDate: '', endDate: '', description: '', score: Math.floor(Math.random() * 30) + 60 },
      ],
    });
  };

  const removeExtracurricular = (id: string) => {
    setResumeData({
      ...resumeData,
      extracurricular: resumeData.extracurricular.filter((item) => item.id !== id),
    });
  };

  const updateExtracurricular = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      extracurricular: resumeData.extracurricular.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  // Skills handlers with drag-and-drop
  const addSkillFromSuggestion = (skillName: string) => {
    const newSkill = {
      id: Date.now().toString(),
      name: skillName,
      score: Math.floor(Math.random() * 20) + 75,
      isAISuggested: true,
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const addCustomSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        { id: Date.now().toString(), name: '', score: Math.floor(Math.random() * 30) + 60, isAISuggested: false },
      ],
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((item) => item.id !== id),
    });
  };

  const updateSkill = (id: string, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((item) =>
        item.id === id ? { ...item, name: value } : item
      ),
    });
  };

  // Professional Summary handlers with drag-and-drop
  const addSummaryFromSuggestion = (summaryText: string) => {
    const newSummary = {
      id: Date.now().toString(),
      text: summaryText,
      score: Math.floor(Math.random() * 20) + 75,
      isAISuggested: true,
    };
    setResumeData({
      ...resumeData,
      professionalSummary: [...resumeData.professionalSummary, newSummary],
    });
  };

  const addCustomSummary = () => {
    setResumeData({
      ...resumeData,
      professionalSummary: [
        ...resumeData.professionalSummary,
        { id: Date.now().toString(), text: '', score: Math.floor(Math.random() * 30) + 60, isAISuggested: false },
      ],
    });
  };

  const removeSummary = (id: string) => {
    setResumeData({
      ...resumeData,
      professionalSummary: resumeData.professionalSummary.filter((item) => item.id !== id),
    });
  };

  const updateSummary = (id: string, value: string) => {
    setResumeData({
      ...resumeData,
      professionalSummary: resumeData.professionalSummary.map((item) =>
        item.id === id ? { ...item, text: value } : item
      ),
    });
  };

  // Drag and drop handlers for skills
  const handleSkillDragStart = (skillName: string) => {
    setDraggedSkill(skillName);
  };

  const handleSkillDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSkill) {
      addSkillFromSuggestion(draggedSkill);
      setDraggedSkill(null);
    }
  };

  const handleSkillDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Drag and drop handlers for summary
  const handleSummaryDragStart = (summaryText: string) => {
    setDraggedSummary(summaryText);
  };

  const handleSummaryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSummary) {
      addSummaryFromSuggestion(draggedSummary);
      setDraggedSummary(null);
    }
  };

  const handleSummaryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel: AI Suggestions */}
      <Card className="border-border/50 shadow-xl shadow-primary/5 h-fit lg:sticky lg:top-4">
        <CardHeader className="space-y-1 pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <CardDescription className="text-sm">
            Drag items to the resume preview or click to add them
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* AI Suggested Summary Points */}
              {aiSuggestions && aiSuggestions.summary.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h3 className="text-sm font-semibold text-foreground">Professional Summary</h3>
                  </div>
                  <div className="space-y-2 pl-4">
                    {aiSuggestions.summary
                      .filter(s => !resumeData.professionalSummary.some(ps => ps.text === s))
                      .map((suggestion, index) => (
                        <div
                          key={index}
                          className="group cursor-move p-3 border-2 border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
                          draggable
                          onDragStart={() => handleSummaryDragStart(suggestion)}
                          onClick={() => addSummaryFromSuggestion(suggestion)}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/90 leading-relaxed">{suggestion}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* AI Suggested Skills */}
              {aiSuggestions && aiSuggestions.skills.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h3 className="text-sm font-semibold text-foreground">Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {aiSuggestions.skills
                      .filter(s => !resumeData.skills.some(skill => skill.name === s))
                      .map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-move px-3 py-2 text-sm border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all"
                          draggable
                          onDragStart={() => handleSkillDragStart(suggestion)}
                          onClick={() => addSkillFromSuggestion(suggestion)}
                        >
                          <GripVertical className="h-3 w-3 mr-1 text-primary/60" />
                          {suggestion}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel: PDF-Style Live Resume Preview */}
      <Card className="border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 pb-4 bg-gradient-to-br from-accent/30 to-accent/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Live Resume Preview
          </CardTitle>
          <CardDescription className="text-sm">
            Real-time preview matching your final PDF export
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[600px] pr-4">
            {/* PDF-Style Resume Document */}
            <div className="pdf-preview-container bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-6 border-2 border-primary/20">
              
              {/* Professional Summary Section */}
              {resumeData.professionalSummary.length > 0 && resumeData.professionalSummary.some(s => s.text) && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Professional Summary</h2>
                    <Button onClick={addCustomSummary} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div
                    className="space-y-3"
                    onDrop={handleSummaryDrop}
                    onDragOver={handleSummaryDragOver}
                  >
                    {resumeData.professionalSummary.filter(s => s.text).map((summary) => (
                      <div key={summary.id} className="resume-entry relative group">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <Textarea
                              value={summary.text}
                              onChange={(e) => updateSummary(summary.id, e.target.value)}
                              placeholder="Enter summary..."
                              className="min-h-[60px] text-sm leading-relaxed border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                            />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {summary.score && (
                              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(summary.score)}`}>
                                {getScoreIndicator(summary.score)} {summary.score}
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeSummary(summary.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Summary Drop Zone */}
              {resumeData.professionalSummary.length === 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Professional Summary</h2>
                    <Button onClick={addCustomSummary} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div
                    className="min-h-[80px] p-4 border-2 border-dashed border-border/50 rounded-lg bg-muted/20 flex items-center justify-center"
                    onDrop={handleSummaryDrop}
                    onDragOver={handleSummaryDragOver}
                  >
                    <p className="text-xs text-muted-foreground text-center">
                      Drag AI suggestions here or click + to add
                    </p>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {resumeData.education.length > 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Education</h2>
                    <Button onClick={addEducation} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="resume-entry relative group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-baseline gap-2">
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="Degree"
                                className="font-bold text-base border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <span className="text-sm">in</span>
                              <Input
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                placeholder="Field"
                                className="font-bold text-base border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="Institution"
                              className="text-sm border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Input
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                  placeholder="Start"
                                  className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <span>-</span>
                                <Input
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                  placeholder="End"
                                  className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span>GPA:</span>
                                <Input
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                  placeholder="GPA"
                                  className="w-16 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {edu.score && (
                              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(edu.score)}`}>
                                {getScoreIndicator(edu.score)} {edu.score}
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeEducation(edu.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {resumeData.experience.length > 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Work Experience</h2>
                    <Button onClick={addExperience} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="resume-entry relative group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Position"
                              className="font-bold text-base border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company"
                              className="text-sm border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Input
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                placeholder="Start"
                                className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <span>-</span>
                              <Input
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                placeholder="End"
                                className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="Description..."
                              className="mt-2 text-sm leading-relaxed border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[60px]"
                            />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {exp.score && (
                              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(exp.score)}`}>
                                {getScoreIndicator(exp.score)} {exp.score}
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeExperience(exp.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {resumeData.projects.length > 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Projects</h2>
                    <Button onClick={addProject} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="resume-entry relative group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                              placeholder="Project Name"
                              className="font-bold text-base border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Textarea
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                              placeholder="Description..."
                              className="text-sm leading-relaxed border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[50px]"
                            />
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Technologies:</span>
                                <Input
                                  value={proj.technologies}
                                  onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                  placeholder="Technologies"
                                  className="flex-1 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Link:</span>
                                <Input
                                  value={proj.link || ''}
                                  onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                  placeholder="Link"
                                  className="flex-1 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {proj.score && (
                              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(proj.score)}`}>
                                {getScoreIndicator(proj.score)} {proj.score}
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeProject(proj.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracurricular/Volunteer Experience Section */}
              {resumeData.extracurricular.length > 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Extracurricular & Volunteer</h2>
                    <Button onClick={addExtracurricular} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.extracurricular.map((extra) => (
                      <div key={extra.id} className="resume-entry relative group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={extra.role}
                              onChange={(e) => updateExtracurricular(extra.id, 'role', e.target.value)}
                              placeholder="Role"
                              className="font-bold text-base border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <Input
                              value={extra.organization}
                              onChange={(e) => updateExtracurricular(extra.id, 'organization', e.target.value)}
                              placeholder="Organization"
                              className="text-sm border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Input
                                value={extra.startDate}
                                onChange={(e) => updateExtracurricular(extra.id, 'startDate', e.target.value)}
                                placeholder="Start"
                                className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <span>-</span>
                              <Input
                                value={extra.endDate}
                                onChange={(e) => updateExtracurricular(extra.id, 'endDate', e.target.value)}
                                placeholder="End"
                                className="w-20 text-xs border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                            <Textarea
                              value={extra.description}
                              onChange={(e) => updateExtracurricular(extra.id, 'description', e.target.value)}
                              placeholder="Description..."
                              className="mt-2 text-sm leading-relaxed border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[60px]"
                            />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {extra.score && (
                              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(extra.score)}`}>
                                {getScoreIndicator(extra.score)} {extra.score}
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeExtracurricular(extra.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {resumeData.skills.length > 0 && resumeData.skills.some(s => s.name) && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Skills</h2>
                    <Button onClick={addCustomSkill} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div
                    className="resume-entry"
                    onDrop={handleSkillDrop}
                    onDragOver={handleSkillDragOver}
                  >
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.filter(s => s.name).map((skill) => (
                        <div
                          key={skill.id}
                          className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-full text-sm"
                        >
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, e.target.value)}
                            placeholder="Skill"
                            className="w-auto min-w-[60px] text-sm border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          {skill.score && (
                            <Badge variant="outline" className={`text-xs px-1.5 py-0 ${getScoreBadgeClass(skill.score)} opacity-0 group-hover:opacity-100 transition-opacity`}>
                              {getScoreIndicator(skill.score)} {skill.score}
                            </Badge>
                          )}
                          <Button
                            onClick={() => removeSkill(skill.id)}
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Skills Drop Zone */}
              {resumeData.skills.length === 0 && (
                <div className="resume-section space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Skills</h2>
                    <Button onClick={addCustomSkill} size="sm" variant="ghost" className="h-7 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div
                    className="min-h-[60px] p-4 border-2 border-dashed border-border/50 rounded-lg bg-muted/20 flex items-center justify-center"
                    onDrop={handleSkillDrop}
                    onDragOver={handleSkillDragOver}
                  >
                    <p className="text-xs text-muted-foreground text-center">
                      Drag AI suggestions here or click + to add
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state message */}
              {resumeData.professionalSummary.length === 0 &&
                resumeData.education.length === 0 &&
                resumeData.experience.length === 0 &&
                resumeData.projects.length === 0 &&
                resumeData.extracurricular.length === 0 &&
                resumeData.skills.filter(s => s.name).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Start adding content to see your resume preview</p>
                    <p className="text-xs mt-2">Drag AI suggestions or use the + buttons</p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
