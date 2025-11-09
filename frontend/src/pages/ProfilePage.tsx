import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Blocks, LogOut, Upload, Save, User, Mail, Phone, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadResumePDF } from '@/lib/userProfile';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

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

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  selectedAvatar: string;
  resumePDFUrl?: string;
  resumeFileName?: string;
}

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    selectedAvatar: 'sprite1',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userProfile = await getUserProfile(currentUser.uid);
      if (userProfile) {
        setProfile({
          displayName: userProfile.displayName || currentUser.displayName || '',
          email: userProfile.email || currentUser.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          jobTitle: userProfile.jobTitle || '',
          selectedAvatar: userProfile.selectedAvatar || 'sprite1',
          resumePDFUrl: userProfile.resumePDFUrl,
          resumeFileName: userProfile.resumeFileName,
        });
      } else {
        // Initialize with current user data
        setProfile({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: '',
          location: '',
          jobTitle: '',
          selectedAvatar: 'sprite1',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, {
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        jobTitle: profile.jobTitle,
        selectedAvatar: profile.selectedAvatar,
      });
      
      // Update Firebase Auth display name if changed
      if (profile.displayName !== currentUser.displayName) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(currentUser, { displayName: profile.displayName });
      }
      
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!currentUser) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploadingResume(true);
    
    try {
      console.log('Uploading resume to Firebase Storage...');
      const resumeUrl = await uploadResumePDF(currentUser.uid, file);
      console.log('Resume uploaded, URL:', resumeUrl);
      
      await updateUserProfile(currentUser.uid, {
        resumePDFUrl: resumeUrl,
        resumeFileName: file.name,
      });
      
      setProfile(prev => ({
        ...prev,
        resumePDFUrl: resumeUrl,
        resumeFileName: file.name,
      }));
      
      toast.success('Resume uploaded successfully!', {
        duration: 3000,
      });
      
      // Show prompt to navigate to Resume Critique or Questions
      setTimeout(() => {
        const shouldNavigate = window.confirm('Resume uploaded! Would you like to:\n\n- Click OK to go to Resume Critique\n- Click Cancel to go to Questions');
        if (shouldNavigate) {
          navigate('/critique');
        } else {
          navigate('/questions');
        }
      }, 500);
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast.error(`Failed to upload resume: ${error?.message || 'Unknown error'}`);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleResumeUpload(file);
    }
  };

  const onResumeDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      handleResumeUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
    onDrop: onResumeDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    noClick: true,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handled by AuthContext
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f08] via-[#221410] to-[#1a0f08] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#527853]" />
      </div>
    );
  }

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
              <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-[#F5F1E8]/10 p-0 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <SpriteAvatar spriteId={profile.selectedAvatar} size={36} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#221410] border-[#8B6F47]/30" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[#F5F1E8]">{profile.displayName || userDisplayName}</p>
                  <p className="text-xs leading-none text-[#C9B896]">{profile.email || userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#8B6F47]/30" />
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-[#F5F1E8] focus:bg-[#3a5f24]/20 focus:text-[#F5F1E8]"
              >
                Profile Settings
              </DropdownMenuItem>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-[#221410]/90 border-[#8B6F47]/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#F5F1E8]">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sprite Selection */}
              <div>
                <h3 className="text-xl font-semibold text-[#F5F1E8] mb-4">Choose Your Avatar</h3>
                <div className="grid grid-cols-3 gap-6 max-w-2xl">
                  {SPRITE_OPTIONS.map((sprite) => (
                    <motion.button
                      key={sprite.id}
                      onClick={() => setProfile(prev => ({ ...prev, selectedAvatar: sprite.id }))}
                      className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                        profile.selectedAvatar === sprite.id
                          ? 'border-[#527853] bg-[#3a5f24]/30 ring-2 ring-[#527853]/50'
                          : 'border-[#8B6F47]/30 bg-[#1a0f08]/60 hover:border-[#527853]/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="mb-3 flex items-center justify-center w-full">
                        <SpriteAvatar spriteId={sprite.id} size={120} />
                      </div>
                      <div className="text-sm font-medium text-[#C9B896] text-center">{sprite.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-[#F5F1E8] mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#C9B896] mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name
                    </label>
                    <Input
                      value={profile.displayName}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#C9B896] mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#C9B896] mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#C9B896] mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location
                    </label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#C9B896] mb-2">
                      <Briefcase className="inline h-4 w-4 mr-1" />
                      Job Title
                    </label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="bg-[#1a0f08] border-[#8B6F47]/50 text-[#F5F1E8] placeholder:text-[#C9B896] focus:ring-[#527853]"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Resume PDF Upload */}
              <div>
                <h3 className="text-xl font-semibold text-[#F5F1E8] mb-4">Resume PDF</h3>
                <div {...getResumeRootProps()} className="border-2 border-dashed border-[#8B6F47]/30 rounded-lg p-6 bg-[#1a0f08]/60 cursor-pointer hover:border-[#527853] transition-colors">
                  <input {...getResumeInputProps()} onChange={handleResumeFileChange} className="hidden" disabled={uploadingResume} />
                  <div className="flex flex-col items-center gap-4">
                    <Upload className={`h-12 w-12 ${uploadingResume ? 'text-[#8B6F47]' : 'text-[#527853]'}`} />
                    <div className="text-center">
                      <p className="text-[#F5F1E8] font-medium mb-1">
                        {profile.resumeFileName ? profile.resumeFileName : isResumeDragActive ? 'Drop your PDF here' : 'Upload your resume PDF'}
                      </p>
                      <p className="text-sm text-[#C9B896]">
                        {profile.resumePDFUrl ? 'Click to replace or drag & drop' : 'Click to upload or drag and drop'}
                      </p>
                      {profile.resumePDFUrl && (
                        <p className="text-xs text-green-400 mt-2">✓ Resume saved - will be used automatically</p>
                      )}
                    </div>
                    {uploadingResume && (
                      <div className="flex items-center gap-2 text-[#C9B896]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading to Firebase...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-[#8B6F47]/30">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="border-[#8B6F47]/50 text-[#F5F1E8] hover:bg-[#3a5f24]/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] hover:from-[#4a7534] hover:to-[#355222] text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

