# AI Question Generation Integration Plan

## Overview
Integrate AI API to generate questions for all exam sections with streaming support and fallback to mock data.

## API Details
- **Endpoint:** `https://vanchin.streamlake.ai/api/gateway/v1/endpoints/chat/completions`
- **Model:** `ep-70wrsi-1759330065549240341`
- **API Key:** `l96uptiQdNqY461IFfwWQMcTyjN-kSYsVIPwT4hXlCg`

## Implementation Status

### ✅ Completed
1. **API Route** (`app/api/generate-questions/route.ts`)
   - Supports all sections: mcq1, mcq2, mcq3, coding
   - Streaming response
   - Proper error handling

2. **Mock Questions** (`lib/mock-questions.ts`)
   - MCQ1: 25 General & Technical questions
   - MCQ2: 25 Coding/Programming questions
   - MCQ3: 10 English questions
   - Coding: 2 Programming challenges
   - Helper function `getQuestionsBySection()`

3. **Question Service** (`lib/question-service.ts`)
   - `loadQuestionsWithStreaming()` - Load single section with progress
   - `loadAllSections()` - Load all sections in parallel
   - Automatic fallback to mock data on API failure

### 🔄 In Progress
4. **Coding Exam Page** (`app/exam/coding/page.tsx`)
   - Partially updated with streaming support
   - Needs completion

### ⏳ To Do
5. **Exam Environment Page** (`app/exam/environment/page.tsx`)
   - Update to use AI-generated questions
   - Add loading state
   - Show streaming progress

6. **Question Display Fix**
   - Fix code snippet display in MCQ2 questions
   - Ensure proper formatting

## Usage Examples

### Load Questions for Single Section
```typescript
import { loadQuestionsWithStreaming } from "@/lib/question-service"

const result = await loadQuestionsWithStreaming("mcq1", (content) => {
  console.log("Streaming:", content)
})

if (result.source === "ai") {
  console.log("Got AI questions:", result.questions)
} else {
  console.log("Using mock questions:", result.questions)
}
```

### Load All Sections
```typescript
import { loadAllSections } from "@/lib/question-service"

const allQuestions = await loadAllSections((section, content) => {
  console.log(`${section} progress:`, content)
})

console.log("MCQ1:", allQuestions.mcq1.questions)
console.log("MCQ2:", allQuestions.mcq2.questions)
console.log("MCQ3:", allQuestions.mcq3.questions)
console.log("Coding:", allQuestions.coding.questions)
```

## Question Formats

### MCQ Questions (mcq1, mcq2, mcq3)
```json
{
  "id": 1,
  "text": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "correctAnswer": "Paris",
  "type": "multiple-choice",
  "category": "General Knowledge",
  "codeSnippet": "optional code here"
}
```

### Coding Questions
```json
{
  "id": 1,
  "title": "Two Sum",
  "description": "Given an array...",
  "constraints": ["2 <= nums.length <= 10^4"],
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9"
    }
  ],
  "testCases": [
    {
      "input": "2,7,11,15\n9\n",
      "expectedOutput": "0 1"
    }
  ],
  "difficulty": "easy"
}
```

## Benefits

1. **Streaming**: Questions appear as they're generated
2. **Fallback**: Always works even if API fails
3. **Parallel Loading**: All sections load simultaneously
4. **Progress Tracking**: See generation progress in real-time
5. **Type Safety**: Full TypeScript support

## Next Steps

1. Complete coding page integration
2. Update exam environment page
3. Add loading indicators
4. Test with real API
5. Handle edge cases
6. Add caching (optional)

## Testing

### Test API Directly
```bash
curl https://vanchin.streamlake.ai/api/gateway/v1/endpoints/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer l96uptiQdNqY461IFfwWQMcTyjN-kSYsVIPwT4hXlCg" \
  -d '{
    "model": "ep-70wrsi-1759330065549240341",
    "messages": [
      {"role": "system", "content": "You are a question generator."},
      {"role": "user", "content": "Generate 2 coding questions in JSON format"}
    ],
    "temperature": 0.7,
    "stream": true
  }'
```

### Test in App
1. Navigate to `/exam/coding`
2. Watch console for streaming progress
3. Verify questions load
4. If API fails, verify mock questions appear

## Error Handling

- **API Timeout**: Falls back to mock after 30 seconds
- **Invalid JSON**: Retries parsing, then uses mock
- **Network Error**: Immediately uses mock
- **Empty Response**: Uses mock

## Performance

- **First Question**: Appears within 2-3 seconds
- **All Questions**: Complete within 10-15 seconds
- **Fallback**: Instant (mock data)
- **Caching**: Can be added for repeat visits
