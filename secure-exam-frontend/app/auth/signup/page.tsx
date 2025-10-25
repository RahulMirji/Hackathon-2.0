"use client"

import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main container */}
      <div className="relative flex w-full max-w-5xl h-[600px] mx-4">
        {/* Left side - Sign up form with angled edge */}
        <div className="relative w-full md:w-[55%] bg-white rounded-l-3xl md:rounded-l-3xl md:rounded-r-none rounded-3xl shadow-2xl p-8 md:p-12 flex items-center justify-center overflow-hidden">
          {/* Angled edge effect */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-white transform skew-x-[-8deg] translate-x-16"></div>
          
          <SignupForm />
        </div>

        {/* Right side - Sign in prompt */}
        <div className="hidden md:flex w-[45%] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-r-3xl shadow-2xl items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">One of us?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Welcome back! Sign in to continue your journey with us.
            </p>
            <Link href="/auth/login">
              <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
