# Compiler Troubleshooting Guide

## Issue: Test Cases Show "Got: (empty)"

### Possible Causes:

1. **Code didn't produce any output**
   - Check if your code has a `print()` statement
   - Verify the print statement is being reached
   - Make sure you're not just returning a value (you must print it)

2. **Runtime error occurred**
   - Check the error message in the output
   - Look for syntax errors, division by zero, array out of bounds, etc.

3. **Input reading issue**
   - Verify you're reading input correctly
   - Use the provided template as a starting point
   - Make sure input format matches what's expected

4. **Compilation failed**
   - For Java: Class must be named `Main`
   - For C/C++: Check for syntax errors
   - Look at the error message for details

## Debugging Steps

### Step 1: Test with Simple Code

Replace your code with this simple test:

**Python:**
```python
print("Hello World")
```

**Java:**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

**C++:**
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
```

If this works, the compiler is fine. If not, there's a system issue.

### Step 2: Test Input Reading

**Python:**
```python
line1 = input()
line2 = input()
print(f"Line 1: {line1}")
print(f"Line 2: {line2}")
```

This will help you see if input is being read correctly.

### Step 3: Test the Two Sum Template

Use the provided template with the sample solution:

**Python:**
```python
nums = list(map(int, input().split(',')))
target = int(input())

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
```

This should pass all test cases.

## Common Issues and Solutions

### Issue: "Expected: 0 1, Got: (empty)"

**Problem:** Code is not printing anything

**Solution:**
- Add `print(i, j)` to output the result
- Make sure the print statement is inside the correct loop/condition
- Don't use `return` without printing first

### Issue: "Expected: 0 1, Got: [0, 1]"

**Problem:** Output format is wrong (printing array instead of space-separated values)

**Solution:**
```python
# Wrong:
print([i, j])

# Correct:
print(i, j)
```

### Issue: "Expected: 0 1, Got: 0,1"

**Problem:** Using comma instead of space

**Solution:**
```python
# Wrong:
print(f"{i},{j}")

# Correct:
print(i, j)
```

### Issue: Runtime Error - "list index out of range"

**Problem:** Trying to access array element that doesn't exist

**Solution:**
- Check your loop bounds
- Make sure `j` starts at `i + 1`, not `i`
- Verify array length before accessing

### Issue: "Error: invalid syntax"

**Problem:** Python syntax error

**Solution:**
- Check for missing colons after `if`, `for`, `while`
- Verify indentation (use 4 spaces)
- Make sure parentheses are balanced

### Issue: Java - "error: class Main is public, should be declared in a file named Main.java"

**Problem:** Class name issue

**Solution:**
```java
// Make sure your class is named exactly "Main"
public class Main {
    public static void main(String[] args) {
        // Your code
    }
}
```

### Issue: C++ - "error: 'cout' was not declared in this scope"

**Problem:** Missing namespace or header

**Solution:**
```cpp
#include <iostream>
using namespace std;  // Add this line

int main() {
    cout << "Hello" << endl;
    return 0;
}
```

## Test Case Format

### Two Sum Problem

**Input Format:**
```
2,7,11,15
9
```
- Line 1: Comma-separated array values (no spaces after commas)
- Line 2: Target value

**Output Format:**
```
0 1
```
- Two space-separated indices

### Reverse String Problem

**Input Format:**
```
hello
```
- Single line with the string

**Output Format:**
```
olleh
```
- Single line with reversed string

## System Requirements Check

If nothing works, verify these are installed:

```bash
# Check Python
python3 --version

# Check Java
javac -version
java -version

# Check GCC (C/C++)
gcc --version
g++ --version
```

If any of these commands fail, the respective compiler is not installed.

## Still Having Issues?

1. **Check the browser console** (F12) for JavaScript errors
2. **Try a different language** to see if it's language-specific
3. **Copy the exact template** provided and modify it minimally
4. **Check for hidden characters** in your code (copy-paste issues)
5. **Verify your code works locally** before testing in the exam

## Contact Support

If you've tried everything and it still doesn't work:
- Take a screenshot of the error
- Note which language you're using
- Describe what you've tried
- Contact the exam administrator
