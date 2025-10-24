# Testing Guide for AI Exam Browser

## Overview

Comprehensive test suite for all UI components and custom hooks in the landing page.

## Installation

Install the testing dependencies:

```bash
pnpm install
```

This will install:
- `jest` - Testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for tests

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Test Files Created

### Components Tests
- `__tests__/components/landing/hero-section.test.tsx` - Hero section with CTA buttons
- `__tests__/components/landing/features-grid.test.tsx` - 6 feature cards
- `__tests__/components/landing/workflow-section.test.tsx` - 6 workflow steps
- `__tests__/components/landing/monitoring-preview.test.tsx` - Dashboard mockup
- `__tests__/components/landing/hackathon-section.test.tsx` - Animated text section
- `__tests__/components/landing/contact-section.test.tsx` - Contact form
- `__tests__/components/landing/footer.test.tsx` - Footer navigation
- `__tests__/components/ui/tubelight-navbar.test.tsx` - Navigation bar

### Hooks Tests
- `__tests__/hooks/use-in-view.test.ts` - Intersection Observer hook
- `__tests__/hooks/use-parallax.test.ts` - Parallax scroll effect hook

## Test Coverage

Each test file includes:

✅ **Rendering Tests** - Verifies components render correctly
✅ **Content Tests** - Checks all text content is present
✅ **Interaction Tests** - Tests user interactions (clicks, form inputs)
✅ **Navigation Tests** - Validates routing and links
✅ **State Tests** - Verifies component state changes
✅ **Accessibility Tests** - Ensures proper HTML structure

## Configuration Files

- `jest.config.js` - Jest configuration with Next.js support
- `jest.setup.js` - Global test setup and mocks
- `package.json` - Updated with test scripts and dependencies

## Mocked Dependencies

The following are automatically mocked in tests:

- `next/navigation` - Router and navigation hooks
- `@/hooks/use-in-view` - Intersection Observer hook
- `@/hooks/use-parallax` - Parallax scroll hook
- `IntersectionObserver` - Browser API
- `window.matchMedia` - Media query API

## Example Test Run

After installation, you should see output like:

```
PASS  __tests__/components/landing/hero-section.test.tsx
PASS  __tests__/components/landing/features-grid.test.tsx
PASS  __tests__/components/landing/workflow-section.test.tsx
...

Test Suites: 10 passed, 10 total
Tests:       XX passed, XX total
```

## Next Steps

1. Install dependencies: `pnpm install`
2. Run tests: `pnpm test`
3. Check coverage: `pnpm test:coverage`
4. Add more tests as needed for new components

## Troubleshooting

If tests fail after installation:

1. Clear Jest cache: `pnpm jest --clearCache`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Check Node version: Ensure you're using Node 18+
