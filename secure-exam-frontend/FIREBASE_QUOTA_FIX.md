# Firebase Quota Exceeded - Fix Guide

## Problem
You're seeing this error:
```
@firebase/firestore: Firestore (12.4.0): FirebaseError: [code=resource-exhausted]: Quota exceeded.
```

## What This Means
Firebase's free tier (Spark Plan) has daily limits:
- **50,000 reads per day**
- **20,000 writes per day**
- **20,000 deletes per day**

Your exam app has exceeded one of these limits, likely due to:
1. Real-time listeners updating frequently
2. Multiple test runs
3. Violation tracking writing too often

## Solutions

### Option 1: Wait (Free)
- Firebase quotas reset every 24 hours at midnight Pacific Time
- Your app will work again after the reset
- **Recommended for development/testing**

### Option 2: Upgrade to Blaze Plan (Pay-as-you-go)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `exam-browser-1a754`
3. Click "Upgrade" in the left sidebar
4. Choose "Blaze Plan"
5. Add payment method
6. **Cost**: Very low for small apps (~$0.01-0.10/day for testing)

### Option 3: Optimize Your Code (Reduce Writes)

#### Current Issues:
1. **Violation tracking** writes too frequently
2. **Real-time listeners** cause many reads
3. **Session updates** happen on every page

#### Quick Fixes:

**1. Reduce Violation Logging Frequency**
In `lib/hooks/use-violations.ts`, the batch flush is every 5 seconds. Increase it:
```typescript
// Change from 5000 to 30000 (30 seconds)
const flushInterval = setInterval(async () => {
  // ... flush logic
}, 30000) // Increased from 5000
```

**2. Disable Simulation Violations**
In `components/exam/violation-tracker.tsx`, comment out the simulation:
```typescript
// Comment out this entire block during development:
/*
const simulationInterval = setInterval(() => {
  if (Math.random() > 0.95) {
    logViolationEvent("out-of-frame", "Person moved out of camera frame", "medium")
  }
  // ... other simulations
}, 5000)
*/
```

**3. Use Local Storage for Development**
Create a dev mode that stores data locally instead of Firebase:
```typescript
// In .env.local
NEXT_PUBLIC_USE_LOCAL_STORAGE=true
```

## Immediate Workaround

### For Testing Without Firebase:
1. Comment out Firestore calls temporarily
2. Use mock data
3. Test UI/UX without backend

### Check Your Current Usage:
1. Go to Firebase Console
2. Click "Usage" tab
3. See which quota you've hit
4. Monitor daily usage

## Prevention

### Best Practices:
1. **Batch writes** - Don't write on every change
2. **Debounce updates** - Wait before saving
3. **Use local state** - Only sync critical data
4. **Limit listeners** - Unsubscribe when not needed
5. **Cache data** - Don't re-fetch unnecessarily

### For Production:
- Always use Blaze plan
- Set up budget alerts
- Monitor usage regularly
- Optimize queries

## Current Status

Your app is working correctly, but Firebase has temporarily blocked writes due to quota limits. All your code is fine - this is just a usage limit issue.

**Recommended Action**: 
- For development: Wait 24 hours or optimize code
- For production: Upgrade to Blaze plan (costs ~$1-5/month for small apps)
