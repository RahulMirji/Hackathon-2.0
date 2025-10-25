import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
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

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.cookie = '';
  });

  it('renders login form with Google button', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText('Login to your account to continue.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('displays secure authentication message', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Secure authentication with Google')).toBeInTheDocument();
  });

  it('displays terms and privacy policy message', () => {
    render(<LoginForm />);
    
    expect(screen.getByText(/by continuing, you agree to our terms of service and privacy policy/i)).toBeInTheDocument();
  });

  it('handles successful Google sign in', async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token-123'),
    };
    
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(<LoginForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock-token-123');
      expect(window.location.href).toBe('/landing');
    });
  });

  it('shows loading state during sign in', async () => {
    (signInWithPopup as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(googleButton).toBeDisabled();
  });

  it('displays error message on sign in failure', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue(
      new Error('Authentication failed')
    );

    render(<LoginForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });
  });

  it('displays generic error message when error has no message', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue({});

    render(<LoginForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to login with Google')).toBeInTheDocument();
    });
  });

  it('stores JWT token in localStorage and cookie', async () => {
    const mockToken = 'test-jwt-token-456';
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
    
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    render(<LoginForm />);
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe(mockToken);
      expect(document.cookie).toContain('authToken=');
    });
  });
});
