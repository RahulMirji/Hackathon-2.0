# Database Save Feature - Implementation Plan

## Branch: `database-save-feature`

## Overview
Implement real-time Firestore database integration to save all exam session data including questions, answers, user responses, violations, and display results dynamically.

---

## Current State Analysis

### Existing Data Structures

1. **Exam Session (lib/exam-session.ts)**
   - Currently uses localStorage
   - Tracks: examId, startTime, sections, seenTitles
   - Sections: mcq1, mcq2, mcq3, coding

2. **Questions**
   - MCQ Questions: title, options, correctAnswer
   - Coding Questions: title, description, constraints, examples, testCases

3. **Violations (components/exam/violation-tracker.tsx)**
   - tabSwitch, personOutOfFrame, voiceDetection, lookingAway, headphonesDetected
   - Each has limits and current counts

4. **User Authentication**
   - Firebase Auth already configured (lib/firebase.ts)
   - Auth context available

---

## Data to Save in Firestore

### 1. **Exam Sessions Collection** (`examSessions`)
```typescript
{
  examId: string                    // Unique exam session ID
  userId: string                    // Firebase Auth UID
  userEmail: string                 // User email
  startTime: Timestamp              // Exam start time
  endTime: Timestamp | null         // Exam end time (null if ongoing)
  status: 'in-progress' | 'completed' | 'submitted' | 'flagged'
  totalDuration: number             // Total time taken in minutes
  
  // Section completion tracking
  sectionsCompleted: {
    mcq1: boolean
    mcq2: boolean
    mcq3: boolean
    coding: boolean
  }
  
  // Timestamps for each section
  sectionTimestamps: {
    mcq1?: { startTime: Timestamp, endTime?: Timestamp }
    mcq2?: { startTime: Timestamp, endTime?: Timestamp }
    mcq3?: { startTime: Timestamp, endTime?: Timestamp }
    coding?: { startTime: Timestamp, endTime?: Timestamp }
  }
  
  // Overall statistics
  totalQuestions: number
  totalAnswered: number
  totalCorrect: number              // Calculated after submission
  totalScore: number                // Calculated score
  
  // Violation summary
  violationSummary: {
    tabSwitch: number
    personOutOfFrame: number
    voiceDetection: number
    lookingAway: number
    headphonesDetected: boolean
    totalViolations: number
    flagged: boolean
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2. **Questions Collection** (`examSessions/{examId}/questions`)
Subcollection under each exam session
```typescript
{
  questionId: string                // Unique question ID
  section: 'mcq1' | 'mcq2' | 'mcq3' | 'coding'
  questionNumber: number            // Question number in section
  type: 'mcq' | 'coding'
  
  // Question content
  title: string
  description?: string              // For coding questions
  options?: string[]                // For MCQ
  correctAnswer?: string            // For MCQ (encrypted/hashed)
  
  // Coding specific
  constraints?: string[]
  examples?: Array<{
    input: string
    output: string
    explanation?: string
  }>
  testCases?: Array<{
    input: string
    expectedOutput: string
    isHidden: boolean
  }>
  
  // Metadata
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  source: 'ai' | 'mock' | 'cache'
  
  createdAt: Timestamp
}
```

### 3. **Answers Collection** (`examSessions/{examId}/answers`)
Subcollection under each exam session
```typescript
{
  answerId: string                  // Auto-generated
  questionId: string                // Reference to question
  section: string
  questionNumber: number
  
  // User response
  userAnswer: string | null         // Selected option or code
  isCorrect?: boolean               // Calculated after submission
  
  // Status tracking
  status: 'not-visited' | 'not-answered' | 'answered' | 'marked-review' | 'answered-marked'
  markedForReview: boolean
  
  // Timing data
  timeSpent: number                 // Seconds spent on question
  firstVisitedAt: Timestamp
  lastModifiedAt: Timestamp
  
  // Coding specific
  codeSubmissions?: Array<{
    code: string
    language: string
    timestamp: Timestamp
    testResults?: Array<{
      passed: boolean
      input: string
      expected: string
      actual: string
      executionTime: number
    }>
  }>
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 4. **Violations Collection** (`examSessions/{examId}/violations`)
Subcollection under each exam session
```typescript
{
  violationId: string               // Auto-generated
  type: 'tab-switch' | 'out-of-frame' | 'voice-detected' | 'looking-away' | 'headphones'
  timestamp: Timestamp
  section: string                   // Which section was active
  
  // Additional context
  severity: 'low' | 'medium' | 'high'
  description: string
  
  // For tracking patterns
  duration?: number                 // How long the violation lasted
  resolved?: boolean                // If violation was resolved
  
  createdAt: Timestamp
}
```

### 5. **Results Collection** (`examResults`)
Final results after exam submission
```typescript
{
  resultId: string                  // Same as examId
  examId: string
  userId: string
  userEmail: string
  
  // Overall performance
  totalScore: number
  maxScore: number
  percentage: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F'
  
  // Section-wise breakdown
  sectionScores: {
    mcq1: { score: number, maxScore: number, percentage: number }
    mcq2: { score: number, maxScore: number, percentage: number }
    mcq3: { score: number, maxScore: number, percentage: number }
    coding: { score: number, maxScore: number, percentage: number }
  }
  
  // Detailed statistics
  totalQuestions: number
  totalAnswered: number
  totalCorrect: number
  totalIncorrect: number
  totalSkipped: number
  
  // Time analysis
  totalTimeTaken: number            // Minutes
  averageTimePerQuestion: number    // Seconds
  
  // Violation impact
  violationCount: number
  violationPenalty: number          // Points deducted
  flaggedForReview: boolean
  
  // Submission details
  submittedAt: Timestamp
  evaluatedAt: Timestamp
  
  createdAt: Timestamp
}
```

---

## Implementation Steps

### Phase 1: Firestore Setup & Service Layer
1. **Update Firebase Configuration**
   - Add Firestore initialization
   - Set up security rules
   - Create indexes

2. **Create Firestore Service Layer** (`lib/firestore-service.ts`)
   - CRUD operations for all collections
   - Real-time subscription helpers
   - Batch operations for efficiency

3. **Create Type Definitions** (`lib/types/exam-types.ts`)
   - TypeScript interfaces for all data structures
   - Validation schemas

### Phase 2: Exam Session Management
1. **Update Exam Session Logic**
   - Migrate from localStorage to Firestore
   - Keep localStorage as cache/fallback
   - Implement real-time sync

2. **Session Initialization**
   - Create exam session on exam start
   - Save user info and metadata
   - Initialize violation tracking

3. **Question Saving**
   - Save generated questions to Firestore
   - Link questions to exam session
   - Cache locally for offline support

### Phase 3: Answer Tracking
1. **Real-time Answer Saving**
   - Save answers as user progresses
   - Track question status changes
   - Record time spent per question

2. **Coding Submissions**
   - Save code submissions with test results
   - Track multiple attempts
   - Store execution metrics

### Phase 4: Violation Tracking
1. **Real-time Violation Logging**
   - Log each violation with timestamp
   - Track violation patterns
   - Update violation summary

2. **Violation Analytics**
   - Calculate severity scores
   - Flag suspicious behavior
   - Generate violation reports

### Phase 5: Results & Display
1. **Result Calculation**
   - Calculate scores on submission
   - Generate section-wise breakdown
   - Apply violation penalties

2. **Results Page** (`app/exam/results/page.tsx`)
   - Display overall performance
   - Section-wise analysis
   - Question-by-question review
   - Violation summary
   - Time analysis charts

3. **Real-time Updates**
   - Subscribe to exam session changes
   - Live progress tracking
   - Admin monitoring dashboard

### Phase 6: Additional Features
1. **Exam History**
   - List all past exams
   - Compare performance over time
   - Export results as PDF

2. **Admin Dashboard**
   - Monitor ongoing exams
   - View all submissions
   - Flag suspicious activities
   - Generate reports

3. **Analytics**
   - Performance trends
   - Question difficulty analysis
   - Common mistakes
   - Time management insights

---

## Firestore Security Rules

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
      allow write: if false; // Only server can write results
    }
    
    // Admin access (add admin role check)
    match /{document=**} {
      allow read, write: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Real-time Subscription Strategy

1. **Exam Session**: Subscribe on exam start, unsubscribe on submit
2. **Answers**: Auto-save on change with debouncing (500ms)
3. **Violations**: Log immediately, batch updates every 5 seconds
4. **Results**: Subscribe after submission for live score calculation

---

## Performance Optimizations

1. **Batch Writes**: Group multiple operations
2. **Debouncing**: Delay saves for rapid changes
3. **Local Cache**: Use localStorage as primary, sync to Firestore
4. **Lazy Loading**: Load questions on-demand
5. **Pagination**: For exam history and admin views
6. **Indexes**: Create composite indexes for common queries

---

## Error Handling

1. **Offline Support**: Queue operations when offline
2. **Retry Logic**: Automatic retry with exponential backoff
3. **Fallback**: Use localStorage if Firestore fails
4. **User Feedback**: Show sync status and errors
5. **Data Recovery**: Periodic backups and recovery mechanisms

---

## Testing Strategy

1. **Unit Tests**: Test Firestore service functions
2. **Integration Tests**: Test real-time sync
3. **E2E Tests**: Test complete exam flow
4. **Load Tests**: Test with multiple concurrent users
5. **Offline Tests**: Test offline functionality

---

## Migration Plan

1. **Backward Compatibility**: Support both localStorage and Firestore
2. **Gradual Rollout**: Enable for new users first
3. **Data Migration**: Migrate existing localStorage data
4. **Monitoring**: Track errors and performance
5. **Rollback Plan**: Quick rollback if issues arise

---

## Next Steps

1. ✅ Create branch and pull latest code
2. ✅ Analyze current codebase
3. ✅ Create implementation plan
4. 🔄 Implement Firestore service layer
5. 🔄 Update exam session management
6. 🔄 Implement answer tracking
7. 🔄 Implement violation tracking
8. 🔄 Create results page
9. 🔄 Add real-time subscriptions
10. 🔄 Testing and optimization

---

## Files to Create/Modify

### New Files
- `lib/firestore-service.ts` - Firestore operations
- `lib/types/exam-types.ts` - Type definitions
- `lib/hooks/use-exam-session.ts` - React hook for exam session
- `lib/hooks/use-violations.ts` - React hook for violations
- `app/exam/results/page.tsx` - Results display page
- `app/exam/history/page.tsx` - Exam history page
- `components/exam/results-summary.tsx` - Results summary component
- `components/exam/question-review.tsx` - Question review component
- `components/exam/violation-report.tsx` - Violation report component

### Files to Modify
- `lib/firebase.ts` - Add Firestore initialization
- `lib/exam-session.ts` - Add Firestore sync
- `lib/question-service.ts` - Save questions to Firestore
- `app/exam/mcq1/page.tsx` - Add answer saving
- `app/exam/mcq2/page.tsx` - Add answer saving
- `app/exam/mcq3/page.tsx` - Add answer saving
- `app/exam/coding/page.tsx` - Add code submission saving
- `components/exam/violation-tracker.tsx` - Add Firestore logging
- `app/exam/sections/page.tsx` - Add session initialization

---

## Estimated Timeline

- Phase 1: 2-3 days
- Phase 2: 2-3 days
- Phase 3: 2-3 days
- Phase 4: 1-2 days
- Phase 5: 3-4 days
- Phase 6: 3-4 days
- Testing & Polish: 2-3 days

**Total: ~15-22 days**

---

## Additional Considerations

1. **Data Privacy**: Encrypt sensitive data
2. **GDPR Compliance**: Add data deletion capabilities
3. **Cost Optimization**: Monitor Firestore usage and costs
4. **Scalability**: Design for 1000+ concurrent users
5. **Backup Strategy**: Regular automated backups
6. **Audit Trail**: Log all data modifications
7. **Rate Limiting**: Prevent abuse and excessive writes
8. **Data Retention**: Define retention policies

---

## Success Metrics

1. **Reliability**: 99.9% data save success rate
2. **Performance**: < 500ms save latency
3. **User Experience**: Seamless real-time sync
4. **Data Integrity**: Zero data loss
5. **Scalability**: Support 1000+ concurrent exams
