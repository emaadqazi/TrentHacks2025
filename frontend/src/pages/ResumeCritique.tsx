import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  CheckCircle2,
  XCircle,
  TrendingUp,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PDFViewer } from '@/components/resume/PDFViewer';
import { getUserProfile, getUserResumePDF } from '@/lib/userProfile';

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
  const [displayedText, setDisplayedText] = useState('');
  const [showUpload, setShowUpload] = useState(true);
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = 'UPLOAD YOUR RESUME';
  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Load stored resume and profile photo on mount
  useEffect(() => {
    if (currentUser) {
      loadStoredResume();
      getUserProfile(currentUser.uid).then(profile => {
        if (profile?.profilePhotoUrl) {
          setUserProfilePhoto(profile.profilePhotoUrl);
        }
      }).catch(console.error);
    }
  }, [currentUser]);

  const loadStoredResume = async () => {
    if (!currentUser) return;
    try {
      const resumeUrl = await getUserResumePDF(currentUser.uid);
      if (resumeUrl) {
        // Fetch the PDF file from URL
        const response = await fetch(resumeUrl);
        const blob = await response.blob();
        const profile = await getUserProfile(currentUser.uid);
        const fileName = profile?.resumeFileName || 'resume.pdf';
        const pdfFile = new File([blob], fileName, { type: 'application/pdf' });
        setFile(pdfFile);
        setShowUpload(false);
        await analyzeResume(pdfFile);
      }
    } catch (error) {
      console.error('Error loading stored resume:', error);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!showUpload) return;
    
    setDisplayedText('');
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [showUpload]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
      setError(null);
      setCritique(null);
      setShowUpload(false);
      await analyzeResume(pdfFile);
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
      setCritique(null);
      setShowUpload(false);
      analyzeResume(selectedFile);
    } else {
      setError('Please upload a valid PDF file');
      toast.error('Please upload a valid PDF file');
    }
  };

  const analyzeResume = async (pdfFile: File) => {
    setLoading(true);
    setError(null);
    setCritique(null);

    try {
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
    setShowUpload(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handled by AuthContext
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityNumberColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { text: 'text-red-400', border: 'border-red-500' };
      case 'medium':
        return { text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'low':
        return { text: 'text-green-400', border: 'border-green-500' };
      default:
        return { text: 'text-gray-400', border: 'border-gray-500' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return {
          bg: 'bg-[#1a0f08]/60',
          border: 'border-[#8B6F47]/20',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400',
          accent: 'border-l-4 border-green-500',
        };
      case 'weakness':
        return {
          bg: 'bg-[#1a0f08]/60',
          border: 'border-[#8B6F47]/20',
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          accent: 'border-l-4 border-red-500',
        };
      case 'improvement':
        return {
          bg: 'bg-[#1a0f08]/60',
          border: 'border-[#8B6F47]/20',
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          accent: 'border-l-4 border-blue-500',
        };
      default:
        return {
          bg: 'bg-[#1a0f08]/60',
          border: 'border-[#8B6F47]/20',
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          accent: 'border-l-4 border-gray-500',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f08] via-[#221410] to-[#1a0f08]">
      {/* Wood grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px'
      }} />
      
      {/* Top Navigation */}
      <nav className="border-b border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl relative z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a5f24] to-[#253f12]">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#F5F1E8]">ResuBlocks</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/dashboard" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard', { state: { skipAnimation: true } });
              }}
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/critique"
              className="text-sm font-medium text-[#F5F1E8]"
            >
              Resume Critique
            </Link>
            <Link
              to="/job-tracker"
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
            >
              Job Tracker
            </Link>
            <Link
              to="/questions"
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
            >
              Questions
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#F5F1E8]/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userProfilePhoto || currentUser?.photoURL || undefined} alt={userDisplayName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#3a5f24] to-[#253f12] text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#221410] border-[#8B6F47]/30" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[#F5F1E8]">{userDisplayName}</p>
                  <p className="text-xs leading-none text-[#C9B896]">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">Billing</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem onClick={handleLogout} className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div {...getRootProps()} className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {showUpload && !file && !critique ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                {/* Typewriter Text */}
                <h1 className="text-4xl md:text-5xl font-semibold text-[#F5F1E8] mb-12 tracking-tight text-center">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </h1>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    onClick={handleUploadClick}
                    size="lg"
                    className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white px-8 py-6 text-lg font-medium rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Choose PDF File
                  </Button>
                </div>

                {isDragActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-[#C9B896] text-sm"
                  >
                    Drop your PDF here
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* File Info & Loading */}
                {file && (
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#221410] to-[#1a0f08] rounded-xl border border-[#8B6F47]/20 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3a5f24]/20">
                        <FileText className="h-5 w-5 text-[#8B6F47]" />
                      </div>
                      <div>
                        <p className="text-[#F5F1E8] font-semibold text-sm">{file.name}</p>
                        <p className="text-xs text-[#C9B896] font-medium">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    {loading ? (
                      <div className="flex items-center gap-2 text-[#8B6F47]">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Analyzing...</span>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFile} 
                        className="text-[#C9B896] hover:text-[#F5F1E8] hover:bg-[#3a5f24]/10 font-medium"
                      >
                        Upload Another
                      </Button>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-600/30 rounded-xl shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-400 mb-2 tracking-wide">Analysis Error</p>
                        <p className="text-sm text-red-300 font-medium leading-relaxed">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results Grid */}
                {critique && (
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
                      {/* Left: Critique Results */}
                      <div className="space-y-6">
                        {/* Overall Score */}
                        <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl backdrop-blur-xl">
                          <CardContent className="p-8">
                            <div className="text-center mb-8">
                              <div className={`mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full border-2 ${getScoreColor(critique.score.overall)} border-current bg-gradient-to-br from-[#1a0f08] to-[#221410] shadow-lg`}>
                                <span className={`text-4xl font-semibold ${getScoreColor(critique.score.overall)}`}>
                                  {critique.score.overall}
                                </span>
                              </div>
                              <h3 className="text-2xl font-semibold text-[#F5F1E8] mb-2 tracking-tight">Overall Score</h3>
                              <p className="text-sm text-[#C9B896] font-medium">
                                {critique.score.overall >= 80 ? 'Excellent' : critique.score.overall >= 60 ? 'Good' : 'Needs Improvement'}
                              </p>
                            </div>

                            {/* Score Breakdown */}
                            <div className="space-y-4">
                              {[
                                { label: 'Clarity', score: critique.score.clarity },
                                { label: 'Impact', score: critique.score.impact },
                                { label: 'ATS Score', score: critique.score.atsScore },
                                { label: 'Formatting', score: critique.score.formatting },
                                { label: 'Content', score: critique.score.content },
                              ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#C9B896] tracking-wide uppercase text-xs">{item.label}</span>
                                    <span className={`text-base font-semibold ${getScoreColor(item.score)}`}>
                                      {item.score}
                                    </span>
                                  </div>
                                  <div className="h-2.5 w-full rounded-full bg-[#1a0f08] overflow-hidden shadow-inner">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.score}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className={`h-full rounded-full ${
                                        item.score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' 
                                        : item.score >= 60 
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                                        : 'bg-gradient-to-r from-red-500 to-red-400'
                                      } shadow-sm`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl backdrop-blur-xl">
                          <CardContent className="p-8">
                            <h3 className="text-xl font-semibold text-[#F5F1E8] mb-4 tracking-tight">Executive Summary</h3>
                            <p className="text-sm text-[#C9B896] leading-relaxed font-medium">{critique.summary}</p>
                          </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <Card className="border border-[#8B6F47]/20 bg-gradient-to-br from-[#221410] to-[#1a0f08] shadow-xl backdrop-blur-xl">
                          <CardContent className="p-8">
                            <h3 className="text-xl font-semibold text-[#F5F1E8] mb-6 tracking-tight">Recommendations</h3>
                            <div className="space-y-4">
                              {critique.suggestions
                                .sort((a, b) => {
                                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                                })
                                .map((suggestion, index) => {
                                  const categoryColors = getCategoryColor(suggestion.category);
                                  const priorityNumber = index + 1;
                                  const priorityColors = getPriorityNumberColor(suggestion.priority);
                                  return (
                                    <motion.div
                                      key={suggestion.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className={`p-5 rounded-xl ${categoryColors.accent} ${categoryColors.bg} border-t border-r border-b ${categoryColors.border} hover:shadow-lg hover:bg-[#1a0f08]/80 transition-all duration-200`}
                                    >
                                      <div className="flex items-start gap-4">
                                        {/* Priority Number */}
                                        <div className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#221410] border-2 ${priorityColors.border} font-semibold text-sm ${priorityColors.text}`}>
                                          {priorityNumber}
                                        </div>
                                        
                                        {/* Category Icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                          {suggestion.category === 'strength' && (
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${categoryColors.iconBg}`}>
                                              <CheckCircle2 className={`h-5 w-5 ${categoryColors.iconColor}`} />
                                            </div>
                                          )}
                                          {suggestion.category === 'weakness' && (
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${categoryColors.iconBg}`}>
                                              <XCircle className={`h-5 w-5 ${categoryColors.iconColor}`} />
                                            </div>
                                          )}
                                          {suggestion.category === 'improvement' && (
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${categoryColors.iconBg}`}>
                                              <TrendingUp className={`h-5 w-5 ${categoryColors.iconColor}`} />
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                          <h4 className="text-base font-semibold text-[#F5F1E8] mb-2">{suggestion.title}</h4>
                                          <p className="text-sm text-[#C9B896] leading-relaxed font-medium">{suggestion.description}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right: PDF Viewer */}
                      {file && (
                        <div className="h-[calc(100vh-200px)] min-h-[600px]">
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
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
