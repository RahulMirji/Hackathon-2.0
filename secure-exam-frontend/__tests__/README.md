# Test Suite for AI Exam Browser

This directory contains comprehensive test cases for all UI components and custom hooks.

## Test Structure

```
__tests__/
├── components/
│   ├── landing/
│   │   ├── contact-section.test.tsx
│   │   ├── features-grid.test.tsx
│   │   ├── footer.test.tsx
│   │   ├── hackathon-section.test.tsx
│   │   ├── hero-section.test.tsx
│   │   ├── monitoring-preview.test.tsx
│   │   └── workflow-section.test.tsx
│   └── ui/
│       └── tubelight-navbar.test.tsx
└── hooks/
    ├── use-in-view.test.ts
    └── use-parallax.test.ts
```

## Running Tests

Install dependencies first:
```bash
pnpm install
```

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## Test Coverage

The test suite covers:

- **Hero Section**: Navigation, CTA buttons, mockup rendering
- **Features Grid**: All 6 feature cards with descriptions
- **Workflow Section**: All 6 workflow steps in order
- **Monitoring Preview**: Dashboard mockup and monitoring features
- **Hackathon Section**: Animated text and CTA
- **Contact Section**: Form inputs, validation, submission
- **Footer**: All navigation links and sections
- **Tubelight Navbar**: Active state, scroll detection, responsive behavior
- **Custom Hooks**: useInView and useParallax functionality

## Technologies

- Jest
- React Testing Library
- @testing-library/jest-dom
- jest-environment-jsdom
