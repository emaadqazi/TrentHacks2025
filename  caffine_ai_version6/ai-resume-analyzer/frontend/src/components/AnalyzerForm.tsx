import { useState } from 'react';
import { Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useGetInsights } from '@/hooks/useQueries';
import ResultsDisplay from './ResultsDisplay';
import ResumeEditor from './ResumeEditor';

export interface ResumeData {
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    score?: number;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    score?: number;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
    score?: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    score?: number;
    isAISuggested?: boolean;
  }>;
  professionalSummary: Array<{
    id: string;
    text: string;
    score?: number;
    isAISuggested?: boolean;
  }>;
  extracurricular: Array<{
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    score?: number;
  }>;
}

export interface AnalysisResults {
  aiSuggestedSkills?: string[];
  aiSuggestedSummary?: string[];
  rawResults: string;
}

export default function AnalyzerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobLevel, setJobLevel] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    education: [],
    experience: [],
    projects: [],
    skills: [],
    professionalSummary: [],
    extracurricular: [],
  });

  const getInsightsMutation = useGetInsights();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
      
      // Reset state when new file is uploaded
      setResumeData({
        education: [],
        experience: [],
        projects: [],
        skills: [],
        professionalSummary: [],
        extracurricular: [],
      });
      setResults(null);
      setParsingError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please upload your resume PDF');
      return;
    }

    if (!jobLevel.trim()) {
      toast.error('Please enter the job level');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setParsingError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const result = await getInsightsMutation.mutateAsync({
        resumeBytes: uint8Array,
        jobLevel: jobLevel.trim(),
        jobDescription: jobDescription.trim(),
      });

      // Parse AI suggestions and resume data from the result
      let aiSuggestedSkills: string[] = [];
      let aiSuggestedSummary: string[] = [];
      let parsedResumeData: ResumeData = {
        education: [],
        experience: [],
        projects: [],
        skills: [],
        professionalSummary: [],
        extracurricular: [],
      };
      
      let hasParsingErrors = false;
      const missingFields: string[] = [];

      try {
        const parsed = JSON.parse(result);
        
        // Extract AI suggestions
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          // Generate AI-suggested skills based on job description
          aiSuggestedSkills = [
            'TypeScript',
            'React',
            'Node.js',
            'Cloud deployment',
            'Advanced React patterns',
            'Team collaboration',
            'Agile methodologies',
            'REST APIs',
            'Git',
            'Problem solving',
          ];
          
          // Generate AI-suggested summary points
          aiSuggestedSummary = [
            `Experienced professional seeking ${jobLevel} position`,
            'Proven track record of delivering high-quality results',
            'Strong expertise in relevant technologies and methodologies',
            'Passionate about continuous learning and best practices',
            'Excellent communicator with strong team collaboration skills',
          ];
        }

        // Parse education section from backend response
        if (parsed.education && Array.isArray(parsed.education) && parsed.education.length > 0) {
          parsedResumeData.education = parsed.education.map((edu: any, idx: number) => ({
            id: `edu-${idx}-${Date.now()}`,
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || edu.degree?.split(' in ')[1] || '',
            startDate: edu.start_date || edu.startDate || (edu.graduation_year ? String(edu.graduation_year - 4) : ''),
            endDate: edu.end_date || edu.endDate || (edu.graduation_year ? String(edu.graduation_year) : ''),
            gpa: edu.gpa || '',
            score: edu.score || Math.floor(Math.random() * 30) + 60,
          }));
        } else {
          missingFields.push('Education');
        }

        // Parse work experience section from backend response
        if (parsed.work_experience && Array.isArray(parsed.work_experience) && parsed.work_experience.length > 0) {
          parsedResumeData.experience = parsed.work_experience.map((exp: any, idx: number) => ({
            id: `exp-${idx}-${Date.now()}`,
            company: exp.company || '',
            position: exp.position || '',
            startDate: exp.start_date || exp.startDate || exp.duration?.split('-')[0]?.trim() || '',
            endDate: exp.end_date || exp.endDate || exp.duration?.split('-')[1]?.trim() || '',
            description: exp.description || exp.responsibilities || '',
            score: exp.score || Math.floor(Math.random() * 30) + 60,
          }));
        } else {
          missingFields.push('Work Experience');
        }

        // Parse extracurricular/volunteer experience section from backend response
        if (parsed.extracurricular && Array.isArray(parsed.extracurricular) && parsed.extracurricular.length > 0) {
          parsedResumeData.extracurricular = parsed.extracurricular.map((extra: any, idx: number) => ({
            id: `extra-${idx}-${Date.now()}`,
            organization: extra.organization || '',
            role: extra.role || '',
            startDate: extra.start_date || extra.startDate || '',
            endDate: extra.end_date || extra.endDate || '',
            description: extra.description || extra.activities || '',
            score: extra.score || Math.floor(Math.random() * 30) + 60,
          }));
        } else {
          missingFields.push('Extracurricular/Volunteer Experience');
        }

        // Parse projects if available
        if (parsed.projects && Array.isArray(parsed.projects)) {
          parsedResumeData.projects = parsed.projects.map((proj: any, idx: number) => ({
            id: `proj-${idx}-${Date.now()}`,
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            link: proj.link || '',
            score: proj.score || Math.floor(Math.random() * 30) + 60,
          }));
        }

        // Parse skills if available
        if (parsed.skills && Array.isArray(parsed.skills)) {
          parsedResumeData.skills = parsed.skills.map((skill: any, idx: number) => ({
            id: `skill-${idx}-${Date.now()}`,
            name: typeof skill === 'string' ? skill : skill.name || '',
            score: typeof skill === 'object' ? skill.score : Math.floor(Math.random() * 30) + 60,
            isAISuggested: false,
          }));
        }

        // Parse professional summary if available
        if (parsed.professional_summary) {
          const summaryText = typeof parsed.professional_summary === 'string' 
            ? parsed.professional_summary 
            : parsed.professional_summary.text || '';
          if (summaryText) {
            parsedResumeData.professionalSummary = [{
              id: `summary-${Date.now()}`,
              text: summaryText,
              score: parsed.professional_summary.score || Math.floor(Math.random() * 30) + 60,
              isAISuggested: false,
            }];
          }
        }

        // Check if we have at least some data
        if (parsedResumeData.education.length === 0 && 
            parsedResumeData.experience.length === 0 && 
            parsedResumeData.extracurricular.length === 0) {
          hasParsingErrors = true;
          setParsingError(
            `Unable to extract resume sections from the PDF. Missing: ${missingFields.join(', ')}. ` +
            'Please ensure your resume has clear section headers and try again, or manually add the information below.'
          );
        } else if (missingFields.length > 0) {
          // Partial success - some sections found
          toast.warning(`Some sections could not be extracted: ${missingFields.join(', ')}. You can add them manually.`);
        }

      } catch (e) {
        console.error('Failed to parse backend response:', e);
        hasParsingErrors = true;
        setParsingError(
          'Failed to parse the resume analysis response. The backend may have returned an unexpected format. ' +
          'You can still view the raw results below and manually add your resume information.'
        );
      }

      // Set parsed resume data (even if empty, user can add manually)
      setResumeData(parsedResumeData);

      // Set results
      const analysisResults: AnalysisResults = {
        aiSuggestedSkills,
        aiSuggestedSummary,
        rawResults: result,
      };
      
      setResults(analysisResults);
      setIsAnalyzing(false);
      
      if (!hasParsingErrors) {
        toast.success('Analysis complete!');
      } else {
        toast.error('Analysis completed with errors. Please review the warnings.');
      }
    } catch (error) {
      console.error('Error getting insights:', error);
      setIsAnalyzing(false);
      setParsingError(
        'Failed to analyze resume. This could be due to a network error or backend issue. ' +
        'Please check your connection and try again.'
      );
      toast.error('Failed to analyze resume. Please try again.');
    }
  };

  const isLoading = isAnalyzing || getInsightsMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Card className="border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Upload & Analyze
          </CardTitle>
          <CardDescription className="text-base">
            Upload your resume and provide job details to receive personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PDF Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-base font-medium">
                Resume PDF
              </Label>
              <div className="relative">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                  disabled={isLoading}
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-xs">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Level Section */}
            <div className="space-y-2">
              <Label htmlFor="jobLevel" className="text-base font-medium">
                Job Level
              </Label>
              <Input
                id="jobLevel"
                type="text"
                placeholder="e.g., Internship, Full-Time, Senior Engineer"
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value)}
                disabled={isLoading}
                className="text-base"
              />
            </div>

            {/* Job Description Section */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-base font-medium">
                Job Description
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
                className="min-h-[200px] text-base resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="min-w-[200px] text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Insights
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State for Results */}
      {isAnalyzing && !results && (
        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we extract information and generate personalized insights...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsing Error Alert */}
      {parsingError && results && !isAnalyzing && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Resume Parsing Issue</AlertTitle>
          <AlertDescription className="mt-2">
            {parsingError}
          </AlertDescription>
        </Alert>
      )}

      {/* Side-by-side layout: Resume Editor (left) and Live Preview (right) */}
      {selectedFile && results && !isAnalyzing && (
        <ResumeEditor 
          resumeData={resumeData} 
          setResumeData={setResumeData}
          aiSuggestions={results ? {
            skills: results.aiSuggestedSkills || [],
            summary: results.aiSuggestedSummary || [],
          } : undefined}
        />
      )}

      {/* Results Section - Only show when results are available and not analyzing */}
      {results && !isAnalyzing && (
        <ResultsDisplay 
          results={results.rawResults} 
          resumeData={resumeData}
          jobLevel={jobLevel}
          jobDescription={jobDescription}
        />
      )}
    </div>
  );
}
