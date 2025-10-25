import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '@/components/auth/signup-form';
import { signInWithPopup } from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Mock Firebase config
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.cookie = '';
  });

  it('renders signup form with Google button', () => {
    render(<SignupForm />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('displays secure authentication message', () => {
    render(<SignupForm />);
    
    expect(screen.getByText('Secure authentication with Google')).toBeInTheDocument();
  });

  it('displays terms and privacy policy message', () => {
    render(<SignupForm />);
    
    expect(screen.getByText(/by continuing, you agree to our terms of service and privacy policy/i)).toBeInTheDocument();
  });

  it('displays login link for existing users', () => {
    render(<SignupForm />);
    
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  it('handles successful Google sign up', async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token-789'),
    };
    
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(<SignupForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock-token-789');
      expect(window.location.href).toBe('/landing');
    });
  });

  it('shows loading state during sign up', async () => {
    (signInWithPopup as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<SignupForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    expect(googleButton).toBeDisabled();
  });

  it('displays error message on sign up failure', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue(
      new Error('Sign up failed')
    );

    render(<SignupForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText('Sign up failed')).toBeInTheDocument();
    });
  });

  it('displays generic error message when error has no message', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue({});

    render(<SignupForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to sign up with Google')).toBeInTheDocument();
    });
  });

  it('stores JWT token in localStorage and cookie', async () => {
    const mockToken = 'test-signup-token-999';
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
    
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(<SignupForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe(mockToken);
      expect(document.cookie).toContain('authToken=');
    });
  });
});
