'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginSchema, type LoginFormData } from '@/lib/auth-schema';
import Link from 'next/link';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // Get JWT token from Firebase
      const token = await userCredential.user.getIdToken();
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      // Set cookie for middleware
      document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      // Redirect to landing page after successful login
      window.location.href = '/landing';
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight pb-4">Welcome Back!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Login to your account to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-base font-medium leading-normal pb-2">Email Address</p>
            <input
              {...register('email')}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2] h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              placeholder="Enter your email"
              type="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </label>
        </div>

        <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-base font-medium leading-normal pb-2">Password</p>
            <input
              {...register('password')}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2] h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              placeholder="Enter your password"
              type="password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </label>
        </div>

        <div className="flex items-center justify-between max-w-[480px] mt-4 px-4">
          <Link className="text-sm text-[#4A90E2] hover:underline" href="/auth/forgot-password">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="max-w-[480px] mt-4 px-4">
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}

        <div className="flex px-4 py-6 max-w-[480px]">
          <button
            type="submit"
            disabled={isLoading}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#4A90E2] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#4A90E2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">{isLoading ? 'Logging in...' : 'Login'}</span>
          </button>
        </div>

        <div className="text-center max-w-[480px] mt-4">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <Link className="text-[#4A90E2] font-semibold hover:underline" href="/auth/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
