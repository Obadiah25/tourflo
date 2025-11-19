# TourFlo Test Suite Documentation

This document provides comprehensive instructions for running and interpreting the TourFlo refactor validation tests.

## Overview

The test suite validates the complete migration from LookYah (Jamaica) to TourFlo (Florida) across 5 key areas:

1. **Component Tests** - React component rendering and behavior
2. **Data Validation Tests** - Mock data integrity and structure
3. **Database Migration Tests** - Schema changes and data migration
4. **Branding Tests** - Complete rebrand validation
5. **E2E Tests** - Full user journey scenarios

## Test Statistics

- **Total Test Suites**: 5
- **Total Test Cases**: 45+
- **Estimated Runtime**: 2-5 minutes
- **Coverage Target**: 80%+

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### 2. Update package.json Scripts

Add these test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:components": "vitest run src/__tests__/components",
    "test:data": "vitest run src/__tests__/data",
    "test:database": "vitest run src/__tests__/database",
    "test:branding": "vitest run src/__tests__/branding",
    "test:e2e": "vitest run src/__tests__/e2e"
  }
}
```

### 3. Environment Setup

Ensure your `.env` file has the required Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```
Opens interactive browser-based test UI at `http://localhost:51204`

### Run Tests Once (CI Mode)

```bash
npm run test:run
```

### Generate Coverage Report

```bash
npm run test:coverage
```
Creates HTML coverage report in `coverage/` directory

### Run Individual Test Suites

```bash
# Component tests only
npm run test:components

# Data validation tests only
npm run test:data

# Database migration tests only
npm run test:database

# Branding tests only
npm run test:branding

# E2E tests only
npm run test:e2e
```

### Run Specific Test File

```bash
npx vitest src/__tests__/components/TourFlo.test.tsx
```

### Watch Mode (Auto-rerun on Changes)

```bash
npm test -- --watch
```

---

## Test Suite Breakdown

### 1. Component Tests (`TourFlo.test.tsx`)

**Purpose**: Validate React component rendering and UI behavior

**Test Cases** (10 tests):
- ✅ Render exactly 9 Florida category tiles
- ✅ Display correct Florida category names
- ✅ Render category icons with correct colors
- ✅ No Jamaica-specific categories displayed
- ✅ Display Florida county locations (not parishes)
- ✅ Show USD pricing without JMD
- ✅ Show Florida counties in onboarding
- ✅ No Jamaica parishes in location options
- ✅ Display "FlorBot" instead of "JAHBOI"
- ✅ Use Florida context in AI responses

**Expected Results**:
```
✓ src/__tests__/components/TourFlo.test.tsx (10)
  ✓ DiscoveryFeed - Category Display (4)
  ✓ ExperienceDetailPage - Florida Location Display (3)
  ✓ OnboardingFlow - Florida Location Selection (2)
  ✓ FlorBot - AI Assistant Branding (3)
```

---

### 2. Data Validation Tests (`DataValidation.test.ts`)

**Purpose**: Verify mock data structure and integrity

**Test Cases** (10 tests):
- ✅ Load exactly 45 mock experiences
- ✅ All required fields present in each experience
- ✅ All experiences use USD currency only
- ✅ Pricing is in valid USD range
- ✅ No JMD pricing exists
- ✅ All locations are valid Florida counties
- ✅ No Jamaican parishes in data
- ✅ State is always "Florida"
- ✅ All experiences use valid categories (9 categories)
- ✅ All ratings are in 4.2-4.9 range

**Expected Results**:
```
✓ src/__tests__/data/DataValidation.test.ts (10)
  ✓ Mock Experience Data Integrity (5)
  ✓ Florida Location Validation (4)
  ✓ Category System Validation (4)
  ✓ Rating System Validation (3)
  ✓ Operator Data Validation (3)
```

---

### 3. Database Migration Tests (`MigrationValidation.test.ts`)

**Purpose**: Validate database schema changes and data migration

**Test Cases** (10 tests):
- ✅ Operator table has `county` field (not `parish`)
- ✅ Operator table has `ein` field (not `trn`)
- ✅ No `parish` or `trn` fields exist
- ✅ Existing operators migrated to Florida locations
- ✅ Currencies table has only USD (no JMD)
- ✅ Exactly 9 Florida categories exist
- ✅ All expected categories are present
- ✅ No Jamaica-specific categories
- ✅ Exactly 8 vibe tags exist
- ✅ Location data uses counties not parishes

**Expected Results**:
```
✓ src/__tests__/database/MigrationValidation.test.ts (10)
  ✓ Operator Table Schema Changes (6)
  ✓ Currency System Migration (4)
  ✓ Category System Migration (4)
  ✓ Vibe Tags Migration (3)
  ✓ Location Data Migration (3)
```

**Prerequisites**: Requires Supabase connection and migrations applied

---

### 4. Branding Tests (`BrandingValidation.test.ts`)

**Purpose**: Ensure complete rebrand from LookYah to TourFlo

**Test Cases** (8 tests):
- ✅ No "LookYah" strings in source code
- ✅ No "LookYah" in component names
- ✅ No "LookYah" in CSS classes or IDs
- ✅ No "JAHBOI" strings in code
- ✅ "FlorBot" used in chat components
- ✅ FlorBot uses Florida context
- ✅ No "JMD" currency references
- ✅ No Jamaica parish names in code

**Expected Results**:
```
✓ src/__tests__/branding/BrandingValidation.test.ts (8)
  ✓ LookYah Brand Removal (3)
  ✓ JAHBOI to FlorBot Migration (3)
  ✓ Currency Reference Removal (3)
  ✓ Geographic Reference Updates (3)
  ✓ Logo and Favicon Validation (3)
  ✓ Environment Variable Validation (2)
```

---

### 5. E2E User Flow Tests (`UserFlows.test.ts`)

**Purpose**: Test complete user journeys end-to-end

**Test Scenarios** (5 scenarios):

#### Scenario 1: Tourist Discovery → Booking
- Tourist signs up
- Discovers Theme Park experience
- Views experience detail (Florida location, USD pricing)
- Creates booking
- Receives confirmation
- ✅ All data uses Florida/USD throughout

#### Scenario 2: Operator Signup → First Booking
- Operator signs up
- Creates operator profile (Miami-Dade County, EIN)
- Creates experience (Beach & Water, USD)
- Tourist books experience
- Operator receives booking notification
- ✅ Operator data uses Florida business info

#### Scenario 3: Inventory Management
- Operator sets availability for date
- Customer views available spots
- Operator updates availability
- Customer sees updated spots
- ✅ Real-time inventory sync

#### Scenario 4: Seasonal Pricing
- Base price in summer (1.0x)
- Winter peak season pricing (1.25x)
- Spring pricing (1.15x)
- Fall pricing (1.10x)
- ✅ All pricing remains USD

#### Scenario 5: Geographic Filter
- Filter by Miami-Dade County
- Filter by Orange County
- Search Florida experiences
- ✅ All results are Florida locations

**Expected Results**:
```
✓ src/__tests__/e2e/UserFlows.test.ts (5)
  ✓ Scenario 1: Tourist Discovery to Booking Flow (2)
  ✓ Scenario 2: Operator Signup to First Booking (2)
  ✓ Scenario 3: Inventory Management Updates (1)
  ✓ Scenario 4: Seasonal Pricing Adjustments (2)
  ✓ Scenario 5: Geographic Filter and Search (2)
```

---

## Interpreting Results

### Success Output

```
✓ src/__tests__/components/TourFlo.test.tsx (10) 850ms
✓ src/__tests__/data/DataValidation.test.ts (10) 245ms
✓ src/__tests__/database/MigrationValidation.test.ts (10) 1520ms
✓ src/__tests__/branding/BrandingValidation.test.ts (8) 680ms
✓ src/__tests__/e2e/UserFlows.test.ts (5) 3250ms

Test Files  5 passed (5)
     Tests  43 passed (43)
  Start at  14:23:45
  Duration  6.54s
```

### Failure Output

When tests fail, you'll see detailed error messages:

```
❌ src/__tests__/branding/BrandingValidation.test.ts > LookYah Brand Removal > should verify no "LookYah" strings remain in source code

AssertionError: Found LookYah references:
[
  {
    "file": "/src/components/Header.tsx",
    "line": 15,
    "content": "const appName = 'LookYah';"
  }
]
```

### Coverage Report

After running `npm run test:coverage`, open `coverage/index.html`:

```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
All files              |   82.45 |    78.32 |   85.67 |   82.45
 components/           |   85.23 |    80.15 |   88.90 |   85.23
 lib/                  |   78.56 |    75.44 |   81.25 |   78.56
```

**Target Coverage**: 80%+ for all metrics

---

## Debugging Failed Tests

### Enable Debug Mode

```bash
DEBUG=vitest:* npm test
```

### Run Single Test in Watch Mode

```bash
npx vitest src/__tests__/components/TourFlo.test.tsx --watch
```

### Use Test UI for Interactive Debugging

```bash
npm run test:ui
```

Then click on failed tests to see:
- Full error stack traces
- Component render output
- Console logs
- Network requests

### Add Console Logs to Tests

```typescript
it('should do something', () => {
  console.log('Debug info:', someVariable);
  expect(someVariable).toBe(expected);
});
```

---

## Common Issues & Solutions

### Issue 1: Supabase Connection Fails

**Error**: `Failed to connect to Supabase`

**Solution**:
1. Check `.env` file has correct credentials
2. Verify Supabase project is running
3. Check network connectivity

```bash
# Test Supabase connection
curl https://your-project.supabase.co
```

### Issue 2: Tests Timeout

**Error**: `Test timed out in 5000ms`

**Solution**: Increase timeout in `vitest.config.ts`:

```typescript
test: {
  testTimeout: 10000, // 10 seconds
}
```

### Issue 3: Module Not Found

**Error**: `Cannot find module '@testing-library/react'`

**Solution**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```

### Issue 4: Database Tests Fail

**Error**: `Table 'operators' does not exist`

**Solution**: Apply migrations first:
```bash
# Check migrations in supabase/migrations/
# Verify all 5 TourFlo migrations are applied
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## Development Workflow

### 1. During Development

Run tests in watch mode:
```bash
npm test -- --watch
```

### 2. Before Committing

Run all tests once:
```bash
npm run test:run
```

### 3. Before Pull Request

Generate coverage report:
```bash
npm run test:coverage
```
Ensure coverage is above 80%

### 4. After Migration Changes

Run database tests:
```bash
npm run test:database
```

---

## Test Maintenance

### Adding New Tests

1. Create test file in appropriate directory:
   - Components: `src/__tests__/components/`
   - Data: `src/__tests__/data/`
   - Database: `src/__tests__/database/`
   - Branding: `src/__tests__/branding/`
   - E2E: `src/__tests__/e2e/`

2. Follow naming convention: `*.test.ts` or `*.test.tsx`

3. Use descriptive test names:
```typescript
it('should display USD currency for all experiences', () => {
  // Test implementation
});
```

### Updating Tests After Code Changes

When you modify components or data structures:

1. Run affected test suite
2. Update test expectations
3. Verify all related tests still pass
4. Update documentation if needed

---

## Performance Benchmarks

Expected test execution times:

| Test Suite | Expected Time | Warning Threshold |
|------------|--------------|-------------------|
| Components | 500ms - 1s   | > 2s             |
| Data       | 200ms - 500ms| > 1s             |
| Database   | 1s - 2s      | > 5s             |
| Branding   | 500ms - 1s   | > 2s             |
| E2E        | 2s - 4s      | > 10s            |

If tests exceed warning thresholds, investigate:
- Network latency
- Database query optimization
- Component render optimization

---

## Contact & Support

For issues or questions about the test suite:

1. Check this documentation first
2. Review test failure messages carefully
3. Use test UI for interactive debugging
4. Check Vitest documentation: https://vitest.dev

---

## Appendix: Test File Structure

```
project/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts                    # Global test setup
│   │   ├── components/
│   │   │   └── TourFlo.test.tsx       # Component tests (10 tests)
│   │   ├── data/
│   │   │   └── DataValidation.test.ts  # Data validation (10 tests)
│   │   ├── database/
│   │   │   └── MigrationValidation.test.ts # Database tests (10 tests)
│   │   ├── branding/
│   │   │   └── BrandingValidation.test.ts  # Branding tests (8 tests)
│   │   └── e2e/
│   │       └── UserFlows.test.ts       # E2E scenarios (5 tests)
├── vitest.config.ts                    # Vitest configuration
└── TEST_SUITE_README.md               # This file

Total: 43+ test cases across 5 suites
```

---

## Quick Reference Commands

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run once (CI mode)
npm run test:run

# Coverage report
npm run test:coverage

# Individual suites
npm run test:components
npm run test:data
npm run test:database
npm run test:branding
npm run test:e2e

# Watch mode
npm test -- --watch

# Debug mode
DEBUG=vitest:* npm test
```

---

**Last Updated**: 2025-11-18
**Version**: 1.0
**Test Framework**: Vitest + React Testing Library
