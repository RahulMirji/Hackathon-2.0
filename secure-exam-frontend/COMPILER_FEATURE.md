# Code Compiler Feature

## Overview
Professional code compiler integrated into the exam environment that supports Python, C, Java, and C++ code execution.

## Supported Languages

### 1. Python
- Runtime: Python 3
- Template includes function structure
- 4-space indentation (PEP 8 standard)

### 2. Java
- Compiler: javac
- Runtime: java
- Main class must be named `Main`
- Template includes main method

### 3. C++
- Compiler: g++
- Standard C++ compilation
- Template includes iostream and main function

### 4. C
- Compiler: gcc
- Standard C compilation
- Template includes stdio.h and main function

## Features

### Code Editor
- Line numbers
- Syntax-aware indentation
- Tab key support (2 spaces for C/C++/Java, 4 spaces for Python)
- Auto-indent on Enter key
- Dark theme (VS Code style)
- Monospace font for better readability

### Code Execution
- Real-time code execution
- 10-second timeout for safety
- 1MB output buffer limit
- Execution time tracking
- Error handling and display
- Secure temporary file handling
- Standard input support for test cases

### Test Case Validation
- **Automatic test case execution** for each question
- **Pass/Fail indicators** for each test case
- **Detailed error reporting** showing expected vs actual output
- **Multiple test cases** run sequentially
- **Visual feedback** with color-coded results (green for pass, red for fail)
- **Input/Output comparison** for debugging

### User Interface
- Language selector dropdown
- Run Code button with loading state
- Save Code functionality
- Output console with execution time
- Code templates for each language (question-specific)
- Professional exam environment layout
- Test results panel with expandable details

## API Endpoint

### POST `/api/execute-code`

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": ""
}
```

**Response (Success):**
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "executionTime": 45,
  "error": null
}
```

**Response (Error):**
```json
{
  "success": false,
  "output": "",
  "error": "SyntaxError: invalid syntax",
  "executionTime": 0
}
```

## Security Features

1. **Timeout Protection**: 10-second execution limit prevents infinite loops
2. **Buffer Limits**: 1MB output buffer prevents memory exhaustion
3. **Temporary Files**: All code runs in isolated temporary directories
4. **Automatic Cleanup**: Temp files are deleted after execution
5. **Language Validation**: Only supported languages are executed

## File Structure

```
app/
├── api/
│   └── execute-code/
│       └── route.ts          # Code execution API
└── exam/
    └── coding/
        └── page.tsx          # Coding exam page

components/
└── exam/
    └── code-editor.tsx       # Code editor component
```

## Usage in Exam

1. Student selects a programming language
2. Question-specific code template is automatically loaded
3. Student writes their solution
4. Click "Run Code" to execute all test cases
5. View test results with pass/fail status
6. See detailed error messages for failed test cases
7. Check execution time for performance
8. Save code periodically
9. Move to next question or submit when complete

## Test Case System

Each coding question includes:
- **Multiple test cases** with predefined inputs and expected outputs
- **Automatic validation** comparing student output with expected results
- **Detailed feedback** showing what went wrong

### Example: Two Sum Problem

**Test Cases:**
1. Input: `2,7,11,15` and `9` → Expected: `0 1`
2. Input: `3,2,4` and `6` → Expected: `1 2`
3. Input: `3,3` and `6` → Expected: `0 1`

**How it works:**
- Student code reads input from stdin
- Code processes the input
- Code prints output to stdout
- System compares output with expected result
- Shows ✓ or ✗ for each test case

## System Requirements

### Server Requirements
- Python 3.x installed
- Java JDK installed (javac and java)
- GCC compiler (gcc and g++)
- Node.js runtime

### Installation Commands

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 default-jdk gcc g++
```

**macOS:**
```bash
brew install python3 openjdk gcc
```

**Windows:**
- Install Python from python.org
- Install Java JDK from Oracle
- Install MinGW for GCC

## Testing

### Test Two Sum Problem

**Python Solution:**
```python
nums = list(map(int, input().split(',')))
target = int(input())

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
```

**Java Solution:**
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] numsStr = sc.nextLine().split(",");
        int[] nums = new int[numsStr.length];
        for (int i = 0; i < numsStr.length; i++) {
            nums[i] = Integer.parseInt(numsStr[i].trim());
        }
        int target = sc.nextInt();
        
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    System.out.println(i + " " + j);
                    return;
                }
            }
        }
        sc.close();
    }
}
```

**C++ Solution:**
```cpp
#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    vector<int> nums;
    stringstream ss(line);
    string num;
    while (getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    int target;
    cin >> target;
    
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                cout << i << " " << j << endl;
                return 0;
            }
        }
    }
    return 0;
}
```

### Test Reverse String Problem

**Python Solution:**
```python
s = input().strip()
print(s[::-1])
```

**Java Solution:**
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(new StringBuilder(s).reverse().toString());
        sc.close();
    }
}
```

## Future Enhancements

- [x] Multiple test case validation
- [x] Input/output testing
- [ ] Custom test cases (student-defined)
- [ ] Code submission history
- [ ] Syntax highlighting
- [ ] Code autocomplete
- [ ] Memory usage tracking
- [ ] Code quality metrics
- [ ] Plagiarism detection
- [ ] Support for more languages (JavaScript, Go, Rust, etc.)
- [ ] Hidden test cases (not visible to students)
- [ ] Partial credit for partially correct solutions
- [ ] Code complexity analysis

## Branch Information

**Branch Name:** `feature/exam-compiler`
**Base Branch:** `main`
**Status:** Ready for testing and review
