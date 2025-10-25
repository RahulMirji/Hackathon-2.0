export interface MCQQuestion {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  type: "multiple-choice"
  category?: string
  codeSnippet?: string
}

export interface CodingQuestion {
  id: number
  title: string
  description: string
  constraints: string[]
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
  difficulty: "easy" | "medium" | "hard"
  codeSnippet?: string
}

// MCQ1: General & Technical Questions
export const MOCK_MCQ1_QUESTIONS: MCQQuestion[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  text: i < 5 ? [
    "What is the capital of France?",
    "Which planet is known as the Red Planet?",
    "What is the largest ocean on Earth?",
    "Who developed the theory of relativity?",
    "What is the chemical symbol for gold?"
  ][i] : `General/Technical Question ${i + 1}?`,
  options: i < 5 ? [
    ["London", "Paris", "Berlin", "Madrid"],
    ["Venus", "Mars", "Jupiter", "Saturn"],
    ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Nikola Tesla"],
    ["Go", "Gd", "Au", "Ag"]
  ][i] : ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: i < 5 ? ["Paris", "Mars", "Pacific Ocean", "Albert Einstein", "Au"][i] : "Option A",
  type: "multiple-choice",
  category: "General Knowledge"
}))

// MCQ2: Coding Questions
export const MOCK_MCQ2_QUESTIONS: MCQQuestion[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  text: i < 5 ? [
    "Which of the following is a programming language?",
    "What does 'OOP' stand for in programming?",
    "Which data structure uses LIFO (Last In First Out)?",
    "What is the time complexity of binary search?",
    "Which keyword is used to define a function in Python?"
  ][i] : `Coding Question ${i + 1}: What is the output of the following code?`,
  options: i < 5 ? [
    ["Python", "HTML", "CSS", "All of the above"],
    ["Object-Oriented Programming", "Open-Output Protocol", "Operational Optimization Process", "Organized Object Procedure"],
    ["Queue", "Stack", "Array", "Linked List"],
    ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    ["function", "def", "func", "define"]
  ][i] : ["Output A", "Output B", "Output C", "Output D"],
  correctAnswer: i < 5 ? ["Python", "Object-Oriented Programming", "Stack", "O(log n)", "def"][i] : "Output A",
  type: "multiple-choice",
  category: "Programming",
  codeSnippet: i >= 5 ? `x = ${i}\nprint(x * 2)` : undefined
}))

// MCQ3: English Questions
export const MOCK_MCQ3_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    text: "Choose the correct synonym for 'Happy':",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correctAnswer: "Joyful",
    type: "multiple-choice",
    category: "Vocabulary"
  },
  {
    id: 2,
    text: "Identify the noun in the sentence: 'The cat sat on the mat.'",
    options: ["sat", "cat", "on", "the"],
    correctAnswer: "cat",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 3,
    text: "Which sentence is grammatically correct?",
    options: [
      "She don't like apples",
      "She doesn't likes apples",
      "She doesn't like apples",
      "She not like apples"
    ],
    correctAnswer: "She doesn't like apples",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 4,
    text: "What is the past tense of 'run'?",
    options: ["runned", "ran", "running", "runs"],
    correctAnswer: "ran",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 5,
    text: "Choose the correct article: '___ apple a day keeps the doctor away.'",
    options: ["A", "An", "The", "No article"],
    correctAnswer: "An",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 6,
    text: "What is the antonym of 'difficult'?",
    options: ["Hard", "Easy", "Complex", "Tough"],
    correctAnswer: "Easy",
    type: "multiple-choice",
    category: "Vocabulary"
  },
  {
    id: 7,
    text: "Identify the verb in: 'The dog barks loudly.'",
    options: ["dog", "barks", "loudly", "the"],
    correctAnswer: "barks",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 8,
    text: "Which word is spelled correctly?",
    options: ["Recieve", "Receive", "Recive", "Receeve"],
    correctAnswer: "Receive",
    type: "multiple-choice",
    category: "Spelling"
  },
  {
    id: 9,
    text: "What type of sentence is this: 'Please close the door.'",
    options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],
    correctAnswer: "Imperative",
    type: "multiple-choice",
    category: "Grammar"
  },
  {
    id: 10,
    text: "Choose the correct preposition: 'She is good ___ mathematics.'",
    options: ["in", "at", "on", "with"],
    correctAnswer: "at",
    type: "multiple-choice",
    category: "Grammar"
  }
]

// Coding Questions
export const MOCK_CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists"
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]"
      }
    ],
    testCases: [
      { input: "2,7,11,15\n9\n", expectedOutput: "0 1" },
      { input: "3,2,4\n6\n", expectedOutput: "1 2" },
      { input: "3,3\n6\n", expectedOutput: "0 1" }
    ],
    difficulty: "easy",
    codeSnippet: `def twoSum(nums, target):
    # Your code here
    pass`
  },
  {
    id: 2,
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as a string.",
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character"
    ],
    examples: [
      {
        input: 's = "hello"',
        output: '"olleh"',
        explanation: "The string is reversed"
      },
      {
        input: 's = "Hannah"',
        output: '"hannaH"',
        explanation: "The string is reversed"
      }
    ],
    testCases: [
      { input: "hello\n", expectedOutput: "olleh" },
      { input: "Hannah\n", expectedOutput: "hannaH" },
      { input: "world\n", expectedOutput: "dlrow" }
    ],
    difficulty: "easy",
    codeSnippet: `def reverseString(s):
    # Your code here
    pass`
  }
]

// Helper function to get questions by section
export function getQuestionsBySection(section: string) {
  switch (section) {
    case "mcq1":
      return MOCK_MCQ1_QUESTIONS
    case "mcq2":
      return MOCK_MCQ2_QUESTIONS
    case "mcq3":
      return MOCK_MCQ3_QUESTIONS
    case "coding":
      return MOCK_CODING_QUESTIONS
    default:
      return MOCK_MCQ1_QUESTIONS
  }
}

// For backward compatibility
export const MOCK_QUESTIONS = MOCK_CODING_QUESTIONS
