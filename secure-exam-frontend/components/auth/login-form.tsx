'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get JWT token from Firebase
      const token = await userCredential.user.getIdToken();
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      // Set cookie for middleware
      document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      // Redirect to landing page after successful login
      window.location.href = '/landing';
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to sign in';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get JWT token from Firebase
      const token = await userCredential.user.getIdToken();
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      // Set cookie for middleware
      document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      
      // Redirect to landing page after successful login
      window.location.href = '/landing';
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get JWT token from Firebase
      const token = await userCredential.user.getIdToken();
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      // Set cookie for middleware
      document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      
      // Redirect to landing page after successful login
      window.location.href = '/landing';
    } catch (err: any) {
      console.error('GitHub Sign In Error:', err);
      
      // Provide helpful error messages
      let errorMessage = err.message || 'Failed to login with GitHub';
      
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please sign in using the method you originally used (Google or Email/Password).';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please add it to Firebase Console → Authentication → Settings → Authorized domains';
      } else if (err.message?.includes('redirect_uri')) {
        errorMessage = 'GitHub OAuth configuration error. Please check QUICK_FIX_GITHUB_AUTH.md for setup instructions.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Sign in</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
        {/* Email Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or sign in with social platforms</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          title="Sign in with Google"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>
        <button
          onClick={handleGithubSignIn}
          disabled={isLoading}
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          title="Sign in with GitHub"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>
      </div>

      {/* Mobile Sign Up Link */}
      <div className="md:hidden mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
