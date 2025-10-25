# About Section Tests

This directory contains comprehensive tests for the About section components developed in the `about-us-v1` branch.

## Test Coverage

### 1. Component Tests

#### `about-section-redesigned.test.tsx`
Tests for the main About section component including:
- **Hero Section**: Main heading and description
- **Stats Section**: All statistics and labels (99.9% uptime, 50K+ exams, etc.)
- **Features Section**: All 6 platform features
- **Core Values**: Security First, Transparency, Innovation
- **Team Section**: Team member display with leadership hierarchy
- **CTA Section**: Navigation buttons functionality
- **Accessibility**: Keyboard navigation and ARIA labels
- **Responsive Design**: Mobile and desktop viewports

#### `three-d-carousel.test.tsx`
Tests for the 3D carousel component including:
- **Rendering**: All team members and their information
- **Navigation Controls**: Previous/Next buttons and dot indicators
- **Auto-rotation**: Automatic slide rotation with pause on hover
- **Touch Gestures**: Swipe left/right functionality
- **Accessibility**: ARIA labels and keyboard navigation
- **Edge Cases**: Empty array, single member, wrap-around
- **Custom Props**: cardHeight and rotateInterval

### 2. Integration Tests

#### `about-page.test.tsx`
End-to-end tests for the complete About page including:
- **Page Structure**: Navbar, Footer, and all sections
- **User Journey**: Navigation flows from About to Compatibility Check
- **Content Verification**: All text content and team information
- **Responsive Behavior**: Mobile, tablet, and desktop viewports
- **Accessibility**: Semantic HTML and keyboard navigation
- **Performance**: Render time benchmarks
- **Error Handling**: Graceful error recovery

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test about-section-redesigned
npm test three-d-carousel
npm test about-page
```

### Run tests for specific component
```bash
npm test -- --testPathPattern=about-section
```

## Test Structure

```
__tests__/
├── components/
│   ├── landing/
│   │   └── about-section-redesigned.test.tsx
│   └── ui/
│       └── three-d-carousel.test.tsx
├── integration/
│   └── about-page.test.tsx
└── about-section/
    └── README.md (this file)
```

## Key Features Tested

### Team Leadership Hierarchy
- ✅ Rahul Mirji designated as Team Leader
- ✅ Other members designated as Team Members
- ✅ Leader badge displays correctly
- ✅ Role descriptions include specializations

### Navigation Functionality
- ✅ "Get Started Today" button links to `/exam/compatibility-check`
- ✅ "Schedule a Demo" button navigates to `/exam/compatibility-check`
- ✅ Both buttons are keyboard accessible
- ✅ Navigation works on all viewports

### 3D Carousel Features
- ✅ Auto-rotation with configurable interval
- ✅ Pause on hover
- ✅ Touch swipe gestures
- ✅ Keyboard navigation
- ✅ Dot indicators for direct navigation
- ✅ Previous/Next buttons

### Accessibility
- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure
- ✅ Focus management
- ✅ Screen reader compatibility

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Mocking Strategy

### Next.js Components
- `next/navigation` - Mocked for router functionality
- `next/link` - Mocked for Link component
- `next/image` - Mocked for Image component

### Custom Components
- `ThreeDCarousel` - Mocked in integration tests
- `Navbar` - Mocked in integration tests
- `Footer` - Mocked in integration tests

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Cleanup**: All mocks are cleared between tests
3. **Realistic**: Tests simulate real user interactions
4. **Comprehensive**: Cover happy paths, edge cases, and error scenarios
5. **Maintainable**: Clear test descriptions and organized structure

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution time
- No external dependencies
- Deterministic results
- Clear error messages

## Contributing

When adding new features to the About section:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Maintain coverage above 80%
4. Update this README if needed

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module"
**Solution**: Run `npm install` to ensure all dependencies are installed

**Issue**: Timer-related tests fail
**Solution**: Ensure `jest.useFakeTimers()` is called in beforeEach

**Issue**: Navigation tests fail
**Solution**: Check that `useRouter` mock is properly configured

## Related Documentation

- [Testing Guide](../TESTING_GUIDE.md)
- [Jest Configuration](../jest.config.js)
- [Component Documentation](../../components/landing/README.md)

## Test Metrics

Last updated: 2025-10-25

- Total Tests: 100+
- Test Suites: 3
- Coverage: 85%+
- Average Runtime: < 5 seconds
