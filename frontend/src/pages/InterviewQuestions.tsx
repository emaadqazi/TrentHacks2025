import { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  LogOut,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'company-specific';
  difficulty: 'easy' | 'medium' | 'hard';
  exampleAnswer: string;
  tips?: string[];
}

interface InterviewQuestionsResponse {
  questions: InterviewQuestion[];
  summary: string;
}

export default function InterviewQuestionsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionsData, setQuestionsData] = useState<InterviewQuestionsResponse | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } else {
      setError('Please upload a valid PDF file');
      toast.error('Please upload a valid PDF file');
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a valid PDF file');
      toast.error('Please upload a valid PDF file');
    }
  };

  const generateQuestions = async () => {
    if (!file && !jobDescription.trim()) {
      setError('Please upload a resume or provide a job description');
      toast.error('Please upload a resume or provide a job description');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Job description is required');
      toast.error('Please provide a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestionsData(null);

    try {
      let response;

      if (file) {
        // Use PDF endpoint
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobDescription', jobDescription);

        response = await fetch('/api/interview/questions/pdf', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Use text endpoint (if we had resume text, but for now we'll require PDF)
        setError('Please upload a resume PDF file');
        toast.error('Please upload a resume PDF file');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to generate questions',
          details: `Server returned status ${response.status}`
        }));
        throw new Error(errorData.error || errorData.details || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format from server');
      }

      setQuestionsData(data);
      // Expand first question by default
      if (data.questions.length > 0) {
        setExpandedQuestions(new Set([data.questions[0].id]));
      }
      toast.success('Interview questions generated successfully!');
    } catch (err: any) {
      console.error('Generation error:', err);
      const errorMessage = err?.message || 'Failed to generate interview questions. Please ensure the backend server is running and Gemini API key is configured.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const clearAll = () => {
    setFile(null);
    setJobDescription('');
    setError(null);
    setQuestionsData(null);
    setExpandedQuestions(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'behavioral':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'situational':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'company-specific':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
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
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Resume Critique
              </Link>
              <Link
                to="/interview-questions"
                className="text-sm font-medium text-[#F5F1E8]"
              >
                Interview Prep
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
              >
                Templates
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div {...getRootProps()} className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {!questionsData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-semibold text-[#F5F1E8] mb-4 tracking-tight">
                  Interview Question Generator
                </h1>
                <p className="text-lg text-[#C9B896] font-medium">
                  Upload your resume and provide a job description to get personalized interview questions
                </p>
              </div>

              {/* Resume Upload Section */}
              <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl backdrop-blur-xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-[#F5F1E8] mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Upload Resume (PDF)
                  </h2>
                  <div className="space-y-4">
                    {file ? (
                      <div className="flex items-center justify-between p-4 bg-[#1a0f08]/60 rounded-lg border border-[#8B6F47]/20">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#8B6F47]" />
                          <div>
                            <p className="text-[#F5F1E8] font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-[#C9B896]">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-[#C9B896] hover:text-[#F5F1E8]"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          onClick={handleUploadClick}
                          className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {isDragActive ? 'Drop PDF Here' : 'Choose PDF File'}
                        </Button>
                        {isDragActive && (
                          <p className="text-center text-sm text-[#C9B896]">Drop your PDF here</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Description Input */}
              <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl backdrop-blur-xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-[#F5F1E8] mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Job Description
                  </h2>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[200px] bg-[#1a0f08]/60 border-[#8B6F47]/30 text-[#F5F1E8] placeholder:text-[#C9B896] focus:border-[#527853]"
                  />
                  <p className="text-xs text-[#C9B896] mt-2">
                    Provide a detailed job description to get relevant interview questions
                  </p>
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-600/30 rounded-xl shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-400 mb-1">Error</p>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={generateQuestions}
                  disabled={loading || !file || !jobDescription.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-[#527853] to-[#3a5f24] hover:from-[#628963] hover:to-[#4a7534] text-white px-8 py-6 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-5 w-5" />
                      Generate Interview Questions
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header with Clear Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-[#F5F1E8] mb-2">
                    Interview Questions
                  </h1>
                  {questionsData.summary && (
                    <p className="text-[#C9B896] font-medium">{questionsData.summary}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={clearAll}
                  className="text-[#C9B896] hover:text-[#F5F1E8]"
                >
                  Start Over
                </Button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questionsData.questions.map((question, index) => {
                  const isExpanded = expandedQuestions.has(question.id);
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                          {/* Question Header */}
                          <div
                            className="flex items-start justify-between gap-4 cursor-pointer"
                            onClick={() => toggleQuestion(question.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold text-[#8B6F47]">
                                  Q{index + 1}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(question.category)}`}>
                                  {question.category}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-[#F5F1E8] pr-8">
                                {question.question}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 text-[#C9B896] hover:text-[#F5F1E8]"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </Button>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-6 space-y-4 pt-6 border-t border-[#8B6F47]/20">
                                  {/* Example Answer */}
                                  <div>
                                    <h4 className="text-sm font-semibold text-[#F5F1E8] mb-2 flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      Example Answer
                                    </h4>
                                    <div className="p-4 bg-[#1a0f08]/60 rounded-lg border border-[#8B6F47]/20">
                                      <p className="text-sm text-[#C9B896] leading-relaxed whitespace-pre-wrap">
                                        {question.exampleAnswer}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Tips */}
                                  {question.tips && question.tips.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-[#F5F1E8] mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" />
                                        Tips
                                      </h4>
                                      <ul className="space-y-2">
                                        {question.tips.map((tip, tipIndex) => (
                                          <li
                                            key={tipIndex}
                                            className="flex items-start gap-2 text-sm text-[#C9B896]"
                                          >
                                            <span className="text-[#8B6F47] mt-1">•</span>
                                            <span>{tip}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

