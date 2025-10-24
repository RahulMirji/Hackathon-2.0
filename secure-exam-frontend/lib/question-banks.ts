export interface Question {
  id: number
  text: string
  options: string[]
  type: "multiple-choice" | "short-answer"
  correctAnswer?: string
}

// MCQ 1: General & Technical Questions (25 questions)
export const MCQ1_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    type: "multiple-choice",
    correctAnswer: "Paris",
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    type: "multiple-choice",
    correctAnswer: "Mars",
  },
  {
    id: 3,
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    type: "multiple-choice",
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 4,
    text: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Nikola Tesla"],
    type: "multiple-choice",
    correctAnswer: "Albert Einstein",
  },
  {
    id: 5,
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    type: "multiple-choice",
    correctAnswer: "Au",
  },
  // Add 20 more questions...
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    text: `General/Technical Question ${i + 6}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    type: "multiple-choice" as const,
    correctAnswer: "Option A",
  })),
]

// MCQ 2: Coding Questions (25 questions)
export const MCQ2_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which of the following is a programming language?",
    options: ["Python", "HTML", "CSS", "All of the above"],
    type: "multiple-choice",
    correctAnswer: "Python",
  },
  {
    id: 2,
    text: "What does 'OOP' stand for in programming?",
    options: [
      "Object-Oriented Programming",
      "Open-Output Protocol",
      "Operational Optimization Process",
      "Organized Object Procedure",
    ],
    type: "multiple-choice",
    correctAnswer: "Object-Oriented Programming",
  },
  {
    id: 3,
    text: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    type: "multiple-choice",
    correctAnswer: "Stack",
  },
  {
    id: 4,
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    type: "multiple-choice",
    correctAnswer: "O(log n)",
  },
  {
    id: 5,
    text: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"],
    type: "multiple-choice",
    correctAnswer: "def",
  },
  // Add 20 more coding questions...
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    text: `Coding Question ${i + 6}: What is the output of the following code?`,
    options: ["Output A", "Output B", "Output C", "Output D"],
    type: "multiple-choice" as const,
    correctAnswer: "Output A",
  })),
]

// MCQ 3: English Questions (10 questions)
export const MCQ3_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Choose the correct synonym for 'Happy':",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    type: "multiple-choice",
    correctAnswer: "Joyful",
  },
  {
    id: 2,
    text: "Identify the noun in the sentence: 'The cat sat on the mat.'",
    options: ["sat", "cat", "on", "the"],
    type: "multiple-choice",
    correctAnswer: "cat",
  },
  {
    id: 3,
    text: "Which sentence is grammatically correct?",
    options: [
      "She don't like apples",
      "She doesn't likes apples",
      "She doesn't like apples",
      "She not like apples",
    ],
    type: "multiple-choice",
    correctAnswer: "She doesn't like apples",
  },
  {
    id: 4,
    text: "What is the past tense of 'run'?",
    options: ["runned", "ran", "running", "runs"],
    type: "multiple-choice",
    correctAnswer: "ran",
  },
  {
    id: 5,
    text: "Choose the correct article: '___ apple a day keeps the doctor away.'",
    options: ["A", "An", "The", "No article"],
    type: "multiple-choice",
    correctAnswer: "An",
  },
  {
    id: 6,
    text: "What is the antonym of 'difficult'?",
    options: ["Hard", "Easy", "Complex", "Tough"],
    type: "multiple-choice",
    correctAnswer: "Easy",
  },
  {
    id: 7,
    text: "Identify the verb in: 'The dog barks loudly.'",
    options: ["dog", "barks", "loudly", "the"],
    type: "multiple-choice",
    correctAnswer: "barks",
  },
  {
    id: 8,
    text: "Which word is spelled correctly?",
    options: ["Recieve", "Receive", "Recive", "Receeve"],
    type: "multiple-choice",
    correctAnswer: "Receive",
  },
  {
    id: 9,
    text: "What type of sentence is this: 'Please close the door.'",
    options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],
    type: "multiple-choice",
    correctAnswer: "Imperative",
  },
  {
    id: 10,
    text: "Choose the correct preposition: 'She is good ___ mathematics.'",
    options: ["in", "at", "on", "with"],
    type: "multiple-choice",
    correctAnswer: "at",
  },
]

// Coding Section: Programming Tasks (2 questions)
export const CODING_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Write a function that reverses a string. Your function should take a string as input and return the reversed string.",
    options: [],
    type: "short-answer",
  },
  {
    id: 2,
    text: "Write a function that checks if a number is prime. Your function should return true if the number is prime, false otherwise.",
    options: [],
    type: "short-answer",
  },
]

export function getQuestionsBySection(section: string): Question[] {
  switch (section) {
    case "mcq1":
      return MCQ1_QUESTIONS
    case "mcq2":
      return MCQ2_QUESTIONS
    case "mcq3":
      return MCQ3_QUESTIONS
    case "coding":
      return CODING_QUESTIONS
    default:
      return MCQ1_QUESTIONS
  }
}

export function getSectionInfo(section: string) {
  const info = {
    mcq1: {
      title: "MCQ 1 - General & Technical",
      duration: 40,
      totalQuestions: 25,
    },
    mcq2: {
      title: "MCQ 2 - Coding Questions",
      duration: 45,
      totalQuestions: 25,
    },
    mcq3: {
      title: "MCQ 3 - English Language",
      duration: 15,
      totalQuestions: 10,
    },
    coding: {
      title: "Coding - Programming Tasks",
      duration: 30,
      totalQuestions: 2,
    },
  }
  return info[section as keyof typeof info] || info.mcq1
}
