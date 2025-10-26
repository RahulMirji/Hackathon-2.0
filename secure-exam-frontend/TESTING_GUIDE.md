# Testing Guide - Database Save Feature

## Prerequisites

1. **Firebase Setup**
   - Firestore must be enabled in Firebase Console
   - Security rules must be deployed
   - User must be authenticated

2. **Environment**
   - Run `npm install` to ensure all dependencies are installed
   - Firebase config is already in `lib/firebase.ts`

## Firestore Security Rules

Deploy these rules to Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Exam Sessions - Users can only access their own
    match /examSessions/{examId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Subcollections
      match /questions/{questionId} {
        allow read, write: if request.auth != null && 
                             get(/databases/$(database)/documents/examSessions/$(examId)).data.userId == request.auth.uid;
      }
      
      match /answers/{answerId} {
        allow read, write: if request.auth != null && 
                             get(/databases/$(database)/documents/examSessions/$(examId)).data.userId == request.auth.uid;
      }
      
      match /violations/{violationId} {
        allow read, write: if request.auth != null && 
                             get(/databases/$(database)/documents/examSessions/$(examId)).data.userId == request.auth.uid;
      }
    }
    
    // Results - Users can only read their own
    match /examResults/{resultId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

## Test Flow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Login/Signup

1. Navigate to `/auth/login` or `/auth/signup`
2. Create an account or login
3. Ensure you're authenticated

### 3. Start Exam

1. Navigate to `/exam/sections`
2. **Expected**: Exam session created in Firestore
3. **Check Console**: Should see "✅ Created new exam session in Firestore"
4. **Check Firestore**: New document in `examSessions` collection

### 4. Test MCQ Section

1. Click "Start MCQ 1"
2. **Expected**: Section start time recorded
3. Answer some questions
4. **Expected**: Answers saved with 500ms debounce
5. **Check Console**: Should see "✅ Saved answer for Q1", etc.
6. **Check Firestore**: 
   - `examSessions/{examId}/answers` subcollection populated
   - Each answer has: userAnswer, status, timeSpent, timestamps

### 5. Test Violations

1. Switch tabs (Cmd+Tab or Alt+Tab)
2. **Expected**: Violation logged immediately
3. **Check Console**: Should see violation logs
4. **Check Firestore**: 
   - `examSessions/{examId}/violations` subcollection
   - Violation document with type, timestamp, severity
   - `violationSummary` in exam session updated

### 6. Test Coding Section

1. Navigate to coding section
2. Write some code
3. Click "Run Test Cases"
4. **Expected**: Code submission saved with test results
5. **Check Console**: Should see "✅ Saved code submission"
6. **Check Firestore**:
   - Answer document has `codeSubmissions` array
   - Each submission has code, language, testResults, timestamp

### 7. Submit Exam

1. Click "Submit Exam"
2. **Expected**: Redirected to submission page
3. **Expected**: Results calculated automatically
4. **Expected**: Redirected to results page
5. **Check Firestore**:
   - `examResults` collection has new document
   - Exam session status changed to "submitted"
   - `endTime` recorded

### 8. View Results

1. Results page should display:
   - Overall grade and percentage
   - Section-wise breakdown
   - Time analysis
   - Violation summary
   - Performance insights

## What to Check in Firestore Console

### 1. Exam Sessions Collection

```
examSessions/
  └── exam_1234567890_abc123/
      ├── examId: "exam_1234567890_abc123"
      ├── userId: "user_uid"
      ├── userEmail: "user@example.com"
      ├── status: "in-progress" | "completed" | "submitted"
      ├── startTime: Timestamp
      ├── endTime: Timestamp | null
      ├── sectionsCompleted: { mcq1: false, mcq2: false, ... }
      ├── sectionTimestamps: { mcq1: { startTime, endTime }, ... }
      ├── violationSummary: { tabSwitch: 0, ... }
      ├── browserInfo: { userAgent, platform, ... }
      └── timestamps
```

### 2. Questions Subcollection

```
examSessions/{examId}/questions/
  └── mcq1_q1/
      ├── questionId: "mcq1_q1"
      ├── section: "mcq1"
      ├── questionNumber: 1
      ├── type: "mcq"
      ├── title: "Question text"
      ├── options: ["A", "B", "C", "D"]
      ├── correctAnswer: "A"
      └── metadata
```

### 3. Answers Subcollection

```
examSessions/{examId}/answers/
  └── mcq1_a1/
      ├── answerId: "mcq1_a1"
      ├── questionId: "mcq1_q1"
      ├── userAnswer: "A"
      ├── status: "answered"
      ├── markedForReview: false
      ├── timeSpent: 45 (seconds)
      ├── firstVisitedAt: Timestamp
      ├── lastModifiedAt: Timestamp
      └── codeSubmissions: [] (for coding questions)
```

### 4. Violations Subcollection

```
examSessions/{examId}/violations/
  └── tab-switch_1234567890/
      ├── violationId: "tab-switch_1234567890"
      ├── type: "tab-switch"
      ├── timestamp: Timestamp
      ├── section: "mcq1"
      ├── severity: "high"
      ├── description: "User switched tabs"
      └── resolved: false
```

### 5. Results Collection

```
examResults/
  └── exam_1234567890_abc123/
      ├── resultId: "exam_1234567890_abc123"
      ├── examId: "exam_1234567890_abc123"
      ├── userId: "user_uid"
      ├── totalScore: 85
      ├── maxScore: 100
      ├── percentage: 85.0
      ├── grade: "B+"
      ├── sectionScores: { mcq1: {...}, mcq2: {...}, ... }
      ├── violationCount: 2
      ├── violationPenalty: 4
      ├── flaggedForReview: false
      └── timestamps
```

## Console Logs to Watch For

### Success Logs
```
✅ [FIRESTORE] Created exam session: exam_xxx
✅ [FIRESTORE] Started section mcq1 for exam: exam_xxx
✅ Saved answer for Q1
✅ [FIRESTORE] Saved 25 questions for mcq1
☁️ [SESSION] Synced 25 questions to Firestore for mcq1
✅ Saved code submission for Q1
✅ [FIRESTORE] Calculated and saved result: exam_xxx
```

### Error Logs (if any)
```
❌ [FIRESTORE] Failed to save session: [error]
Failed to sync to Firestore: [error]
Failed to log violation: [error]
```

## Performance Checks

1. **Answer Saving**: Should debounce to 500ms (not save on every keystroke)
2. **Violation Batching**: Should batch violations every 5 seconds
3. **localStorage Fallback**: Should work even if Firestore fails
4. **Real-time Updates**: Violation counts should update in real-time

## Common Issues & Solutions

### Issue: "User not authenticated"
**Solution**: Make sure you're logged in. Check `useAuth()` hook.

### Issue: "Permission denied" in Firestore
**Solution**: Deploy security rules to Firebase Console.

### Issue: Answers not saving
**Solution**: Check console for errors. Verify examId exists.

### Issue: Results not calculating
**Solution**: Ensure all questions have correct answers defined.

### Issue: Violations not logging
**Solution**: Check if examId is set. Verify Firestore connection.

## Manual Testing Checklist

- [ ] User can login/signup
- [ ] Exam session created on sections page
- [ ] Section start time recorded
- [ ] Answers save automatically (check Firestore)
- [ ] Question status updates correctly
- [ ] Time tracking works per question
- [ ] Tab switch violation logged
- [ ] Violation counts update in UI
- [ ] Code submissions save with test results
- [ ] Multiple code submissions tracked
- [ ] Exam submission works
- [ ] Results calculate correctly
- [ ] Results page displays all data
- [ ] Section-wise scores shown
- [ ] Violation penalty applied
- [ ] Grade calculated correctly
- [ ] localStorage cache works
- [ ] Offline mode graceful degradation

## Data Verification

After completing an exam, verify in Firestore:

1. **Exam Session**: Has all metadata, timestamps, violation summary
2. **Questions**: All questions saved with correct structure
3. **Answers**: All answered questions have documents
4. **Violations**: All violations logged with timestamps
5. **Result**: Final result calculated with correct scores

## Next Steps After Testing

1. Test with multiple users simultaneously
2. Test offline mode (disconnect internet)
3. Test with slow network (throttle in DevTools)
4. Test violation limits and flagging
5. Test result calculation accuracy
6. Test PDF export (to be implemented)
7. Test admin dashboard (to be implemented)

## Debugging Tips

1. **Open Browser Console**: Check for logs and errors
2. **Open Firestore Console**: Watch real-time updates
3. **Network Tab**: Check API calls and responses
4. **React DevTools**: Inspect hook states
5. **localStorage**: Check cached data

## Performance Monitoring

Monitor these metrics:
- Answer save latency (should be < 500ms)
- Violation log latency (should be < 100ms for immediate)
- Result calculation time (should be < 3s)
- Page load times
- Firestore read/write counts

---

## Ready to Test! 🚀

Start the dev server and follow the test flow above. Report any issues you encounter.
