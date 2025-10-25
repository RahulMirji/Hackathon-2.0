# Identity Verification Test Suite

This folder contains comprehensive test cases for the identity verification branch features.

## Test Files

### 1. `id-verification.test.tsx`
Tests for the ID Verification page (`/exam/id-verification`)

**Coverage:**
- Page rendering and layout
- Camera functionality (start, capture, stop)
- File upload for government ID
- Button states and navigation
- Error handling (permission denied, no camera)
- Continue button color changes based on state

**Key Test Cases:**
- ✅ Renders page with correct title and step indicator
- ✅ Displays face verification and ID upload cards
- ✅ Camera starts when button is clicked
- ✅ Captures photo and displays preview
- ✅ Handles file upload successfully
- ✅ Continue button turns green when both actions completed
- ✅ Back button navigates to previous page
- ✅ Handles camera errors gracefully

### 2. `consent.test.tsx`
Tests for the Consent page (`/exam/consent`)

**Coverage:**
- Page rendering with all three cards
- Monitoring features display
- Exam policies display
- Privacy information display
- Consent checkbox functionality
- Button states and color changes
- Navigation

**Key Test Cases:**
- ✅ Renders page with correct title and step indicator
- ✅ Displays all three consent cards
- ✅ Shows monitoring features (Face Detection, Screen Monitoring, Audio Recording)
- ✅ Shows exam policies (Prohibited Actions, Required Environment, Consequences)
- ✅ Shows privacy information (Data Protection, Limited Access, Your Rights)
- ✅ Consent checkbox enables Continue button
- ✅ Continue button turns green when consent is checked
- ✅ Navigation works correctly

### 3. `results.test.tsx`
Tests for the Results page (`/exam/results`)

**Coverage:**
- Page rendering with thank you message
- Score display and breakdown
- Question results with color coding
- Integrity checks display
- Download and navigation functionality
- Issues badge display

**Key Test Cases:**
- ✅ Renders thank you message
- ✅ Displays score (87%) and passing score (70%)
- ✅ Shows PASSED status
- ✅ Displays question breakdown with scores
- ✅ Shows integrity checks with status
- ✅ Download Report button works
- ✅ Return Home button navigates correctly
- ✅ Color coding matches HackerRank theme

## Running Tests

### Run all identity verification tests:
```bash
npm test -- __tests__/identity-verification
```

### Run specific test file:
```bash
npm test -- __tests__/identity-verification/id-verification.test.tsx
npm test -- __tests__/identity-verification/consent.test.tsx
npm test -- __tests__/identity-verification/results.test.tsx
```

### Run with coverage:
```bash
npm test -- --coverage __tests__/identity-verification
```

### Run in watch mode:
```bash
npm test -- --watch __tests__/identity-verification
```

## Test Configuration

These tests use:
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

## Mocked Dependencies

- `next/navigation` - Router functionality
- `navigator.mediaDevices.getUserMedia` - Camera access

## Color Theme Testing

All tests verify the HackerRank color scheme:
- Primary green: `#1ba94c`
- Light green background: `#d4f4dd`
- Primary blue: `#4355f9`
- Warning orange: `#ffa500`
- Warning background: `#fff4e5`

## Future Improvements

- Add integration tests for full user flow
- Add accessibility tests (a11y)
- Add visual regression tests
- Add performance tests
- Add E2E tests with Playwright/Cypress
