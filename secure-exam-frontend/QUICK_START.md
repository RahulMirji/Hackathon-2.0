# Quick Start Guide

## 🚀 Run the Application

```bash
npm run dev
```

Then navigate to: `http://localhost:3000/exam/coding`

## 📝 Test the Features

### 1. Test Code Compiler (Python - Two Sum)
```python
nums = list(map(int, input().split(',')))
target = int(input())

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
```
**Expected**: ✓ All test cases passed! (3/3)

### 2. Test Code Compiler (Python - Reverse String)
```python
s = input().strip()
print(s[::-1])
```
**Expected**: ✓ All test cases passed! (3/3)

### 3. Test AI Question Loading
- Open browser console (F12)
- Navigate to `/exam/coding`
- Watch for: "Loading questions..." → Questions appear
- If API fails: Mock questions load automatically

## 🔍 Check What's Working

### Verify Compiler Installation:
```bash
python3 --version  # Should show Python 3.x
javac -version     # Should show Java version
g++ --version      # Should show GCC version
gcc --version      # Should show GCC version
```

### Test API Directly:
```bash
curl https://vanchin.streamlake.ai/api/gateway/v1/endpoints/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer l96uptiQdNqY461IFfwWQMcTyjN-kSYsVIPwT4hXlCg" \
  -d '{
    "model": "ep-70wrsi-1759330065549240341",
    "messages": [
      {"role": "system", "content": "Generate questions"},
      {"role": "user", "content": "Generate 1 coding question"}
    ],
    "temperature": 0.7,
    "stream": false
  }'
```

## 🎯 Key URLs

- **Coding Exam**: `/exam/coding`
- **MCQ Sections**: `/exam/sections`
- **MCQ 1**: `/exam/environment?section=mcq1`
- **MCQ 2**: `/exam/environment?section=mcq2`
- **MCQ 3**: `/exam/environment?section=mcq3`

## 📊 What to Expect

### On Page Load:
1. Shows "Loading Questions..." with spinner
2. Streams content from AI (or uses mock)
3. First question appears within 2-3 seconds
4. All questions loaded within 10-15 seconds

### When Running Code:
1. Click "Run Test Cases"
2. Shows "Running test cases..."
3. Each test case executes (< 1 second each)
4. Results appear with ✓ or ✗
5. Failed tests show expected vs actual output

## 🐛 Troubleshooting

### Issue: "Loading Questions..." never finishes
**Solution**: API might be down, check console for errors. Mock data should load automatically.

### Issue: "Error: Please write some code"
**Solution**: The editor is empty. Write or paste code first.

### Issue: All test cases fail with empty output
**Solution**: Code has no print statement or runtime error. Check error message.

### Issue: Compiler not found
**Solution**: Install missing compiler:
```bash
# macOS
brew install python3 openjdk gcc

# Ubuntu/Debian
sudo apt install python3 default-jdk gcc g++
```

## 📚 Documentation

- **Full Details**: `FINAL_IMPLEMENTATION_SUMMARY.md`
- **Compiler Info**: `COMPILER_FEATURE.md`
- **Student Guide**: `CODING_EXAM_GUIDE.md`
- **Debugging**: `COMPILER_TROUBLESHOOTING.md`
- **AI Integration**: `AI_INTEGRATION_PLAN.md`

## ✅ Success Indicators

You'll know it's working when:
- ✓ Page loads without errors
- ✓ Questions appear (AI or mock)
- ✓ Code editor shows template
- ✓ Language selector works
- ✓ "Run Test Cases" executes code
- ✓ Test results show pass/fail
- ✓ Execution time displays

## 🎉 You're Ready!

Everything is set up and working. Start coding!
