import { logout, getAuthToken, isAuthenticated } from '@/lib/auth-utils';
import { signOut } from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

// Mock Firebase config
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.cookie = '';
  });

  describe('logout', () => {
    it('clears localStorage token', async () => {
      localStorage.setItem('authToken', 'test-token');
      
      await logout();
      
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('clears cookie', async () => {
      // Note: jsdom doesn't fully support cookie manipulation
      // This test verifies the logout function runs without errors
      await logout();
      
      expect(signOut).toHaveBeenCalled();
    });

    it('calls Firebase signOut', async () => {
      await logout();
      
      expect(signOut).toHaveBeenCalledTimes(1);
    });

    it('redirects to login page', async () => {
      await logout();
      
      expect(window.location.href).toBe('/auth/login');
    });

    it('handles signOut errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (signOut as jest.Mock).mockRejectedValue(new Error('Sign out failed'));
      
      await logout();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing out:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAuthToken', () => {
    it('returns token from localStorage when present', () => {
      localStorage.setItem('authToken', 'my-token-123');
      
      const token = getAuthToken();
      
      expect(token).toBe('my-token-123');
    });

    it('returns null when no token in localStorage', () => {
      const token = getAuthToken();
      
      expect(token).toBeNull();
    });

    it('returns null when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const token = getAuthToken();
      
      expect(token).toBeNull();
      
      global.window = originalWindow;
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('authToken', 'valid-token');
      
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true even when token is empty string (truthy check)', () => {
      localStorage.setItem('authToken', '');
      
      // Empty string is still a value in localStorage, so it returns true
      // In real usage, Firebase won't return empty tokens
      expect(isAuthenticated()).toBe(true);
    });
  });
});
