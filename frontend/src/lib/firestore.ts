import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Resume } from '@/types/resume';

export interface UserResume {
  id: string;
  userId: string;
  title: string;
  targetRole?: string;
  goals?: string;
  template?: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  // Resume block data
  resumeData?: Resume;
}

/**
 * Create a new resume in Firestore
 */
export async function createResume(
  userId: string,
  resumeData: {
    title: string;
    targetRole?: string;
    goals?: string;
    template?: string;
  }
): Promise<string> {
  const resumeId = `${userId}_${Date.now()}`;
  const resumeRef = doc(db, 'resumes', resumeId);

  // Filter out undefined values - Firestore doesn't accept undefined
  const filteredData = Object.fromEntries(
    Object.entries(resumeData).filter(([_, value]) => value !== undefined)
  );

  await setDoc(resumeRef, {
    id: resumeId,
    userId,
    ...filteredData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return resumeId;
}

/**
 * Get a resume by ID
 */
export async function getResume(resumeId: string): Promise<UserResume | null> {
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeSnap = await getDoc(resumeRef);

  if (resumeSnap.exists()) {
    return resumeSnap.data() as UserResume;
  }
  return null;
}

/**
 * Update a resume
 */
export async function updateResume(
  resumeId: string,
  data: Partial<UserResume>
): Promise<void> {
  const resumeRef = doc(db, 'resumes', resumeId);
  await updateDoc(resumeRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update resume block data (the actual resume content)
 */
export async function updateResumeData(
  resumeId: string,
  resumeData: Resume
): Promise<void> {
  const resumeRef = doc(db, 'resumes', resumeId);
  await updateDoc(resumeRef, {
    resumeData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a resume
 */
export async function deleteResume(resumeId: string): Promise<void> {
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
}

/**
 * Get all resumes for a user
 */
export async function getUserResumes(userId: string): Promise<UserResume[]> {
  const resumesRef = collection(db, 'resumes');
  // Query by userId only (no orderBy to avoid composite index requirement)
  const q = query(
    resumesRef,
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  const resumes: UserResume[] = [];

  querySnapshot.forEach((doc) => {
    resumes.push(doc.data() as UserResume);
  });

  // Sort by updatedAt in memory (most recent first)
  resumes.sort((a, b) => {
    // Helper to convert Timestamp or string to timestamp number
    const getTimestamp = (date: Timestamp | string | Date | undefined): number => {
      if (!date) return 0;
      if (date instanceof Date) return date.getTime();
      if (typeof date === 'string') return new Date(date).getTime();
      if (date instanceof Timestamp) return date.toMillis();
      // Handle Firestore Timestamp object with toDate method
      if (typeof date === 'object' && 'toDate' in date) {
        return (date as any).toDate().getTime();
      }
      return 0;
    };

    const aTime = getTimestamp(a.updatedAt);
    const bTime = getTimestamp(b.updatedAt);
    return bTime - aTime; // Descending order (most recent first)
  });

  return resumes;
}

