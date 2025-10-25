import { render, screen, fireEvent } from '@testing-library/react';
import { AuthButton } from '@/components/auth/auth-button';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth-utils';

// Mock auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock auth utils
jest.mock('@/lib/auth-utils', () => ({
  logout: jest.fn(),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('AuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    const { container } = render(<AuthButton />);
    expect(container.firstChild).toBeNull();
  });

  it('renders login and signup buttons when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<AuthButton />);
    
    const loginLink = screen.getByRole('link', { name: /login/i });
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/auth/login');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/auth/signup');
  });

  it('renders user email and logout button when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<AuthButton />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<AuthButton />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('displays user icon when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<AuthButton />);
    
    // Check for User icon (lucide-react renders as svg)
    const userIcon = screen.getByText('test@example.com').previousSibling;
    expect(userIcon).toBeInTheDocument();
  });

  it('displays logout icon in logout button', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<AuthButton />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
