import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload a file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'resumes/user123/resume.pdf')
 * @returns Download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Get download URL for a file
 * @param path - Storage path of the file
 * @returns Download URL
 */
export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * List all files in a directory
 * @param path - Storage path of the directory
 * @returns Array of file references
 */
export async function listFiles(path: string) {
  const storageRef = ref(storage, path);
  return await listAll(storageRef);
}

/**
 * Upload a resume PDF for a user
 * @param userId - User ID
 * @param file - PDF file
 * @param resumeId - Optional resume ID for versioning
 * @returns Download URL
 */
export async function uploadResume(
  userId: string,
  file: File,
  resumeId?: string
): Promise<string> {
  const timestamp = Date.now();
  const fileName = resumeId 
    ? `resumes/${userId}/${resumeId}_${timestamp}.pdf`
    : `resumes/${userId}/${timestamp}.pdf`;
  
  return await uploadFile(file, fileName);
}

