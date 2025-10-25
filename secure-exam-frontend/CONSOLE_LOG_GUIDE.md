# Console Log Guide - What You Should See

## 🎯 Expected Console Output

When you navigate to `/exam/coding`, you should see these logs in order:

### 1. Page Load
```
🚀 [CODING PAGE] Starting to load questions...
📡 [CODING PAGE] Fetching from /api/generate-questions
📦 [CODING PAGE] Request body: {section: "coding", count: 2}
```

### 2. API Route Receives Request
```
🔵 [API] POST /api/generate-questions called
📦 [API] Request body: {section: "coding", count: 2}
💻 [API] Generating coding questions
📡 [API] Calling external AI API: https://vanchin.streamlake.ai/...
🔑 [API] Using model: ep-70wrsi-1759330065549240341
```

### 3. AI API Response
```
📥 [API] AI API response status: 200 OK
✅ [API] AI API response OK, starting stream...
🌊 [API] Stream started
```

### 4. Streaming Data
```
📨 [API] Chunk 1: data: {"id":"...
📝 [API] Buffer length: 50
📨 [API] Chunk 2: data: {"id":"...
📝 [API] Buffer length: 150
...
```

### 5. Parsing Complete
```
🏁 [API] Stream done after 10 chunks
🔍 [API] Final buffer length: 1500
📄 [API] Final buffer: [{"id":1,"title":"Two Sum"...
🧹 [API] Cleaning buffer...
🔍 [API] Parsing JSON...
✅ [API] Successfully parsed questions: 2
📋 [API] Questions: [...]
📤 [API] Sent complete signal with questions
🔚 [API] Stream closed
```

### 6. Client Receives Questions
```
📥 [CODING PAGE] Response status: 200 OK
✅ [CODING PAGE] Reader obtained, starting to read stream...
📨 [CODING PAGE] Chunk 1: data: {"content":"[","buffer":"["}...
📊 [CODING PAGE] Parsed data: {hasContent: true, hasComplete: false, ...}
📝 [CODING PAGE] Buffer updated, length: 50
...
📊 [CODING PAGE] Parsed data: {hasContent: false, hasComplete: true, hasQuestions: true, questionsCount: 2}
✅ [CODING PAGE] Questions received from AI!
📋 [CODING PAGE] Questions: [...]
🎉 [CODING PAGE] Successfully loaded AI questions!
```

### 7. Template Loading
```
📝 [CODING PAGE] Setting code template for question 1
```

## ❌ Error Scenarios

### Scenario 1: API Key Invalid
```
🔵 [API] POST /api/generate-questions called
📡 [API] Calling external AI API: https://vanchin.streamlake.ai/...
📥 [API] AI API response status: 401 Unauthorized
❌ [API] AI API failed with status: 401
❌ [API] Top-level error: Error: API failed: 401
```
**Fix**: Check API key in `app/api/generate-questions/route.ts`

### Scenario 2: Network Error
```
🚀 [CODING PAGE] Starting to load questions...
📡 [CODING PAGE] Fetching from /api/generate-questions
❌ [CODING PAGE] Failed to load questions from API: TypeError: Failed to fetch
🔄 [CODING PAGE] Falling back to mock questions
```
**Fix**: Check internet connection, verify API URL

### Scenario 3: Invalid JSON from AI
```
🏁 [API] Stream done after 5 chunks
🔍 [API] Final buffer length: 500
📄 [API] Final buffer: This is not valid JSON...
🧹 [API] Cleaning buffer...
🔍 [API] Parsing JSON...
❌ [API] Failed to parse final JSON: SyntaxError: Unexpected token T
📄 [API] Buffer that failed: This is not valid JSON...
```
**Fix**: AI returned text instead of JSON - check prompt

### Scenario 4: Questions Not Loading (Template Error)
```
✅ [CODING PAGE] Questions received from AI!
⚠️ [CODING PAGE] getCodeTemplate called but no questions loaded yet
```
**Fix**: Race condition - questions state not updated yet

## 🔍 What You're Seeing

Based on your logs, you only saw:
```
[Vercel Web Analytics] logs...
```

This means:
1. ❌ No "🚀 Starting to load questions" - useEffect not running
2. ❌ No API calls being made
3. ❌ Questions not being loaded

## 🐛 Your Specific Error

```
Cannot read properties of undefined (reading 'id')
at getCodeTemplate (app/exam/coding/page.tsx:223:18)
```

This means:
- `codingQuestions[currentQuestion]` is `undefined`
- `getCodeTemplate` is being called before questions load
- The useEffect is running too early

## ✅ Fix Applied

I've added these safety checks:

1. **In getCodeTemplate**:
```typescript
if (!codingQuestions || codingQuestions.length === 0) {
  return ""
}
if (!question) {
  return ""
}
```

2. **In useEffect**:
```typescript
useEffect(() => {
  if (codingQuestions && codingQuestions.length > 0) {
    setCode(getCodeTemplate(selectedLanguage))
  }
}, [currentQuestion, codingQuestions, selectedLanguage])
```

## 🧪 Test Again

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Open console** (F12)
4. **Navigate to** `/exam/coding`
5. **Look for** the 🚀 emoji logs

## 📊 What to Share

If still not working, share:
1. All console logs (copy everything)
2. Network tab (check if `/api/generate-questions` is called)
3. Any error messages in red

## 🎯 Success Indicators

You'll know it's working when you see:
- ✅ 🚀 Starting to load questions
- ✅ 🔵 POST /api/generate-questions called
- ✅ 📨 Multiple chunk messages
- ✅ ✅ Questions received from AI!
- ✅ 🎉 Successfully loaded AI questions!
- ✅ Questions displayed are NOT "Two Sum" and "Reverse String"

## 🔄 If Still Seeing Mock Questions

The logs will tell you exactly why:
- **401/403**: API key issue
- **404**: Wrong URL
- **500**: Server error
- **Network error**: Connection issue
- **Parse error**: Invalid JSON from AI
- **No logs**: useEffect not running (check React DevTools)
