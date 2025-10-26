'use client';

import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth-utils';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    // Get display name, fallback to email name part if not available
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    
    return (
      <div className="flex items-center gap-3 bg-background/80 backdrop-blur-lg border border-border rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <User size={16} className="text-primary" />
          <span className="text-sm font-medium hidden sm:inline max-w-[150px] truncate">
            {displayName}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-lg border border-border rounded-full px-2 py-2 shadow-lg">
      <Link
        href="/auth/login"
        className="px-4 py-1.5 rounded-full text-sm font-medium hover:bg-muted transition-colors"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-1.5 rounded-full bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white text-sm font-medium transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
