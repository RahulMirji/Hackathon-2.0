# Debug Guide - Why Am I Seeing Mock Questions?

## 🔍 How to Debug

### Step 1: Open Browser Console
1. Press `F12` or right-click → Inspect
2. Go to "Console" tab
3. Clear the console (trash icon)
4. Navigate to `/exam/coding`

### Step 2: Look for These Log Messages

#### ✅ **Success Path** (AI Questions):
```
🚀 [CODING PAGE] Starting to load questions...
📡 [CODING PAGE] Fetching from /api/generate-questions
📦 [CODING PAGE] Request body: {section: "coding", count: 2}
📥 [CODING PAGE] Response status: 200 OK
✅ [CODING PAGE] Reader obtained, starting to read stream...
📨 [CODING PAGE] Chunk 1: data: {"content":"[","buffer":"["}...
📊 [CODING PAGE] Parsed data: {hasContent: true, ...}
📝 [CODING PAGE] Buffer updated, length: 50
...
✅ [CODING PAGE] Questions received from AI!
📋 [CODING PAGE] Questions: [...]
🎉 [CODING PAGE] Successfully loaded AI questions!
```

#### ❌ **Failure Path** (Mock Questions):
```
🚀 [CODING PAGE] Starting to load questions...
📡 [CODING PAGE] Fetching from /api/generate-questions
❌ [CODING PAGE] API response not OK: 500
❌ [CODING PAGE] Failed to load questions from API: Error: API failed with status: 500
🔄 [CODING PAGE] Falling back to mock questions
📋 [CODING PAGE] Mock questions: [...]
✅ [CODING PAGE] Mock questions loaded
```

### Step 3: Check API Logs

Look for these in the console:

#### ✅ **API Success**:
```
🔵 [API] POST /api/generate-questions called
📦 [API] Request body: {section: "coding", count: 2}
💻 [API] Generating coding questions
📡 [API] Calling external AI API: https://vanchin.streamlake.ai/...
🔑 [API] Using model: ep-70wrsi-1759330065549240341
📥 [API] AI API response status: 200 OK
✅ [API] AI API response OK, starting stream...
🌊 [API] Stream started
📨 [API] Chunk 1: data: {"id":"...
📝 [API] Buffer length: 50
...
✅ [API] Successfully parsed questions: 2
📋 [API] Questions: [...]
📤 [API] Sent complete signal with questions
🔚 [API] Stream closed
```

#### ❌ **API Failure**:
```
🔵 [API] POST /api/generate-questions called
📡 [API] Calling external AI API: https://vanchin.streamlake.ai/...
📥 [API] AI API response status: 401 Unauthorized
❌ [API] AI API failed with status: 401
❌ [API] Top-level error: Error: API failed: 401
```

## 🐛 Common Issues

### Issue 1: API Returns 401 Unauthorized
**Cause**: Invalid or expired API key
**Solution**: Check your `.env.local` file and ensure `AI_API_KEY` is set correctly

### Issue 2: API Returns 404 Not Found
**Cause**: Wrong API URL or model name
**Solution**: Verify these values in your `.env.local` file:
```
AI_API_URL=https://your-api-url.com/v1/chat/completions
AI_MODEL=your-model-name
AI_API_KEY=your-api-key
```

### Issue 3: Stream Ends Without Questions
**Logs to look for**:
```
🏁 [API] Stream done after X chunks
⚠️ [CODING PAGE] Stream ended without questions
```
**Cause**: AI returned invalid JSON or no data
**Solution**: Check the buffer content in logs

### Issue 4: JSON Parse Error
**Logs to look for**:
```
❌ [API] Failed to parse final JSON: SyntaxError...
📄 [API] Buffer that failed: {...
```
**Cause**: AI returned malformed JSON
**Solution**: The buffer content will show what was received

### Issue 5: Network Error
**Logs to look for**:
```
❌ [CODING PAGE] Failed to load questions from API: TypeError: Failed to fetch
```
**Cause**: Network issue or CORS
**Solution**: Check network tab, verify API is accessible

## 🧪 Test API Directly

### Test 1: Check if API is reachable
```bash
# Load your environment variables first
source .env.local
curl -I "$AI_API_URL"
```
**Expected**: `HTTP/1.1 405 Method Not Allowed` (POST is required)

### Test 2: Test with actual request
```bash
# Use the provided test script
./test-ai-api.sh
```
**Expected**: JSON response with question

### Test 3: Test your Next.js API
```bash
curl -X POST http://localhost:3000/api/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"section": "coding", "count": 2}'
```
**Expected**: Streaming response with questions

## 📊 What Each Log Means

| Log | Meaning |
|-----|---------|
| 🚀 | Starting a process |
| 📡 | Making network request |
| 📦 | Request/response body |
| 📥 | Response received |
| ✅ | Success |
| ❌ | Error |
| ⚠️ | Warning |
| 🔄 | Fallback triggered |
| 📨 | Data chunk received |
| 📝 | Buffer updated |
| 📋 | Questions data |
| 🎉 | Complete success |
| 🌊 | Stream operation |
| 🏁 | Stream ended |
| 🔍 | Inspection/debug |
| 🧹 | Cleaning data |
| ✂️ | Removing markers |
| 📤 | Sending data |
| 🔚 | Process closed |

## 🎯 Quick Diagnosis

### Scenario 1: No logs at all
**Problem**: Page not loading or JavaScript error
**Check**: Browser console for errors

### Scenario 2: Logs stop at "Fetching from /api/generate-questions"
**Problem**: API route not responding
**Check**: Next.js server logs, verify route exists

### Scenario 3: Logs show "Response status: 500"
**Problem**: Server error in API route
**Check**: Next.js server terminal for error stack trace

### Scenario 4: Logs show "Stream ended without questions"
**Problem**: AI returned incomplete data
**Check**: Buffer content in logs, verify AI API is working

### Scenario 5: Logs show "Successfully loaded AI questions!" but still see mock
**Problem**: State not updating correctly
**Check**: React DevTools, verify `codingQuestions` state

## 🔧 Force AI Questions (For Testing)

If you want to bypass the API and test with hardcoded AI-like questions:

```typescript
// In app/exam/coding/page.tsx
const loadQuestionsWithStreaming = async () => {
  console.log("🧪 [TEST] Using hardcoded AI questions")
  
  const testQuestions = [
    {
      id: 1,
      title: "Test AI Question 1",
      description: "This is from AI (test)",
      // ... rest of question
    }
  ]
  
  setCodingQuestions(testQuestions)
  setIsLoadingQuestions(false)
}
```

## 📞 Need Help?

1. Copy all console logs
2. Check Network tab for failed requests
3. Check Next.js server terminal for errors
4. Share the logs for debugging

## ✅ Success Checklist

- [ ] Console shows "🚀 Starting to load questions"
- [ ] Console shows "📥 Response status: 200"
- [ ] Console shows "✅ Reader obtained"
- [ ] Console shows "📨 Chunk" messages
- [ ] Console shows "✅ Questions received from AI!"
- [ ] Console shows "🎉 Successfully loaded AI questions!"
- [ ] Questions displayed are NOT the default Two Sum/Reverse String

If all checked, you're getting AI questions! 🎊
