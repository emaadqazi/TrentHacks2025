import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, AlertCircle, Lightbulb, Target, Download, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResumeData } from './AnalyzerForm';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResultsDisplayProps {
  results: string;
  resumeData: ResumeData;
  jobLevel: string;
  jobDescription: string;
}

interface ParsedResults {
  resume_analysis?: {
    summary?: string;
    score?: number;
    strengths?: string[];
    improvements?: string[];
  };
  job_description_analysis?: {
    key_requirements?: string[];
    missing_skills?: string[];
  };
  suggestions?: string[];
  education?: any[];
  work_experience?: any[];
  extracurricular?: any[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400 border-green-500/50 bg-green-500/10';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
  return 'text-red-600 dark:text-red-400 border-red-500/50 bg-red-500/10';
}

function getScoreIndicator(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🟡';
  return '🔴';
}

export default function ResultsDisplay({ results, resumeData, jobLevel, jobDescription }: ResultsDisplayProps) {
  const [isExporting, setIsExporting] = useState(false);
  let parsedResults: ParsedResults = {};
  let parseError = false;
  let parseErrorMessage = '';

  // Ensure results is a string
  if (!results || typeof results !== 'string') {
    parseError = true;
    parseErrorMessage = 'No results data available';
  } else {
    try {
      parsedResults = JSON.parse(results);
    } catch (error) {
      parseError = true;
      parseErrorMessage = 'Failed to parse results JSON';
      console.error('Failed to parse results:', error);
    }
  }

  // Check if resume data is empty
  const hasResumeData = 
    resumeData.education.length > 0 ||
    resumeData.experience.length > 0 ||
    resumeData.extracurricular.length > 0 ||
    resumeData.projects.length > 0 ||
    resumeData.skills.filter(s => s.name).length > 0 ||
    resumeData.professionalSummary.filter(s => s.text).length > 0;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create a comprehensive HTML document for PDF export
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume Analysis Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(to bottom right, #f5f1ed, #ffffff);
            }
            h1 { color: #6b4423; border-bottom: 3px solid #8b5a3c; padding-bottom: 10px; }
            h2 { color: #8b5a3c; margin-top: 30px; border-left: 4px solid #6b4423; padding-left: 10px; }
            h3 { color: #6b4423; margin-top: 20px; }
            .score-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 18px;
            }
            .score-high { background-color: #dcfce7; color: #166534; border: 2px solid #22c55e; }
            .score-medium { background-color: #fef9c3; color: #854d0e; border: 2px solid #eab308; }
            .score-low { background-color: #fee2e2; color: #991b1b; border: 2px solid #ef4444; }
            .section { margin: 20px 0; padding: 15px; background: #faf8f5; border-radius: 8px; border: 1px solid #e5ddd5; }
            .item { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #8b5a3c; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0; border-radius: 4px; }
            ul { list-style: none; padding: 0; }
            li { margin: 8px 0; padding-left: 25px; position: relative; }
            li:before { content: "•"; position: absolute; left: 10px; color: #8b5a3c; font-weight: bold; }
            .strength:before { content: "✓"; color: #22c55e; }
            .improvement:before { content: "!"; color: #eab308; }
            .suggestion { background: #f5f1ed; padding: 12px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #8b5a3c; }
            .resume-section { margin: 15px 0; }
            .resume-entry { margin: 10px 0; padding: 12px; background: white; border: 1px solid #e5ddd5; border-radius: 6px; }
            .meta { color: #6b7280; font-size: 14px; }
            .skill-chip { display: inline-block; margin: 4px; padding: 6px 12px; background: #f5f1ed; border: 1px solid #8b5a3c; border-radius: 16px; font-size: 14px; }
            .empty-state { text-align: center; padding: 30px; color: #9ca3af; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>☕ Resume Analysis Report</h1>
          
          <div class="section">
            <h2>Job Application Details</h2>
            <p><strong>Job Level:</strong> ${jobLevel}</p>
            <p><strong>Job Description:</strong></p>
            <p style="white-space: pre-wrap;">${jobDescription}</p>
          </div>

          ${!hasResumeData ? `
          <div class="warning">
            <strong>⚠️ Note:</strong> No resume sections were extracted from the PDF. This could be due to:
            <ul style="margin-top: 8px;">
              <li>The PDF format not being recognized</li>
              <li>Missing or unclear section headers</li>
              <li>The resume being in an image format</li>
            </ul>
            <p style="margin-top: 8px;">Please manually add your resume information using the editor above.</p>
          </div>
          ` : ''}

          ${parsedResults.resume_analysis ? `
          <div class="section">
            <h2>Resume Analysis ${getScoreIndicator(parsedResults.resume_analysis.score || 0)}</h2>
            ${parsedResults.resume_analysis.score !== undefined ? `
              <p>
                <span class="score-badge ${
                  parsedResults.resume_analysis.score >= 80 ? 'score-high' :
                  parsedResults.resume_analysis.score >= 60 ? 'score-medium' : 'score-low'
                }">
                  Score: ${parsedResults.resume_analysis.score}/100
                </span>
              </p>
            ` : ''}
            ${parsedResults.resume_analysis.summary ? `
              <p><strong>Summary:</strong> ${parsedResults.resume_analysis.summary}</p>
            ` : ''}
            
            ${parsedResults.resume_analysis.strengths && parsedResults.resume_analysis.strengths.length > 0 ? `
              <h3>Strengths</h3>
              <ul>
                ${parsedResults.resume_analysis.strengths.map(s => `<li class="strength">${s}</li>`).join('')}
              </ul>
            ` : ''}
            
            ${parsedResults.resume_analysis.improvements && parsedResults.resume_analysis.improvements.length > 0 ? `
              <h3>Areas for Improvement</h3>
              <ul>
                ${parsedResults.resume_analysis.improvements.map(i => `<li class="improvement">${i}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
          ` : ''}

          ${parsedResults.suggestions && parsedResults.suggestions.length > 0 ? `
          <div class="section">
            <h2>💡 Personalized Suggestions</h2>
            ${parsedResults.suggestions.map((s, i) => `
              <div class="suggestion">
                <strong>${i + 1}.</strong> ${s}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <h2>📋 Your Resume Content</h2>
            
            ${resumeData.professionalSummary.length > 0 && resumeData.professionalSummary.some(s => s.text) ? `
            <div class="resume-section">
              <h3>Professional Summary</h3>
              ${resumeData.professionalSummary.filter(s => s.text).map(summary => `
                <div class="resume-entry">
                  <p>${summary.text}</p>
                  ${summary.score ? `<span class="meta">Score: ${getScoreIndicator(summary.score)} ${summary.score}/100</span>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${resumeData.education.length > 0 ? `
            <div class="resume-section">
              <h3>Education</h3>
              ${resumeData.education.map(edu => `
                <div class="resume-entry">
                  <strong>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</strong><br>
                  ${edu.institution}<br>
                  <span class="meta">${edu.startDate} - ${edu.endDate}</span>
                  ${edu.gpa ? `<br><span class="meta">GPA: ${edu.gpa}</span>` : ''}
                  ${edu.score ? `<br><span class="meta">Score: ${getScoreIndicator(edu.score)} ${edu.score}/100</span>` : ''}
                </div>
              `).join('')}
            </div>
            ` : '<div class="empty-state"><p>No education information available</p></div>'}

            ${resumeData.experience.length > 0 ? `
            <div class="resume-section">
              <h3>Work Experience</h3>
              ${resumeData.experience.map(exp => `
                <div class="resume-entry">
                  <strong>${exp.position}</strong><br>
                  ${exp.company}<br>
                  <span class="meta">${exp.startDate} - ${exp.endDate}</span><br>
                  <p style="margin-top: 8px;">${exp.description}</p>
                  ${exp.score ? `<span class="meta">Score: ${getScoreIndicator(exp.score)} ${exp.score}/100</span>` : ''}
                </div>
              `).join('')}
            </div>
            ` : '<div class="empty-state"><p>No work experience information available</p></div>'}

            ${resumeData.projects.length > 0 ? `
            <div class="resume-section">
              <h3>Projects</h3>
              ${resumeData.projects.map(proj => `
                <div class="resume-entry">
                  <strong>${proj.name}</strong><br>
                  <p>${proj.description}</p>
                  <span class="meta">Technologies: ${proj.technologies}</span>
                  ${proj.link ? `<br><span class="meta">Link: ${proj.link}</span>` : ''}
                  ${proj.score ? `<br><span class="meta">Score: ${getScoreIndicator(proj.score)} ${proj.score}/100</span>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${resumeData.extracurricular.length > 0 ? `
            <div class="resume-section">
              <h3>Extracurricular & Volunteer Experience</h3>
              ${resumeData.extracurricular.map(extra => `
                <div class="resume-entry">
                  <strong>${extra.role}</strong><br>
                  ${extra.organization}<br>
                  <span class="meta">${extra.startDate} - ${extra.endDate}</span><br>
                  <p style="margin-top: 8px;">${extra.description}</p>
                  ${extra.score ? `<span class="meta">Score: ${getScoreIndicator(extra.score)} ${extra.score}/100</span>` : ''}
                </div>
              `).join('')}
            </div>
            ` : '<div class="empty-state"><p>No extracurricular/volunteer experience information available</p></div>'}

            ${resumeData.skills.length > 0 && resumeData.skills.some(s => s.name) ? `
            <div class="resume-section">
              <h3>Skills</h3>
              <div class="resume-entry">
                ${resumeData.skills.filter(s => s.name).map(skill => `
                  <span class="skill-chip">
                    ${skill.name}
                    ${skill.score ? ` ${getScoreIndicator(skill.score)} ${skill.score}` : ''}
                  </span>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5ddd5; text-align: center; color: #6b7280;">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Built with ☕ using <a href="https://caffeine.ai" style="color: #8b5a3c;">caffeine.ai</a></p>
          </div>
        </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-analysis-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Resume analysis exported! Open the HTML file in a browser and print to PDF.');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Your Tailored Insights
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Detailed analysis of your resume against the job requirements
            </CardDescription>
          </div>
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            size="lg"
            className="shadow-lg"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Export to PDF
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning if no resume data was extracted */}
        {!hasResumeData && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Resume Sections Extracted</AlertTitle>
            <AlertDescription className="mt-2">
              We couldn't extract education, work experience, or extracurricular sections from your PDF. 
              This could be due to the PDF format or structure. You can manually add this information 
              using the resume editor above.
            </AlertDescription>
          </Alert>
        )}

        {parseError ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Parsing Error</AlertTitle>
              <AlertDescription className="mt-2">
                {parseErrorMessage}. The backend response may be in an unexpected format.
              </AlertDescription>
            </Alert>
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Raw Response</h3>
              <ScrollArea className="h-[400px] w-full rounded-md border border-border/50 bg-background">
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-words">
                  {results || 'No results available'}
                </pre>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resume Analysis */}
            {parsedResults.resume_analysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Resume Analysis
                  </h3>
                  {parsedResults.resume_analysis.score !== undefined && (
                    <Badge
                      variant="outline"
                      className={`text-base px-3 py-1 font-bold ${getScoreColor(parsedResults.resume_analysis.score)}`}
                    >
                      {getScoreIndicator(parsedResults.resume_analysis.score)} Score: {parsedResults.resume_analysis.score}/100
                    </Badge>
                  )}
                </div>

                {parsedResults.resume_analysis.summary && (
                  <p className="text-muted-foreground leading-relaxed">
                    {parsedResults.resume_analysis.summary}
                  </p>
                )}

                {parsedResults.resume_analysis.strengths &&
                  parsedResults.resume_analysis.strengths.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground/90">Strengths</h4>
                      <ul className="space-y-2">
                        {parsedResults.resume_analysis.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {parsedResults.resume_analysis.improvements &&
                  parsedResults.resume_analysis.improvements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground/90">
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {parsedResults.resume_analysis.improvements.map((improvement, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Job Description Analysis */}
            {parsedResults.job_description_analysis && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Job Requirements Analysis
                </h3>

                {parsedResults.job_description_analysis.key_requirements &&
                  parsedResults.job_description_analysis.key_requirements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground/90">
                        Key Requirements
                      </h4>
                      <ul className="space-y-2">
                        {parsedResults.job_description_analysis.key_requirements.map(
                          (requirement, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{requirement}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {parsedResults.job_description_analysis.missing_skills &&
                  parsedResults.job_description_analysis.missing_skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground/90">
                        Skills to Develop
                      </h4>
                      <ul className="space-y-2">
                        {parsedResults.job_description_analysis.missing_skills.map(
                          (skill, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                              <span>{skill}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Suggestions */}
            {parsedResults.suggestions && parsedResults.suggestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Personalized Suggestions
                </h3>
                <ul className="space-y-3">
                  {parsedResults.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-accent/30 border border-border/30"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground/90 leading-relaxed">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw JSON for debugging */}
            <details className="pt-4 border-t border-border/50">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                View Raw JSON Response
              </summary>
              <ScrollArea className="mt-3 h-[300px] w-full rounded-md border border-border/50 bg-muted/30">
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(parsedResults, null, 2)}
                </pre>
              </ScrollArea>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
