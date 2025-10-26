# 🎯 SecureExam - AI-Powered Exam Proctoring Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-FFA500?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Next-generation AI-powered exam proctoring with real-time monitoring, identity verification, and intelligent integrity scoring.**

[🌐 Live Demo](#deployment) • [📚 Documentation](#documentation) • [🚀 Getting Started](#getting-started) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

### 🎓 Core Exam Platform
- **AI-Powered Proctoring**: Real-time face and attention tracking with advanced computer vision
- **Smart Integrity Engine**: Detects suspicious movements and behaviors automatically
- **ID Verification**: Dual-layer face and government ID authentication
- **Secure Sandbox**: Prevents tab switching and external interference
- **Real-time Analytics**: Live performance and integrity reports during exam
- **Offline Recovery**: Seamless reconnection with automatic data synchronization

### 🔐 Security & Authentication
- **Multi-Provider OAuth**: Google and GitHub single sign-on
- **Email/Password Authentication**: Secure account creation and login
- **Firebase Authentication**: Enterprise-grade auth infrastructure
- **JWT Token Management**: Secure session handling
- **Encrypted Data Storage**: Firestore with security rules

### 📊 User Experience
- **Beautiful Landing Page**: Modern, responsive design with animations
- **Intuitive Dashboard**: Easy exam navigation and management
- **Real-time Notifications**: Instant alerts and updates
- **Mobile-Responsive**: Optimized for all devices
- **Accessibility**: WCAG compliant interface

### 🧪 Quality Assurance
- **Comprehensive Test Suite**: Jest + React Testing Library
- **Component Tests**: Full coverage of landing and exam components
- **Hook Tests**: Custom hook validation
- **Integration Tests**: End-to-end scenarios
- **Code Coverage**: Maintain high test coverage standards

---

## 🏗️ Project Architecture

```
secure-exam-frontend/
├── app/                          # Next.js 15 App Router
│   ├── api/                     # API endpoints
│   │   ├── exam/               # Exam management endpoints
│   │   ├── execute-code/       # Code execution endpoints
│   │   ├── generate-questions/ # Question generation
│   │   └── test-ai/            # AI testing endpoints
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── exam/                    # Exam interface
│   │   ├── coding/             # Coding challenge sections
│   │   ├── mcq1/               # Multiple choice questions
│   │   ├── id-verification/    # Identity verification
│   │   ├── consent/            # Consent forms
│   │   └── compatibility-check/ # System compatibility
│   ├── landing/                 # Landing page
│   ├── about/                   # About page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
│
├── components/                  # Reusable React components
│   ├── auth/                   # Authentication components
│   │   ├── login-form.tsx      # Login form
│   │   └── signup-form.tsx     # Signup form
│   ├── exam/                   # Exam-related components
│   │   ├── exam-header.tsx     # Exam header
│   │   ├── code-editor.tsx     # Code editor
│   │   ├── question-panel.tsx  # Question display
│   │   └── timer.tsx           # Exam timer
│   ├── landing/                # Landing page components
│   │   ├── navbar.tsx          # Navigation bar
│   │   ├── hero-section.tsx    # Hero section
│   │   ├── features-grid.tsx   # Features showcase
│   │   ├── about-section.tsx   # About section
│   │   ├── footer.tsx          # Footer
│   │   └── workflow-section.tsx # Workflow display
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx          # Button component
│   │   ├── input.tsx           # Input field
│   │   ├── dialog.tsx          # Dialog/Modal
│   │   └── ...                 # 30+ UI components
│   └── theme-provider.tsx      # Theme configuration
│
├── lib/                         # Utility functions and services
│   ├── firebase.ts             # Firebase initialization
│   ├── auth-context.tsx        # Auth context provider
│   ├── auth-schema.ts          # Auth validation schemas
│   ├── auth-utils.ts           # Auth helper functions
│   ├── exam-session.ts         # Exam session management
│   ├── firestore-service.ts    # Firestore operations
│   ├── question-service.ts     # Question management
│   ├── browser-code-executor.ts # Code execution engine
│   ├── utils.ts                # General utilities
│   └── types/                  # TypeScript type definitions
│
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts             # Auth hook
│   ├── use-exam-session.ts     # Exam session hook
│   ├── use-in-view.ts          # Intersection observer hook
│   ├── use-parallax.ts         # Parallax effect hook
│   ├── use-mobile.ts           # Mobile detection hook
│   ├── use-toast.ts            # Toast notifications hook
│   └── use-websocket.ts        # WebSocket connection hook
│
├── __tests__/                   # Test suite
│   ├── components/             # Component tests
│   ├── pages/                  # Page tests
│   ├── hooks/                  # Hook tests
│   ├── lib/                    # Library tests
│   └── integration/            # Integration tests
│
├── public/                      # Static assets
├── styles/                      # Global styles
├── middleware.ts               # Next.js middleware
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **Firebase Project** ([Create one](https://console.firebase.google.com/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RahulMirji/Hackathon-2.0.git
   cd secure-exam-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # AI API Configuration
   AI_API_URL=your_ai_api_url
   AI_API_KEY=your_ai_api_key
   AI_MODEL=your_ai_model_name
   AI_PROVIDER=your_provider
   ```

4. **Set up Firebase Authentication**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, GitHub)
   - Add your domain to Authorized domains in Authentication Settings
   - Copy your Firebase config and update `.env.local`

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📦 Installation & Setup

### Using pnpm (Recommended)
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
```

### Using npm
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

---

## 🧪 Testing

The project includes a comprehensive test suite using **Jest** and **React Testing Library**.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run specific test suites
pnpm run test:pages      # Page tests
pnpm run test:components # Component tests
pnpm run test:hooks      # Hook tests
pnpm run test:lib        # Library tests

# Run all tests with detailed report
pnpm run test:all

# Fast test run (CI environment)
pnpm run test:fast
```

### Test Structure

```
__tests__/
├── components/
│   ├── auth/                      # Auth component tests
│   ├── exam/                      # Exam component tests
│   ├── landing/                   # Landing page component tests
│   └── ui/                        # UI component tests
├── pages/
│   ├── coding.test.tsx           # Coding page tests
│   ├── mcq.test.tsx              # MCQ page tests
│   ├── id-verification.test.tsx  # ID verification tests
│   └── ...
├── hooks/
│   ├── use-in-view.test.ts      # Intersection observer tests
│   └── use-parallax.test.ts     # Parallax effect tests
├── lib/
│   └── auth-utils.test.ts       # Auth utility tests
└── integration/
    └── about-page.test.tsx      # Integration tests
```

### Test Coverage

Run coverage report:
```bash
pnpm run test:coverage
```

Coverage reports are available in the `coverage/` directory.

---

## 🌐 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add all variables from your `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     AI_API_URL
     AI_API_KEY
     AI_MODEL
     AI_PROVIDER
     ```

4. **Configure Firebase OAuth**
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain to "Authorized domains":
     ```
     your-project.vercel.app
     ```
   - Update Google and GitHub OAuth app settings with Vercel domain

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is now live! 🎉

### Troubleshooting Deployment

**OAuth not working?**
- See [VERCEL_OAUTH_FIX.md](./VERCEL_OAUTH_FIX.md) for detailed steps

**Environment variables not found?**
- See [Environment Configuration Guide](#environment-variables)

**Build errors?**
- Check [next.config.mjs](./next.config.mjs) configuration
- Review console logs in Vercel dashboard

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable these services:
   - **Authentication**: Email/Password, Google, GitHub
   - **Firestore Database**: For storing exam data
   - **Cloud Storage**: For file uploads
   - **Cloud Functions**: For backend operations

3. Copy your Firebase config to `.env.local`

### OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID for Web
3. Add authorized redirect URIs:
   ```
   http://localhost:3000
   https://your-vercel-domain.vercel.app
   ```

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   ```
   https://your-vercel-domain.vercel.app/api/auth/callback/github
   ```

---

## 📚 Documentation

### Key Files to Review

- **[VERCEL_OAUTH_FIX.md](./VERCEL_OAUTH_FIX.md)** - OAuth setup for Vercel
- **[API_EXECUTION_GUIDE.md](./API_EXECUTION_GUIDE.md)** - API execution guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing documentation
- **[DATABASE_FEATURE_SUMMARY.md](./DATABASE_FEATURE_SUMMARY.md)** - Database features

### API Endpoints

All API endpoints are located in `app/api/`:

```
POST   /api/exam/start           - Start exam session
POST   /api/exam/submit          - Submit exam answers
GET    /api/exam/status          - Get exam status
POST   /api/execute-code         - Execute code
POST   /api/generate-questions   - Generate questions
```

### Environment Variables

```env
# Firebase (Public)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# AI Services (Server-side)
AI_API_URL
AI_API_KEY
AI_MODEL
AI_PROVIDER
```

---

## 🎨 UI Components

The project includes 30+ reusable UI components from [shadcn/ui](https://ui.shadcn.com/):

- **Form Components**: Input, Button, Select, Checkbox, Toggle
- **Layout**: Dialog, Sheet, Popover, Dropdown Menu
- **Feedback**: Toast, Alert, Skeleton, Progress
- **Data Display**: Table, Tabs, Accordion, Carousel
- **Navigation**: Navbar, Footer, Breadcrumb

See `components/ui/` for all available components.

---

## 🎯 Key Features Implementation

### Real-Time Monitoring
- Webcam integration for face detection
- Attention tracking using AI
- Screen recording and detection
- Tab switching prevention

### Identity Verification
- Government ID recognition
- Face matching algorithms
- Dual-layer authentication
- Secure data storage

### Exam Execution
- Code editor with syntax highlighting
- Multiple question types (MCQ, Coding)
- Real-time code execution
- Instant feedback

### Analytics
- Performance metrics
- Integrity scoring
- Behavior tracking
- Report generation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Hackathon-2.0.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Code Standards

- **TypeScript**: Use strict type checking
- **Testing**: Write tests for all features
- **Styling**: Use Tailwind CSS classes
- **Components**: Keep components small and reusable
- **Documentation**: Add JSDoc comments

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

### Getting Help

- 📖 Check the [documentation files](.)
- 🐛 Open an [issue](https://github.com/RahulMirji/Hackathon-2.0/issues)
- 💬 Join our [discussions](https://github.com/RahulMirji/Hackathon-2.0/discussions)

### Common Issues

**Q: OAuth not working on Vercel?**
A: See [VERCEL_OAUTH_FIX.md](./VERCEL_OAUTH_FIX.md)

**Q: Environment variables not found?**
A: Ensure they're set in `.env.local` for local dev and in Vercel project settings for production.

**Q: Tests failing?**
A: Run `pnpm install` to ensure all dependencies are installed, then try `pnpm run test:fast`

---

## 📊 Project Statistics

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 30+ custom components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

---

## 👥 Team

**Project Lead**: [Rahul Mirji](https://github.com/RahulMirji)

---

## 🔗 Quick Links

- [GitHub Repository](https://github.com/RahulMirji/Hackathon-2.0)
- [Live Demo](https://hackathon-2-0.vercel.app)
- [Firebase Console](https://console.firebase.google.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

---

<div align="center">

**⭐ If you found this helpful, please give us a star on [GitHub](https://github.com/RahulMirji/Hackathon-2.0)!**

Made with ❤️ for secure online examinations

</div>
