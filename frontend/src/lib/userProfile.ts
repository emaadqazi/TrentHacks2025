import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface UserProfileData {
  displayName?: string;
  email?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  selectedAvatar?: string;
  profilePhotoUrl?: string;
  resumePDFUrl?: string;
  resumeFileName?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const profileRef = doc(db, 'userProfiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return profileSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

/**
 * Update or create user profile in Firestore
 */
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfileData>
): Promise<void> {
  try {
    const profileRef = doc(db, 'userProfiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    const dataToUpdate = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };
    
    if (profileSnap.exists()) {
      // Update existing profile
      await updateDoc(profileRef, dataToUpdate);
    } else {
      // Create new profile
      await setDoc(profileRef, {
        ...dataToUpdate,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Upload resume PDF to Firebase Storage
 */
export async function uploadResumePDF(userId: string, file: File): Promise<string> {
  try {
    console.log('Starting resume upload for user:', userId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Create a reference to the file location in Storage
    // Use a consistent filename to replace old resumes
    const timestamp = Date.now();
    const fileName = `resume_${timestamp}.pdf`;
    const resumeRef = ref(storage, `resumes/${userId}/${fileName}`);
    
    console.log('Uploading to path:', `resumes/${userId}/${fileName}`);
    
    // Upload the file
    const uploadResult = await uploadBytes(resumeRef, file);
    console.log('Upload successful:', uploadResult);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(resumeRef);
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading resume PDF:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error(`Failed to upload resume: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get resume PDF URL from user profile
 */
export async function getUserResumePDF(userId: string): Promise<string | null> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.resumePDFUrl || null;
  } catch (error) {
    console.error('Error getting user resume PDF:', error);
    return null;
  }
}

/**
 * Upload profile photo to Firebase Storage
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  try {
    // Create a reference to the file location in Storage
    const photoRef = ref(storage, `profilePhotos/${userId}/${file.name}`);
    
    // Upload the file
    await uploadBytes(photoRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(photoRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
}

