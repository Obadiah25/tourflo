# TourFlo Testing - Quick Start Guide

## Installation (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all test dependencies from package.json including:
- vitest (test runner)
- @testing-library/react (component testing)
- jsdom (DOM environment)
- coverage tools

### Step 2: Verify Setup

```bash
npm run test:run
```

Expected output:
```
✓ 5 test suites
✓ 43+ tests passed
Duration: ~5-6 seconds
```

---

## Running Tests (30 seconds)

### Quick Test Commands

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (auto-rerun on changes)
npm test

# Run with interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Run Specific Test Suite

```bash
# Component tests (UI behavior)
npm run test:components

# Data validation tests (mock data)
npm run test:data

# Database tests (schema & migrations)
npm run test:database

# Branding tests (LookYah → TourFlo)
npm run test:branding

# E2E tests (user flows)
npm run test:e2e
```

---

## Understanding Results

### ✅ All Tests Pass

```
✓ src/__tests__/components/TourFlo.test.tsx (10)
✓ src/__tests__/data/DataValidation.test.ts (10)
✓ src/__tests__/database/MigrationValidation.test.ts (10)
✓ src/__tests__/branding/BrandingValidation.test.ts (8)
✓ src/__tests__/e2e/UserFlows.test.ts (5)

Test Files  5 passed (5)
     Tests  43 passed (43)
  Duration  6.54s
```

**Action**: Ship it! ✅

---

### ❌ Some Tests Fail

```
❌ src/__tests__/branding/BrandingValidation.test.ts
  ❌ should verify no "LookYah" strings remain

  Expected: 0 violations
  Received: 1 violation

  File: src/components/Header.tsx
  Line: 15
  Content: const appName = 'LookYah';
```

**Action**: Fix the issue and re-run tests

---

## What Each Test Suite Does

| Suite | What It Tests | Time | Critical |
|-------|---------------|------|----------|
| **Components** | React UI rendering correctly | ~1s | 🔴 Yes |
| **Data** | Mock data structure valid | ~0.5s | 🟡 Medium |
| **Database** | Schema migrations applied | ~2s | 🔴 Yes |
| **Branding** | No LookYah/Jamaica references | ~1s | 🔴 Yes |
| **E2E** | Full user journeys work | ~3s | 🟡 Medium |

---

## Common Scenarios

### Before Pushing Code

```bash
npm run test:run && npm run build
```

Both must pass before pushing.

---

### After Changing Components

```bash
npm run test:components
```

---

### After Database Migration

```bash
npm run test:database
```

---

### Debugging Failed Test

```bash
# Option 1: Use Test UI (recommended)
npm run test:ui

# Option 2: Run specific test file
npx vitest src/__tests__/components/TourFlo.test.tsx

# Option 3: Watch mode
npm test -- --watch
```

---

## Test Coverage

### Generate Report

```bash
npm run test:coverage
```

### View Report

Open: `coverage/index.html` in browser

**Target**: 80%+ coverage across all files

---

## 5-Minute Health Check

Run this before any demo or deployment:

```bash
# 1. Run all tests
npm run test:run

# 2. Check build
npm run build

# 3. Verify coverage
npm run test:coverage
```

All three should pass with:
- ✅ All tests passing
- ✅ Build successful
- ✅ Coverage >80%

---

## When Tests Fail

### Step 1: Read the Error Message

The error tells you exactly what's wrong:

```
Expected: "USD"
Received: "JMD"
```

### Step 2: Find the File

Error shows file path:
```
src/components/ExperienceCard.tsx:45
```

### Step 3: Fix the Issue

Change line 45 from:
```typescript
currency: 'JMD'  // ❌ Wrong
```

To:
```typescript
currency: 'USD'  // ✅ Correct
```

### Step 4: Re-run Test

```bash
npm run test:components
```

---

## Test Assertions Explained

### Common Assertions

```typescript
// Check if something exists
expect(data).toBeDefined()

// Check exact value
expect(currency).toBe('USD')

// Check string contains
expect(location).toContain('Florida')

// Check array length
expect(experiences.length).toBe(45)

// Check number range
expect(rating).toBeGreaterThan(4.2)
expect(rating).toBeLessThan(4.9)

// Check NOT equal
expect(currency).not.toBe('JMD')
expect(location).not.toMatch(/parish/i)
```

---

## Pro Tips

### 1. Run Tests on Every Save

```bash
npm test
```
Leave this running in a terminal tab. Tests auto-run on file changes.

---

### 2. Focus on One Test

Add `.only` to run just one test:

```typescript
it.only('should display USD currency', () => {
  // This test runs, others skip
});
```

Remove `.only` before committing!

---

### 3. Skip Slow Tests During Development

Add `.skip` to temporarily disable:

```typescript
it.skip('should complete full booking flow', () => {
  // This test won't run
});
```

---

### 4. Use Test UI for Debugging

```bash
npm run test:ui
```

Benefits:
- See real-time test results
- Click to see full error details
- View console logs
- Inspect component output

---

## Red Flags 🚩

Run tests if you see ANY of these in code:

- ❌ "LookYah" anywhere
- ❌ "JAHBOI" anywhere
- ❌ "JMD" currency
- ❌ Jamaica parish names (St. Ann, Portland, etc.)
- ❌ "parish" field in database
- ❌ "trn" field in operator table

These should all fail tests.

---

## Green Flags ✅

Tests should pass when you see:

- ✅ "TourFlo" branding
- ✅ "FlorBot" AI assistant
- ✅ "USD" currency only
- ✅ Florida county names (Miami-Dade, Orange, etc.)
- ✅ "county" field in database
- ✅ "ein" field in operator table
- ✅ 9 Florida categories

---

## Need Help?

### 1. Check Full Documentation

See: `TEST_SUITE_README.md` (comprehensive guide)

### 2. View Test Files

Tests are in: `src/__tests__/`

Each test file has comments explaining what it does.

### 3. Run Debug Mode

```bash
DEBUG=vitest:* npm test
```

Shows detailed execution info.

---

## Test File Locations

```
src/__tests__/
├── components/TourFlo.test.tsx        # React component tests
├── data/DataValidation.test.ts        # Mock data tests
├── database/MigrationValidation.test.ts # Schema tests
├── branding/BrandingValidation.test.ts  # Rebrand tests
├── e2e/UserFlows.test.ts              # User journey tests
├── setup.ts                           # Test configuration
└── helpers/testUtils.tsx              # Test utilities
```

---

## Summary

**Before Coding**: `npm test` (watch mode)
**Before Committing**: `npm run test:run`
**Before Deploying**: `npm run test:coverage`

**Target**: All tests passing, 80%+ coverage

---

**That's it!** You're ready to test TourFlo. 🚀

For detailed documentation, see: `TEST_SUITE_README.md`
