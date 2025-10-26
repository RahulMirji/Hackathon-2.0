import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export async function logout() {
  try {
    // Clear JWT token from localStorage
    localStorage.removeItem('authToken');
    // Clear cookie
    document.cookie = 'authToken=; path=/; max-age=0';
    // Sign out from Firebase
    await signOut(auth);
    window.location.href = '/landing';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
