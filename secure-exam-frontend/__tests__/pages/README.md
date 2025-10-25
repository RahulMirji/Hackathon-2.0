# Page Tests

This directory contains comprehensive tests for all exam pages and functionality.

## Test Coverage

### Core Exam Flow Pages
- `compatibility-check.test.tsx` - System compatibility verification
- `id-verification.test.tsx` - Identity verification with camera and file upload
- `consent.test.tsx` - Terms and consent page
- `sections.test.tsx` - Exam section selection
- `mcq.test.tsx` - Multiple choice question pages (MCQ1, MCQ2, MCQ3)
- `coding.test.tsx` - Coding exam interface
- `submission.test.tsx` - Exam submission and review

## Test Features

### Functionality Tested
- ✅ Page rendering and UI components
- ✅ Navigation and routing
- ✅ Form interactions and validation
- ✅ Camera and media device access
- ✅ File upload functionality
- ✅ Timer functionality
- ✅ Question navigation
- ✅ Answer selection and submission
- ✅ Error handling and edge cases
- ✅ Responsive design elements

### Mock Implementations
- Next.js router navigation
- Media device APIs (camera, microphone)
- File upload handling
- Canvas and video element interactions
- Timer and countdown functionality
- Storage and battery APIs

## Running Tests

```bash
# Run all page tests
npm test __tests__/pages

# Run specific page test
npm test __tests__/pages/compatibility-check.test.tsx

# Run with coverage
npm test -- --coverage __tests__/pages
```

## Test Structure

Each test file follows a consistent structure:
1. Mock setup for external dependencies
2. Component rendering tests
3. User interaction tests
4. Navigation and routing tests
5. Error handling tests
6. Edge case scenarios

## Key Testing Patterns

### Router Mocking
```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
```

### Media Device Mocking
```typescript
const mockGetUserMedia = jest.fn()
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: { getUserMedia: mockGetUserMedia },
})
```

### Component Interaction Testing
```typescript
const button = screen.getByText('Submit')
fireEvent.click(button)
expect(mockPush).toHaveBeenCalledWith('/next-page')
```

## Coverage Goals

- ✅ 90%+ line coverage
- ✅ All critical user paths tested
- ✅ Error scenarios covered
- ✅ Accessibility compliance verified
- ✅ Cross-browser compatibility ensured