# Browser Code Executor Guide

## Overview
The browser code executor now supports **5 programming languages** with full test case execution:

- ✅ **Python** - via Pyodide (Python in WebAssembly) - **Browser**
- ✅ **JavaScript** - Native browser execution - **Browser**
- ✅ **C** - via API (GCC compiler) - **Server**
- ✅ **C++** - via API (G++ compiler) - **Server**
- ✅ **Java** - via API (JDK compiler) - **Server**

## Features

### 1. Direct Code Execution
```typescript
import { executeCode } from '@/lib/browser-code-executor'

const result = await executeCode(
  'print("Hello, World!")',  // code
  'python',                   // language
  ''                          // input (optional)
)

console.log(result.output)      // "Hello, World!"
console.log(result.success)     // true
console.log(result.executionTime) // 45 (ms)
```

### 2. Test Case Execution
```typescript
import { executeWithTestCases } from '@/lib/browser-code-executor'

const testCases = [
  { input: '5\n3\n', expectedOutput: '8' },
  { input: '10\n20\n', expectedOutput: '30' },
]

const result = await executeWithTestCases(
  code,
  'python',
  testCases
)

console.log(result.testResults)
// [
//   { passed: true, input: '5\n3\n', expectedOutput: '8', actualOutput: '8' },
//   { passed: true, input: '10\n20\n', expectedOutput: '30', actualOutput: '30' }
// ]
```

### 3. Language Support Check
```typescript
import { isLanguageSupported, getSupportedLanguages } from '@/lib/browser-code-executor'

console.log(getSupportedLanguages())
// ['Python', 'JavaScript', 'C', 'C++', 'Java']

console.log(isLanguageSupported('python'))  // true
console.log(isLanguageSupported('rust'))    // false
```

## Language-Specific Details

### Python
- **Runtime**: Pyodide (Python 3.11 in WebAssembly)
- **Input**: Use `input()` function
- **Output**: Use `print()` function
- **Loading**: Auto-loads on first use (~5-10 seconds initial load)

```python
# Example: Sum two numbers
a = int(input())
b = int(input())
print(a + b)
```

### JavaScript
- **Runtime**: Native browser JavaScript
- **Input**: Use `readline()` function
- **Output**: Use `console.log()`
- **Loading**: Instant (no external dependencies)

```javascript
// Example: Sum two numbers
const a = parseInt(readline())
const b = parseInt(readline())
console.log(a + b)
```

### C
- **Runtime**: Server-side via API (GCC compiler)
- **Input**: Use `scanf()`
- **Output**: Use `printf()`
- **Execution**: Sent to server for compilation and execution

```c
#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```

### C++
- **Runtime**: Server-side via API (G++ compiler)
- **Input**: Use `cin`
- **Output**: Use `cout`
- **Execution**: Sent to server for compilation and execution

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

### Java
- **Runtime**: Server-side via API (JDK compiler)
- **Input**: Use `Scanner`
- **Output**: Use `System.out.println()`
- **Execution**: Sent to server for compilation and execution

```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}
```

## Performance

| Language   | Execution Location | Initial Load | Execution Speed | Notes |
|------------|-------------------|--------------|-----------------|-------|
| Python     | Browser           | ~5-10s       | Fast            | ~50MB memory |
| JavaScript | Browser           | Instant      | Very Fast       | Minimal memory |
| C          | Server (API)      | N/A          | Fast            | Network latency |
| C++        | Server (API)      | N/A          | Fast            | Network latency |
| Java       | Server (API)      | N/A          | Fast            | Network latency |

## Error Handling

All execution functions return a consistent result format:

```typescript
interface ExecutionResult {
  success: boolean          // Whether execution succeeded
  output: string           // Program output
  error: string | null     // Error message if failed
  executionTime: number    // Execution time in milliseconds
  testResults?: TestResult[] // Test results (if using executeWithTestCases)
}
```

## Best Practices

1. **Preload Runtimes**: For Python, preload Pyodide when the page loads:
   ```typescript
   import { loadPyodide } from '@/lib/browser-code-executor'
   
   useEffect(() => {
     loadPyodide() // Preload in background
   }, [])
   ```

2. **Handle Loading States**: Show loading indicators during runtime initialization

3. **Timeout Protection**: Implement timeouts for long-running code:
   ```typescript
   const timeout = setTimeout(() => {
     // Handle timeout
   }, 30000) // 30 seconds
   
   const result = await executeCode(code, language, input)
   clearTimeout(timeout)
   ```

4. **Input Sanitization**: Always sanitize test inputs:
   ```typescript
   const sanitizedInput = input.endsWith('\n') ? input : input + '\n'
   ```

## Troubleshooting

### Python not loading
- Check browser console for Pyodide errors
- Ensure CDN is accessible: `https://cdn.jsdelivr.net/pyodide/v0.24.1/full/`
- Try clearing browser cache

### C/C++/Java compilation errors
- Requires server-side compilers (GCC, G++, JDK)
- Check that the server has the necessary compilers installed
- Network issues may cause execution failures
- Compilation errors will be returned in the error field

### JavaScript execution issues
- Avoid using Node.js-specific APIs (fs, http, etc.)
- Use `readline()` instead of `require('readline')`
- Browser security restrictions apply

## Migration from Server-Side Execution

If you're migrating from server-side execution:

1. Update imports:
   ```typescript
   // Old
   import { executeCode } from '@/lib/code-executor'
   
   // New
   import { executeCode } from '@/lib/browser-code-executor'
   ```

2. API remains the same - no code changes needed!

3. For Java, it automatically falls back to server-side execution

## Future Enhancements

- [ ] Add support for more languages (Rust, Go, etc.)
- [ ] Implement execution timeouts
- [ ] Add memory limit controls
- [ ] Support for file I/O operations
- [ ] Better Java browser support via GraalVM WASM
