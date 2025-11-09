import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Blocks,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  BarChart3,
  ArrowLeft,
  Star,
  AlertTriangle,
  LogOut,
  Eye,
  Download,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PDFViewer } from '@/components/resume/PDFViewer';

interface CritiqueScore {
  overall: number;
  clarity: number;
  impact: number;
  atsScore: number;
  formatting: number;
  content: number;
}

interface CritiqueSuggestion {
  id: string;
  category: 'strength' | 'weakness' | 'improvement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface CritiqueResult {
  score: CritiqueScore;
  suggestions: CritiqueSuggestion[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export default function ResumeCritiquePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [critique, setCritique] = useState<CritiqueResult | null>(null);

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      setError(null);
      setCritique(null);
      await analyzeResume(pdfFile);
    } else {
      setError('Please upload a valid PDF file');
      toast.error('Please upload a valid PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const analyzeResume = async (pdfFile: File) => {
    setLoading(true);
    setError(null);
    setCritique(null);

    try {
      // Send resume to OpenAI via backend API
      const formData = new FormData();
      formData.append('file', pdfFile);

      const critiqueResponse = await fetch('/api/resume/critique', {
        method: 'POST',
        body: formData,
      });

      if (!critiqueResponse.ok) {
        const errorData = await critiqueResponse.json().catch(() => ({ 
          error: 'Failed to get critique',
          details: `Server returned status ${critiqueResponse.status}`
        }));
        throw new Error(errorData.error || errorData.details || `Server error: ${critiqueResponse.status}`);
      }

      const critiqueData = await critiqueResponse.json();
      
      // Validate the response structure
      if (!critiqueData.score || !critiqueData.suggestions) {
        throw new Error('Invalid response format from server');
      }

      setCritique(critiqueData);
      toast.success('Resume analyzed successfully with AI!');
    } catch (err: any) {
      console.error('Analysis error:', err);
      const errorMessage = err?.message || 'Failed to analyze resume. Please ensure the backend server is running and OpenAI API key is configured.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setCritique(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f08] via-[#221410] to-[#1a0f08]">
      {/* Top Navigation */}
      <nav className="border-b border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
                <Blocks className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#F5F1E8]">ResuBlocks</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors">
                My Resumes
              </Link>
              <Link
                to="/critique"
                className="text-sm font-medium text-[#F5F1E8]"
              >
                Resume Critique
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Templates
              </Link>
              <Link
                to="#"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#F5F1E8]/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback className="bg-[#3a5f24] text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3a5f24]/20">
              <Sparkles className="h-6 w-6 text-[#8B6F47]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#F5F1E8]">Resume Critique</h1>
              <p className="text-[#C9B896]">Upload your resume for AI-powered analysis and scoring</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Left Side - Upload & Critique */}
          <div className="space-y-6 min-w-0">
            {/* Upload Section */}
            <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[#F5F1E8]">Upload Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card
                        {...getRootProps()}
                        className={`cursor-pointer border-4 border-dashed transition-all ${
                          isDragActive
                            ? 'border-[#3a5f24] bg-[#3a5f24]/10'
                            : 'border-[#8B6F47]/30 hover:border-[#8B6F47]/50 bg-[#1a0f08]/50'
                        }`}
                      >
                        <CardContent className="p-12">
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3a5f24]/20">
                              <Upload className="h-8 w-8 text-[#8B6F47]" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-[#F5F1E8]">
                              {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                            </h3>
                            <p className="mb-4 text-sm text-[#C9B896]">
                              Drag and drop your PDF resume, or click to browse
                            </p>
                            <Button variant="outline" size="sm" className="border-[#8B6F47]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/20">
                              <FileText className="mr-2 h-4 w-4" />
                              Select PDF File
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="border-2 border-[#3a5f24] bg-[#3a5f24]/10">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3a5f24]/20">
                                <FileText className="h-6 w-6 text-[#8B6F47]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#F5F1E8]">{file.name}</p>
                                <p className="text-sm text-[#C9B896]">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {loading ? (
                                <div className="flex items-center gap-2 text-[#8B6F47]">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span className="text-sm font-medium">Analyzing...</span>
                                </div>
                              ) : (
                                <Button variant="ghost" size="sm" onClick={clearFile} className="text-[#C9B896] hover:text-[#F5F1E8]">
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <Card className="border-2 border-red-600/50 bg-red-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-400 mb-1">Analysis Error</p>
                              <p className="text-sm text-red-300">{error}</p>
                              {error.includes('OpenAI') && (
                                <p className="text-xs text-red-400/80 mt-2">
                                  Make sure the backend server is running and has OPENAI_API_KEY in backend/.env.local
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Critique Results */}
            {critique && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-[#F5F1E8]">Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#C9B896]">{critique.summary}</p>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-[#F5F1E8]">Suggestions & Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {critique.suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-[#8B6F47]/20 bg-[#1a0f08]/50"
                      >
                        <div className="mt-1">
                          {suggestion.category === 'strength' && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {suggestion.category === 'weakness' && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {suggestion.category === 'improvement' && (
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-[#F5F1E8]">{suggestion.title}</h4>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#C9B896]">{suggestion.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-2 border-green-600/30 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {critique.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-green-300">
                            <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-600/30 bg-red-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {critique.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-red-300">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - PDF Viewer & Score */}
          <div className="space-y-6 min-w-0">
            {/* PDF Viewer */}
            {file && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-[calc(100vh-250px)] min-h-[600px]"
              >
                <PDFViewer 
                  file={file} 
                  onDownload={() => {
                    const url = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="h-full"
                />
              </motion.div>
            )}

            {/* Score Sidebar */}
            {critique && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#F5F1E8]">
                      <BarChart3 className="h-5 w-5" />
                      Resume Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div
                      className={`mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 ${getScoreBgColor(
                        critique.score.overall
                      )}`}
                    >
                      <span className={`text-4xl font-bold ${getScoreColor(critique.score.overall)}`}>
                        {critique.score.overall}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#F5F1E8]">Overall Score</h3>
                    <p className="text-sm text-[#C9B896]">
                      {critique.score.overall >= 80
                        ? 'Excellent'
                        : critique.score.overall >= 60
                        ? 'Good'
                        : 'Needs Improvement'}
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F5F1E8]">Clarity</span>
                        <span className={`text-sm font-bold ${getScoreColor(critique.score.clarity)}`}>
                          {critique.score.clarity}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a0f08]">
                        <div
                          className={`h-2 rounded-full ${
                            critique.score.clarity >= 80
                              ? 'bg-green-500'
                              : critique.score.clarity >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${critique.score.clarity}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F5F1E8]">Impact</span>
                        <span className={`text-sm font-bold ${getScoreColor(critique.score.impact)}`}>
                          {critique.score.impact}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a0f08]">
                        <div
                          className={`h-2 rounded-full ${
                            critique.score.impact >= 80
                              ? 'bg-green-500'
                              : critique.score.impact >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${critique.score.impact}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F5F1E8]">ATS Score</span>
                        <span className={`text-sm font-bold ${getScoreColor(critique.score.atsScore)}`}>
                          {critique.score.atsScore}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a0f08]">
                        <div
                          className={`h-2 rounded-full ${
                            critique.score.atsScore >= 80
                              ? 'bg-green-500'
                              : critique.score.atsScore >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${critique.score.atsScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F5F1E8]">Formatting</span>
                        <span className={`text-sm font-bold ${getScoreColor(critique.score.formatting)}`}>
                          {critique.score.formatting}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a0f08]">
                        <div
                          className={`h-2 rounded-full ${
                            critique.score.formatting >= 80
                              ? 'bg-green-500'
                              : critique.score.formatting >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${critique.score.formatting}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#F5F1E8]">Content</span>
                        <span className={`text-sm font-bold ${getScoreColor(critique.score.content)}`}>
                          {critique.score.content}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a0f08]">
                        <div
                          className={`h-2 rounded-full ${
                            critique.score.content >= 80
                              ? 'bg-green-500'
                              : critique.score.content >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${critique.score.content}%` }}
                        />
                      </div>
                    </div>
                  </div>

                    {/* Action Button */}
                    <Button className="w-full bg-[#3a5f24] hover:bg-[#3a5f24]/80 text-white" onClick={() => navigate('/editor')}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Improve Resume
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Download Section - Shown when PDF is uploaded but no critique yet */}
            {file && !critique && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-[#F5F1E8]">Download My Resume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-[#C9B896]">
                      Get a detailed view of your experience, skills, and qualifications in PDF format.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full bg-[#3a5f24] hover:bg-[#3a5f24]/80 text-white"
                        onClick={() => {
                          const url = URL.createObjectURL(file);
                          window.open(url, '_blank');
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        VIEW RESUME
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#8B6F47]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/20"
                        onClick={() => {
                          const url = URL.createObjectURL(file);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = file.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        DOWNLOAD PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

