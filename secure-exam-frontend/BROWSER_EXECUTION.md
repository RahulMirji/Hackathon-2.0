# Browser-Based Code Execution

This exam platform now uses **browser-based code execution** that doesn't require any programming languages to be installed on the server or client machine.

## Supported Languages

### Python (via Pyodide)
- Runs Python 3.11 in WebAssembly
- Full standard library support
- No server-side Python installation needed
- First run may take 5-10 seconds to load Pyodide

### JavaScript
- Native browser execution
- Instant execution
- Full ES6+ support

## How It Works

1. **Python Execution**: Uses [Pyodide](https://pyodide.org/), which compiles Python to WebAssembly
   - Loads on-demand when Python is selected
   - Cached after first load
   - Runs entirely in the browser

2. **JavaScript Execution**: Uses native browser JavaScript engine
   - Sandboxed execution
   - Instant startup
   - No external dependencies

## Benefits

✅ **No Installation Required**: Students don't need Python, Java, or any compiler installed
✅ **Cross-Platform**: Works on Windows, Mac, Linux without any setup
✅ **Secure**: Code runs in browser sandbox, isolated from system
✅ **Fast**: After initial load, execution is instant
✅ **Offline Capable**: Once loaded, works without internet (except first load)

## Technical Details

### Input/Output Handling

**Python:**
```python
# Reading input
line = input()  # Reads one line
number = int(input())  # Reads and converts to int

# Writing output
print("Hello World")
print(result)
```

**JavaScript:**
```javascript
// Reading input
const line = input();  // Reads one line
const number = parseInt(input());  // Reads and converts to number

// Writing output
console.log("Hello World");
console.log(result);
```

### Test Case Execution

- Each test case runs independently
- Input is provided via stdin simulation
- Output is captured and compared with expected results
- Execution time is measured for each test

## Future Enhancements

Potential additions:
- C/C++ via Emscripten
- Java via CheerpJ
- More language support as WebAssembly compilers become available
