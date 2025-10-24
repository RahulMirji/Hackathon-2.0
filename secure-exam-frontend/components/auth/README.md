# Authentication Components

Modern authentication system with Firebase integration.

## Features

- Email/Password authentication with Firebase
- JWT token management (stored in localStorage and cookies)
- Mobile number collection during signup
- Form validation with Zod
- Modern, aesthetic UI matching the reference design
- Responsive layout with image panel
- Login/Logout buttons in navbar
- Protected routes with middleware

## Routes

- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- After successful authentication, users are redirected to `/landing`
- JWT tokens are stored in both localStorage and cookies for 7 days
- Middleware automatically protects routes and redirects unauthenticated users to login

## Usage

### Login
Navigate to `/auth/login` to access the login page. After successful login, users are redirected to the landing page.

### Sign Up
Navigate to `/auth/signup` to create a new account. After successful signup, users are redirected to the landing page.

## Image Setup

Place an image named `auth-image.jpg` in the `public` folder for the side panel image. You can use any professional image of someone working on a laptop.

## Auth Context

The `AuthProvider` is already set up in the root layout (`app/layout.tsx`). You can access authentication state anywhere in your app using the `useAuth` hook:

```tsx
'use client';
import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{user ? `Hello ${user.email}` : 'Not logged in'}</div>;
}
```

## Protected Routes

Use the `ProtectedRoute` component to protect pages:

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content - only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## Auth Button

Add the `AuthButton` component to your navbar to show login/logout buttons:

```tsx
import { AuthButton } from '@/components/auth/auth-button';

export function Navbar() {
  return (
    <nav>
      {/* Your navbar content */}
      <AuthButton />
    </nav>
  );
}
```

## Logout

Use the `logout` utility function to sign out users. It will:
- Clear JWT token from localStorage
- Clear authentication cookie
- Sign out from Firebase
- Redirect to login page

```tsx
import { logout } from '@/lib/auth-utils';

<button onClick={logout}>Logout</button>
```

## JWT Token Management

The authentication system uses Firebase JWT tokens:
- Tokens are generated on login/signup
- Stored in both localStorage and cookies (7-day expiration)
- Cookies are used by middleware for server-side route protection
- localStorage is used for client-side auth state

Helper functions:
```tsx
import { getAuthToken, isAuthenticated } from '@/lib/auth-utils';

const token = getAuthToken(); // Get current JWT token
const loggedIn = isAuthenticated(); // Check if user is authenticated
```
