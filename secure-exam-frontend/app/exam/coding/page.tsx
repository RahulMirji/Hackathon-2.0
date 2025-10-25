"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ViolationTrackerCompact } from "@/components/exam/violation-tracker-compact"
import { ExamTimer } from "@/components/exam/exam-timer"
import { CodeEditor } from "@/components/exam/code-editor"
import { Play, Send, ChevronLeft, ChevronRight, HelpCircle, Save, Code2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function CodingExamPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("python")

  const languages = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
  ]

  const codingQuestions = [
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
      ]
    },
    {
      id: 2,
      title: "Reverse String",
      description: "Write a function that reverses a string. The input string is given as an array of characters s.",
      constraints: [
        "1 <= s.length <= 10^5",
        "s[i] is a printable ascii character"
      ],
      examples: [
        {
          input: 's = ["h","e","l","l","o"]',
          output: '["o","l","l","e","h"]',
          explanation: "The string is reversed in-place"
        },
        {
          input: 's = ["H","a","n","n","a","h"]',
          output: '["h","a","n","n","a","H"]',
          explanation: "The string is reversed in-place"
        }
      ]
    }
  ]

  const codingQuestion = codingQuestions[currentQuestion]

  const handleRun = () => {
    setOutput("Running code...\n\nTest Case 1: Passed ✓\nTest Case 2: Passed ✓")
  }

  const handleSave = () => {
    // Save code logic here
    alert("Code saved successfully!")
  }

  const handleNext = () => {
    if (currentQuestion < codingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCode("")
      setOutput("")
    }
  }

  const handleSubmit = () => {
    router.push("/exam/submission")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1400px] mx-auto px-16 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">HP</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Coding Section</h1>
              <p className="text-xs text-muted-foreground">Programming Tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Instructions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Coding Instructions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Write your code in the editor provided</li>
                    <li>Click "Run Code" to test your solution</li>
                    <li>Click "Submit" when you're ready to submit your answer</li>
                    <li>Your camera and screen will be monitored throughout</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>

            <ExamTimer totalMinutes={30} onTimeUp={() => {}} />

            <Button onClick={handleSubmit} className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg">
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-16 py-4 h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Side - Question */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            <Card className="exam-card">
              <div className="space-y-6">
                {/* Question Title */}
                <div className="pb-4 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                      Question {currentQuestion + 1}
                    </Badge>
                    <Badge variant="outline">Coding Challenge</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {codingQuestion.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {codingQuestion.description}
                  </p>
                </div>

                {/* Constraints */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-blue-600">⚡</span> Constraints:
                  </h3>
                  <ul className="space-y-2">
                    {codingQuestion.constraints.map((constraint, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-blue-500 font-mono">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                {codingQuestion.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary">Example {idx + 1}</Badge>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-sm text-green-600 dark:text-green-400">Input:</span>
                        <pre className="text-sm mt-1 text-muted-foreground bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 font-mono">{example.input}</pre>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">Output:</span>
                        <pre className="text-sm mt-1 text-muted-foreground bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 font-mono">{example.output}</pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold text-sm text-purple-600 dark:text-purple-400">Explanation:</span>
                          <p className="text-sm mt-1 text-muted-foreground italic">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => router.push("/exam/sections")}
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Sections
                </Button>
                {currentQuestion === codingQuestions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
            <div className="mb-4"></div>
          </div>

          {/* Right Side - Monitoring & Code Editor */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            <div className="space-y-4">
              {/* Top Section - Monitoring */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48">
                  <ViolationTrackerCompact />
                </div>
                <Card className="p-0 overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 h-48">
                  <MonitoringOverlay />
                </Card>
              </div>

              {/* Code Editor */}
              <Card className="exam-card overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">Code Editor</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Question {currentQuestion + 1} of {codingQuestions.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '12px 12px'
                      }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Code Editor with Line Numbers */}
                <div className="mb-4">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage}
                    placeholder="// Write your code here..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-1"
                  >
                    <Save className="h-4 w-4" />
                    Save Code
                  </Button>
                  <Button
                    onClick={handleRun}
                    size="sm"
                    className="gap-2 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Play className="h-4 w-4" />
                    Run Code
                  </Button>
                </div>

                {/* Output Section */}
                {output && (
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">Output:</h4>
                      <Badge variant="secondary" className="text-xs">Console</Badge>
                    </div>
                    <div className="bg-[#1e1e1e] rounded-lg p-4 border-2 border-[#3e3e3e] max-h-32 overflow-y-auto">
                      <pre className="text-sm text-[#d4d4d4] font-mono whitespace-pre-wrap">{output}</pre>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <div className="mb-4"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
