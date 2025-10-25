# Section Selection Feature

## Overview
Added a section selection page that allows users to choose between 3 different exam sections before starting the exam.

## New Files Created

### 1. `/app/exam/sections/page.tsx`
- **Section selection page** with 3 cards:
  - **MCQ 1**: General & Technical (25 questions, 40 minutes)
  - **MCQ 2**: Coding Questions (25 questions, 45 minutes)
  - **MCQ 3**: English Language (10 questions, 15 minutes)
- Each card shows:
  - Section title and subtitle
  - Number of questions
  - Duration
  - Icon (FileText, Code, BookOpen)
  - Gradient color scheme
  - "Start" button

### 2. `/lib/question-banks.ts`
- **Question bank system** with 3 separate question sets
- **MCQ1_QUESTIONS**: 25 general/technical questions
- **MCQ2_QUESTIONS**: 25 coding questions
- **MCQ3_QUESTIONS**: 10 English questions
- Helper functions:
  - `getQuestionsBySection(section)`: Returns questions for a section
  - `getSectionInfo(section)`: Returns section metadata (title, duration, count)

## Modified Files

### `/app/exam/environment/page.tsx`
- Added `useSearchParams` to read section from URL
- Replaced hardcoded questions with dynamic loading from question banks
- Updated header to show section-specific title
- Updated timer to use section-specific duration
- Questions now load based on URL parameter: `?section=mcq1|mcq2|mcq3`

## User Flow

1. **Start**: User navigates to `/exam/sections`
2. **Select Section**: User clicks on one of the 3 section cards
3. **Navigate**: Redirects to `/exam/environment?section=mcq1` (or mcq2/mcq3)
4. **Load Questions**: Page loads the appropriate question set
5. **Take Exam**: User completes the exam with:
   - Correct number of questions (25 or 10)
   - Correct duration (40, 45, or 15 minutes)
   - Video monitoring (consistent across all sections)
   - Violation tracking (consistent across all sections)

## Features Maintained

✅ Video monitoring window (right sidebar)
✅ Violation tracking (below video)
✅ Question palette (left sidebar)
✅ Question status tracking
✅ Mark for review functionality
✅ Navigation (Previous/Next)
✅ Timer with section-specific duration
✅ Submit exam functionality

## URL Structure

- Section Selection: `/exam/sections`
- MCQ 1 Exam: `/exam/environment?section=mcq1`
- MCQ 2 Exam: `/exam/environment?section=mcq2`
- MCQ 3 Exam: `/exam/environment?section=mcq3`

## Design Features

- **Professional UI**: Gradient headers, shadows, hover effects
- **Responsive**: Works on all screen sizes
- **Color-coded**: Each section has its own color scheme
  - MCQ 1: Blue to Cyan
  - MCQ 2: Purple to Pink
  - MCQ 3: Green to Teal
- **Clear Information**: Shows duration, question count, and description
- **Instructions**: Important exam rules displayed at bottom

## Next Steps (Optional Enhancements)

- Add progress tracking across sections
- Save section completion status
- Add section-specific results page
- Implement section navigation (return to selection)
- Add timer warnings specific to each section
