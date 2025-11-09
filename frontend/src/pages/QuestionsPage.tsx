import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Blocks, LogOut, Upload, Loader2, Send, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, getUserResumePDF } from '@/lib/userProfile';
import NewAndImproved from '/NewAndImproved.jpg';

// Sprite options - pixel art characters
const SPRITE_OPTIONS = [
  { id: 'sprite1', name: 'Sprite 1', image: '/sprite1.png' },
  { id: 'sprite2', name: 'Sprite 2', image: '/sprite2.png' },
  { id: 'sprite3', name: 'Sprite 3', image: '/sprite3.png' },
];

// Component to render sprite avatar
const SpriteAvatar = ({ spriteId, size = 64 }: { spriteId: string; size?: number }) => {
  const sprite = SPRITE_OPTIONS.find(s => s.id === spriteId) || SPRITE_OPTIONS[0];
  
  return (
    <div 
      className="rounded-lg overflow-hidden bg-[#527853]/20 flex items-center justify-center" 
      style={{ width: size, height: size }}
    >
      <img 
        src={sprite.image} 
        alt={sprite.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

interface QuestionData {
  jobTitle: string;
  location: string;
  resumeText: string;
  jobDescription: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
}

interface AnswerEvaluation {
  rating: number;
  feedback: string;
}

export default function QuestionsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState<QuestionData>({
    jobTitle: '',
    location: '',
    resumeText: '',
    jobDescription: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Answer evaluation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('sprite1');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fullPrompt = " Let's get you prepared for interviews";
  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Load stored resume on mount
  useEffect(() => {
    if (currentUser) {
      loadStoredResume();
    }
  }, [currentUser]);

  const loadStoredResume = async () => {
    if (!currentUser) return;
    try {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
      if (profile?.selectedAvatar) {
        setSelectedAvatar(profile.selectedAvatar);
      }
      
      const resumeUrl = await getUserResumePDF(currentUser.uid);
      if (resumeUrl) {
        // Fetch the PDF file from URL
        const response = await fetch(resumeUrl);
        const blob = await response.blob();
        const fileName = profile?.resumeFileName || 'resume.pdf';
        const pdfFile = new File([blob], fileName, { type: 'application/pdf' });
        setResumeFile(pdfFile);
        setQuestionData(prev => ({ ...prev, resumeText: 'Loaded from profile' }));
      }
    } catch (error) {
      console.error('Error loading stored resume:', error);
    }
  };

  // Typewriter effect for initial prompt
  useEffect(() => {
    setDisplayedPrompt(''); // Reset on mount
    
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    let charIndex = 0;
    const typeWriterEffect = () => {
      if (charIndex < fullPrompt.length) {
        setDisplayedPrompt((prev) => {
          // Prevent duplicates by checking if we're already past this character
          if (prev.length < charIndex + 1) {
            return prev + fullPrompt.charAt(charIndex);
          }
          return prev;
        });
        charIndex++;
        typewriterTimeoutRef.current = setTimeout(typeWriterEffect, 70);
      } else {
        setTimeout(() => setShowQuestions(true), 500);
      }
    };
    typeWriterEffect();
    
    // Cleanup function
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to newest question
  useEffect(() => {
    if (showQuestions && currentQuestionIndex >= 0) {
      const questionElement = document.getElementById(`question-${currentQuestionIndex}`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentQuestionIndex, showQuestions]);

  const jobTitles = [
    'Software Engineer',
    'Software Developer',
    'Senior Software Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Product Manager',
    'Product Owner',
    'Cloud Architect',
    'DevOps Engineer',
    'Data Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'QA Engineer',
    'QA Automation Engineer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'UI/UX Designer',
    'Technical Lead',
    'Engineering Manager',
    'Solutions Architect',
    'Security Engineer',
    'Site Reliability Engineer',
    'Other',
  ];

  const questions = [
    {
      id: 'jobTitle',
      label: "What job are you trying to get?",
      type: 'select',
      placeholder: 'Select a job title...',
    },
    {
      id: 'location',
      label: "What is your desired location?",
      type: 'text',
      placeholder: 'e.g., San Francisco, CA or Remote...',
    },
    {
      id: 'resume',
      label: "Upload your resume",
      type: 'file',
      placeholder: 'Upload PDF resume',
    },
    {
      id: 'jobDescription',
      label: "Paste the job description",
      type: 'textarea',
      placeholder: 'Copy and paste the full job description here...',
    },
  ];

  const handleInputChange = (id: string, value: string) => {
    setQuestionData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      // Text will be extracted on the backend when generating questions
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions answered, analyze
      analyzeAndGenerateQuestions();
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.id === 'resume') {
      // File upload handled separately
      return;
    }
    
    const value = questionData[currentQ.id as keyof QuestionData];
    if (value && value.trim() !== '') {
      moveToNextQuestion();
    }
  };

  const analyzeAndGenerateQuestions = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobTitle', questionData.jobTitle);
      formData.append('location', questionData.location);
      formData.append('resumeText', questionData.resumeText);
      formData.append('jobDescription', questionData.jobDescription);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }

      const data = await response.json();
      setInterviewQuestions(data.questions || []);
      setShowResults(true);
      
      // Scroll to results after a delay
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
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

  const openAnswerModal = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setUserAnswer('');
    setEvaluation(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    setUserAnswer('');
    setEvaluation(null);
  };

  const submitAnswerForEvaluation = async () => {
    if (!selectedQuestion || !userAnswer.trim()) {
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/questions/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewQuestion: selectedQuestion.question,
          userAnswer: userAnswer,
          jobTitle: questionData.jobTitle,
          jobDescription: questionData.jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const data: AnswerEvaluation = await response.json();
      setEvaluation(data);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f08] via-[#221410] to-[#1a0f08] relative">
      {/* Wood grain texture overlay - fixed to cover full height */}
      <div
        className="fixed inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' seed='1' /%3E%3CfeColorMatrix values='0 0 0 0 0.35, 0 0 0 0 0.24, 0 0 0 0 0.15, 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' /%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
          minHeight: '100vh',
        }}
      />

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
              className="text-sm font-medium text-[#C9B896] hover:text-[#F5F1E8] transition-colors"
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
              className="text-sm font-medium text-[#F5F1E8]"
            >
              Questions
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-[#F5F1E8]/10 p-0 overflow-hidden flex items-center justify-center">
                <SpriteAvatar spriteId={selectedAvatar} size={36} />
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
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem onClick={handleLogout} className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Initial Prompt with Typewriter Effect */}
        {!showQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="h-20 w-20 border-2 border-[#527853]">
                <AvatarImage src={NewAndImproved} alt="AI Avatar" />
                <AvatarFallback className="bg-[#527853] text-white text-2xl">AI</AvatarFallback>
              </Avatar>
              <h1 className="text-4xl md:text-6xl font-semibold text-[#F5F1E8]">
                {displayedPrompt}
                {displayedPrompt.length < fullPrompt.length && <span className="animate-pulse">|</span>}
              </h1>
            </div>
          </motion.div>
        )}

        {/* Sequential Questions */}
        {showQuestions && !showResults && (
          <motion.div
            ref={questionsContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {questions.map((question, index) => {
              // Only show questions up to and including the current one
              if (index > currentQuestionIndex) return null;
              
              const isCurrentQuestion = index === currentQuestionIndex;
              
              const canProceedForThisQuestion = question.id === 'resume' 
                ? resumeFile !== null 
                : questionData[question.id as keyof QuestionData]?.trim() !== '';

              return (
                <motion.div
                  key={question.id}
                  id={`question-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-8 flex items-start gap-4"
                >
                  {/* Avatar that follows down */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="flex-shrink-0"
                  >
                    <Avatar className="h-12 w-12 border-2 border-[#527853]">
                      <AvatarImage src={NewAndImproved} alt="AI Avatar" />
                      <AvatarFallback className="bg-[#527853] text-white">AI</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <Card className={`flex-1 bg-[#221410]/90 border-[#8B6F47]/30 shadow-xl ${!isCurrentQuestion ? 'opacity-75' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-[#F5F1E8]">
                        {question.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {question.type === 'select' && (
                        <Select
                          value={questionData[question.id as keyof QuestionData] as string}
                          onValueChange={(value) => {
                            handleInputChange(question.id, value);
                            // Auto-advance to next question when a selection is made
                            if (isCurrentQuestion && value) {
                              setTimeout(() => {
                                moveToNextQuestion();
                              }, 300);
                            }
                          }}
                          disabled={!isCurrentQuestion}
                        >
                          <SelectTrigger className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853] disabled:opacity-50">
                            <SelectValue placeholder={question.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#221410] border-[#8B6F47]/50 text-[#F5F1E8]">
                            {jobTitles.map((title) => (
                              <SelectItem
                                key={title}
                                value={title}
                                className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8] cursor-pointer"
                              >
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {question.type === 'text' && (
                        <Input
                          type="text"
                          placeholder={question.placeholder}
                          value={questionData[question.id as keyof QuestionData] as string}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && canProceedForThisQuestion && isCurrentQuestion) {
                              handleNext();
                            }
                          }}
                          className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                          disabled={!isCurrentQuestion}
                          autoFocus={isCurrentQuestion}
                        />
                      )}
                      {question.type === 'textarea' && (
                        <Textarea
                          placeholder={question.placeholder}
                          value={questionData[question.id as keyof QuestionData] as string}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          rows={8}
                          className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853] resize-none"
                          disabled={!isCurrentQuestion}
                          autoFocus={isCurrentQuestion}
                        />
                      )}
                      {question.type === 'file' && (
                        <div className="space-y-4">
                          <input
                            ref={isCurrentQuestion ? fileInputRef : null}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={!isCurrentQuestion}
                          />
                          <Button
                            onClick={() => isCurrentQuestion && fileInputRef.current?.click()}
                            disabled={!isCurrentQuestion}
                            className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white disabled:opacity-50"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            {resumeFile ? resumeFile.name : 'Choose PDF File'}
                          </Button>
                          {resumeFile && (
                            <p className="text-sm text-green-400">✓ Resume uploaded successfully</p>
                          )}
                        </div>
                      )}
                      {isCurrentQuestion && (
                        <div className="flex justify-end">
                          <Button
                            onClick={handleNext}
                            disabled={!canProceedForThisQuestion || loading}
                            className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white"
                          >
                            {isLastQuestion ? (
                              loading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Generate Questions
                                </>
                              )
                            ) : (
                              'Next'
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Interview Questions Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <Card className="bg-[#221410]/90 border-[#8B6F47]/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-[#F5F1E8] text-center">
                  Top 10 Interview Questions
                </CardTitle>
                <p className="text-sm text-[#C9B896] text-center mt-2">
                  Based on your resume and the job description
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewQuestions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-[#1a0f08]/60 border border-[#8B6F47]/20 border-l-4 border-l-[#527853] cursor-pointer hover:bg-[#1a0f08]/80 hover:border-[#527853] transition-all"
                    onClick={() => openAnswerModal(q)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#3a5f24] to-[#253f12] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-[#F5F1E8] text-lg flex-1">{q.question}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestionIndex(0);
                      setQuestionData({
                        jobTitle: '',
                        location: '',
                        resumeText: '',
                        jobDescription: '',
                      });
                      setResumeFile(null);
                      setInterviewQuestions([]);
                    }}
                    variant="outline"
                    className="border-[#8B6F47]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/20"
                  >
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Answer Evaluation Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#221410] border border-[#8B6F47]/30 rounded-xl shadow-2xl"
          >
            {/* Close Button - More Visible */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-[#1a0f08]/90 hover:bg-[#1a0f08] border border-[#8B6F47]/50 hover:border-[#527853] text-[#F5F1E8] hover:text-white transition-all shadow-lg hover:shadow-xl"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#F5F1E8] mb-2">Practice Your Answer</h2>
                <p className="text-lg font-semibold text-[#C9B896] mb-4">{selectedQuestion?.question}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#F5F1E8] mb-2">
                  Your Answer (Use STAR method: Situation, Task, Action, Result)
                </label>
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Describe a specific situation, the task you faced, the action you took, and the result you achieved..."
                  rows={8}
                  className="w-full bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853] resize-none"
                  disabled={isEvaluating}
                />
              </div>

              {evaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 space-y-6"
                >
                  {/* Rating Card */}
                  <Card className="bg-[#1a0f08]/80 border-[#8B6F47]/30 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-yellow-400/20">
                          <Star className="h-7 w-7 text-yellow-400 fill-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#F5F1E8]">AI Evaluation</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-lg font-semibold text-[#C9B896]">Rating:</span>
                            <span className="text-4xl font-bold text-[#527853]">{evaluation.rating}/10</span>
                          </div>
                          <div className="w-full bg-[#1a0f08] rounded-full h-4 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-[#527853] to-[#3a5f24] h-4 rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${(evaluation.rating / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Feedback Card */}
                  <Card className="bg-[#1a0f08]/80 border-[#8B6F47]/30 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#F5F1E8] flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#527853]"></div>
                        STAR Method Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-[#C9B896] leading-relaxed whitespace-pre-wrap text-base">
                          {evaluation.feedback}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="flex gap-4 justify-end">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="border-[#8B6F47]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/20"
                >
                  Close
                </Button>
                <Button
                  onClick={submitAnswerForEvaluation}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

