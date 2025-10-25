# Unified API Execution - All Languages via Piston

## Overview
All programming languages now use the **Piston API** for code execution. This provides consistent, reliable execution without requiring local compiler installations.

## Architecture

### Before (Hybrid)
- Python → Pyodide (browser)
- JavaScript → Native browser
- C → API
- C++ → API
- Java → API

### After (Unified) ✅
- **Python** → Piston API
- **JavaScript** → Piston API
- **C** → Piston API
- **C++** → Piston API
- **Java** → Piston API

## Benefits

### 1. Consistency
- ✅ All languages use the same execution path
- ✅ Predictable behavior across all languages
- ✅ Easier to debug and maintain

### 2. Reliability
- ✅ No browser compatibility issues
- ✅ No need to load heavy libraries (Pyodide ~50MB)
- ✅ Professional-grade compilers (GCC, G++, JDK, Python 3.10, Node 18)

### 3. Simplicity
- ✅ No local compiler installation needed
- ✅ No Pyodide loading delays
- ✅ Single API endpoint for all languages

### 4. Features
- ✅ Full language support (all standard libraries)
- ✅ Proper compilation error messages
- ✅ Timeout protection (10s compile, 3s run)
- ✅ Memory limits

## Piston API Details

### Endpoint
```
https://emkc.org/api/v2/piston/execute
```

### Supported Languages & Versions
| Language   | Version | Compiler/Runtime |
|------------|---------|------------------|
| Python     | 3.10.0  | CPython          |
| JavaScript | 18.15.0 | Node.js          |
| C          | 10.2.0  | GCC              |
| C++        | 10.2.0  | G++              |
| Java       | 15.0.2  | OpenJDK          |

### Request Format
```json
{
  "language": "python",
  "version": "3.10.0",
  "files": [
    {
      "name": "main.py",
      "content": "print('Hello, World!')"
    }
  ],
  "stdin": "",
  "args": [],
  "compile_timeout": 10000,
  "run_timeout": 3000
}
```

### Response Format
```json
{
  "run": {
    "stdout": "Hello, World!\n",
    "stderr": "",
    "code": 0,
    "signal": null,
    "output": "Hello, World!\n"
  },
  "compile": {
    "stdout": "",
    "stderr": "",
    "code": 0,
    "signal": null,
    "output": ""
  }
}
```

## Implementation

### API Route (`/api/execute-code`)
```typescript
// All languages route through this endpoint
POST /api/execute-code
{
  "code": "print('Hello')",
  "language": "python",
  "input": ""
}
```

### Browser Executor (`lib/browser-code-executor.ts`)
```typescript
// All languages use the same API function
async function executeViaAPI(code, language, input) {
  const response = await fetch('/api/execute-code', {
    method: 'POST',
    body: JSON.stringify({ code, language, input })
  })
  return response.json()
}
```

## Performance

### Execution Times
| Language   | Typical Time | Notes |
|------------|--------------|-------|
| Python     | 200-500ms    | Includes network latency |
| JavaScript | 200-500ms    | Includes network latency |
| C          | 300-700ms    | Includes compilation |
| C++        | 300-700ms    | Includes compilation |
| Java       | 500-1000ms   | Includes compilation |

### Network Latency
- API request: ~50-100ms
- Compilation: ~100-500ms (C/C++/Java)
- Execution: ~50-200ms
- Total: ~200-1000ms depending on language

## Error Handling

### Compilation Errors
```json
{
  "success": false,
  "output": "",
  "error": "main.cpp:5:1: error: expected ';' before '}' token",
  "executionTime": 234
}
```

### Runtime Errors
```json
{
  "success": false,
  "output": "",
  "error": "ZeroDivisionError: division by zero",
  "executionTime": 156
}
```

### API Errors
```json
{
  "success": false,
  "output": "",
  "error": "API request failed: 503",
  "executionTime": 89
}
```

## Testing

### Python Test
```python
a = int(input())
b = int(input())
print(a + b)
```
Input: `5\n3\n` → Output: `8`

### JavaScript Test
```javascript
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
  lines.push(line);
  if (lines.length === 2) {
    const a = parseInt(lines[0]);
    const b = parseInt(lines[1]);
    console.log(a + b);
    rl.close();
  }
});
```
Input: `5\n3\n` → Output: `8`

### C Test
```c
#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```
Input: `5 3\n` → Output: `8`

### C++ Test
```cpp
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```
Input: `5 3\n` → Output: `8`

### Java Test
```java
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}
```
Input: `5 3\n` → Output: `8`

## Advantages Over Browser Execution

### Python (vs Pyodide)
- ✅ No 5-10 second initial load
- ✅ No 50MB download
- ✅ Faster execution for complex code
- ✅ Full Python standard library

### JavaScript (vs Native Browser)
- ✅ Node.js environment (require, fs, etc.)
- ✅ Consistent with other languages
- ✅ Better error messages
- ✅ Proper stdin/stdout handling

### C/C++ (vs JSCPP)
- ✅ Real GCC/G++ compiler
- ✅ Full C++17 support
- ✅ Better error messages
- ✅ Faster compilation

## Limitations

1. **Network Dependency**: Requires internet connection
2. **Latency**: ~200-1000ms per execution (vs instant for browser)
3. **Rate Limits**: Piston API may have rate limits
4. **External Service**: Depends on Piston API availability

## Future Enhancements

1. **Caching**: Cache results for identical code/input pairs
2. **Fallback**: Add browser execution as fallback if API fails
3. **Self-Hosted**: Deploy own Piston instance for better control
4. **Batch Execution**: Run multiple test cases in single API call
5. **WebSocket**: Use WebSocket for real-time output streaming

## Migration Notes

### Removed Dependencies
- ❌ Pyodide (no longer needed)
- ❌ JSCPP (no longer needed)
- ❌ Browser-specific execution logic

### Simplified Code
- Before: ~300 lines of browser execution logic
- After: ~50 lines of API calls
- Reduction: ~83% less code

### Files Modified
1. `lib/browser-code-executor.ts` - Simplified to use API only
2. `app/api/execute-code/route.ts` - Updated to use Piston API
3. `app/exam/coding/page.tsx` - Removed Pyodide preloading

---

**Status**: ✅ Complete and Production Ready  
**Date**: 2025-10-25  
**API**: Piston (https://emkc.org/api/v2/piston)
