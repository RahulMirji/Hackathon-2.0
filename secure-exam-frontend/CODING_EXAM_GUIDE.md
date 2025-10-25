# Coding Exam Guide for Students

## How to Use the Compiler

### Step 1: Select Your Language
Choose from Python, Java, C++, or C using the dropdown menu at the top of the code editor.

### Step 2: Write Your Code
A template will be provided for each question. Read the input as specified and print your output.

### Step 3: Run Test Cases
Click the "Run Code" button to execute all test cases. The system will:
- Run your code against multiple test cases
- Show you which test cases passed (✓) or failed (✗)
- Display execution time
- Show detailed error messages if any test fails

### Step 4: Debug Failed Tests
If a test case fails, you'll see:
- **Input**: What was given to your program
- **Expected**: What the correct output should be
- **Got**: What your program actually output

### Step 5: Submit
Once all test cases pass, click "Next Question" or "Submit" to proceed.

---

## Question 1: Two Sum

### Problem
Given an array of integers and a target, return the indices of two numbers that add up to the target.

### Input Format
- Line 1: Comma-separated integers (the array)
- Line 2: Target integer

### Output Format
Print two space-separated indices (0-indexed)

### Example

**Input:**
```
2,7,11,15
9
```

**Output:**
```
0 1
```

**Explanation:** nums[0] + nums[1] = 2 + 7 = 9

### Python Template
```python
nums = list(map(int, input().split(',')))
target = int(input())

# Your solution here
# Print: index1 index2
```

### Java Template
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
        
        // Your solution here
        // Print: index1 index2
        
        sc.close();
    }
}
```

### C++ Template
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
    
    // Your solution here
    // Print: index1 index2
    
    return 0;
}
```

### Sample Solution (Python)
```python
nums = list(map(int, input().split(',')))
target = int(input())

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
```

---

## Question 2: Reverse String

### Problem
Reverse a given string.

### Input Format
A single line containing the string to reverse

### Output Format
Print the reversed string

### Example

**Input:**
```
hello
```

**Output:**
```
olleh
```

### Python Template
```python
s = input().strip()

# Your solution here
# Print the reversed string
```

### Java Template
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        
        // Your solution here
        // Print the reversed string
        
        sc.close();
    }
}
```

### C++ Template
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    
    // Your solution here
    // Print the reversed string
    
    return 0;
}
```

### Sample Solution (Python)
```python
s = input().strip()
print(s[::-1])
```

---

## Tips for Success

### 1. Read Input Correctly
- Make sure you read input in the exact format specified
- Use the provided template as a starting point
- Test with the example inputs first

### 2. Print Output Exactly
- Match the expected output format exactly
- No extra spaces or newlines unless specified
- Check for trailing spaces

### 3. Handle Edge Cases
- Empty inputs
- Single element arrays
- Large numbers
- Special characters

### 4. Test Before Submitting
- Run your code multiple times
- Make sure all test cases pass
- Check execution time (should be under 10 seconds)

### 5. Common Mistakes to Avoid
- ❌ Printing extra debug statements
- ❌ Wrong output format (e.g., "0,1" instead of "0 1")
- ❌ Not handling all test cases
- ❌ Infinite loops or very slow algorithms
- ❌ Reading input incorrectly

### 6. Language-Specific Tips

**Python:**
- Use `input()` to read lines
- Use `split()` to parse comma-separated values
- Remember to convert strings to integers with `int()`

**Java:**
- Use `Scanner` for input
- Remember to close the scanner
- Use `trim()` to remove whitespace
- Main class must be named `Main`

**C++:**
- Use `getline()` for reading lines
- Use `stringstream` for parsing
- Remember to include necessary headers

**C:**
- Use `fgets()` for reading lines
- Use `strtok()` for parsing
- Remember to handle newline characters

---

## Troubleshooting

### "Error: Compilation failed"
- Check for syntax errors
- Make sure class name is `Main` (Java)
- Verify all brackets and semicolons

### "Test Case Failed"
- Compare your output with expected output
- Check for extra spaces or newlines
- Verify you're reading input correctly

### "Timeout Error"
- Your code is taking too long (>10 seconds)
- Optimize your algorithm
- Avoid nested loops if possible

### "Runtime Error"
- Check for division by zero
- Verify array bounds
- Handle null/empty inputs

---

## Good Luck!

Remember:
- ✓ Read the problem carefully
- ✓ Use the provided templates
- ✓ Test with example inputs
- ✓ Make sure all test cases pass
- ✓ Submit when ready
