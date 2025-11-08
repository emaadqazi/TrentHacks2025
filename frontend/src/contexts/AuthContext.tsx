import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google successfully!');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signInWithGithub() {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with GitHub successfully!');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  }

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
        setCurrentUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
  };

  // Always render children, but components can check loading state
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

