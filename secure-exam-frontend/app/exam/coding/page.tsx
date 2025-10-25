"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ViolationTrackerCompact } from "@/components/exam/violation-tracker-compact"
import { ExamTimer } from "@/components/exam/exam-timer"
import { CodeEditor } from "@/components/exam/code-editor"
import { Play, Send, ChevronLeft, ChevronRight, HelpCircle, Save, Code2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CodingQuestion, MOCK_QUESTIONS } from "@/lib/mock-questions"
import { getSectionQuestions } from "@/lib/exam-session"

// Normalize and trim output for comparison
function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/gm, '')
}

// Sanitize test case input
function sanitizeTestInput(input: string): string {
  return input.endsWith('\n') ? input : input + '\n'
}

export default function CodingExamPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [isRunning, setIsRunning] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string }>>([])
  const [showTestResults, setShowTestResults] = useState(false)
  const [codingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [isPyodideLoading, setIsPyodideLoading] = useState(false)

  const languages = [
    { value: "python", label: "Python (Browser)" },
    { value: "javascript", label: "JavaScript (Browser)" },
  ]

  // Preload Pyodide when Python is selected
  useEffect(() => {
    if (selectedLanguage === 'python' && !isPyodideLoading) {
      setIsPyodideLoading(true)
      import('@/lib/browser-code-executor').then(({ loadPyodide }) => {
        loadPyodide().then(() => {
          setIsPyodideLoading(false)
          console.log('✅ Python runtime ready')
        }).catch((error) => {
          console.error('❌ Failed to load Python runtime:', error)
          setIsPyodideLoading(false)
        })
      })
    }
  }, [selectedLanguage])

  // Load questions on mount
  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      // Check cache first
      const cached = getSectionQuestions("coding")
      if (cached && cached.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.log("✅ [CODING] Using cached questions:", cached.length)
        }
        setCodingQuestions(cached)
        setIsLoadingQuestions(false)
        return
      }
      
      // Load from API
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "coding", count: 2 }),
      })

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No reader available")
      }

      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === "partial" && data.questions && data.count >= 1) {
                setCodingQuestions(data.questions)
                setIsLoadingQuestions(false)
              }
              
              if (data.type === "complete" && data.questions) {
                setCodingQuestions(data.questions)
                setIsLoadingQuestions(false)
                
                // Save to cache
                const { saveSectionQuestions } = await import("@/lib/exam-session")
                saveSectionQuestions("coding", data.questions)
                return
              }
              
              if (data.type === "error") {
                throw new Error(data.message)
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      
      throw new Error("No questions received")
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("❌ [CODING] Failed to load questions:", error)
      }
      setCodingQuestions(MOCK_QUESTIONS)
      setIsLoadingQuestions(false)
    }
  }

  // Get current question safely
  const codingQuestion = codingQuestions[currentQuestion]

  // Generic starter template (no problem-specific logic)
  const getGenericTemplate = (lang: string) => {
    const templates: Record<string, string> = {
      python: `# Read input and solve the problem
# Use input() to read from stdin
# Use print() to write to stdout

# Your code here

`,
      javascript: `// Read input and solve the problem
// Use input() to read from stdin
// Use console.log() to write to stdout

// Your code here

`
    }
    return templates[lang] || ""
  }

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Error: Please write some code before running.")
      return
    }

    setIsRunning(true)
    setOutput("Running test cases...")
    setExecutionTime(null)
    setTestResults([])
    setShowTestResults(false)

    const question = codingQuestions[currentQuestion]
    const results: Array<{ passed: boolean; input: string; expected: string; actual: string }> = []
    let totalTime = 0

    try {
      // Use browser-based execution
      const { executeCode } = await import("@/lib/browser-code-executor")
      
      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i]
        
        // Sanitize input
        const sanitizedInput = sanitizeTestInput(testCase.input)
        
        const result = await executeCode(code, selectedLanguage, sanitizedInput)
        totalTime += result.executionTime || 0

        if (result.success) {
          const actualOutput = normalizeOutput(result.output)
          const expectedOutput = normalizeOutput(testCase.expectedOutput)
          const passed = actualOutput === expectedOutput

          if (!passed && process.env.NODE_ENV !== 'production') {
            console.log(`Test ${i + 1} failed`)
            console.log(`Expected: "${expectedOutput}"`)
            console.log(`Actual: "${actualOutput}"`)
          }

          results.push({
            passed,
            input: testCase.input,
            expected: expectedOutput,
            actual: actualOutput,
          })
        } else {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: result.error || "No output",
          })
        }
      }

      setTestResults(results)
      setShowTestResults(true)
      setExecutionTime(totalTime)

      const passedCount = results.filter(r => r.passed).length
      const totalCount = results.length
      
      if (passedCount === totalCount) {
        setOutput(`✓ All test cases passed! (${passedCount}/${totalCount})`)
      } else {
        setOutput(`✗ ${passedCount}/${totalCount} test cases passed`)
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Execution failed:", error)
      }
      setOutput(`Error: Failed to execute code.\n${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang)
    setOutput("")
    setExecutionTime(null)
    setTestResults([])
    setShowTestResults(false)
    setCode(getGenericTemplate(newLang))
  }

  const handleSave = () => {
    alert("Code saved successfully!")
  }

  const handleNext = () => {
    if (currentQuestion < codingQuestions.length - 1) {
      const nextQuestion = currentQuestion + 1
      setCurrentQuestion(nextQuestion)
      setOutput("")
      setExecutionTime(null)
      setTestResults([])
      setShowTestResults(false)
      setCode(getGenericTemplate(selectedLanguage))
    }
  }

  // Initialize with template when questions are loaded or question changes
  useEffect(() => {
    if (codingQuestions && codingQuestions.length > 0) {
      setCode(getGenericTemplate(selectedLanguage))
    }
  }, [currentQuestion, codingQuestions, selectedLanguage])

  const handleSubmit = () => {
    router.push("/exam/submission")
  }

  // Show loading state while questions are being fetched
  if (isLoadingQuestions || codingQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold">Loading Questions...</h2>
            <p className="text-sm text-muted-foreground text-center">
              Generating coding challenges with AI. This may take a few seconds.
            </p>
          </div>
        </Card>
      </main>
    )
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
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
                      disabled={isRunning}
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
                    className="gap-2"
                    disabled={isRunning}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleRun}
                    size="sm"
                    className="gap-2 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
                    disabled={isRunning || isPyodideLoading}
                  >
                    {isRunning || isPyodideLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isPyodideLoading ? "Loading Python..." : "Running..."}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Test Cases
                      </>
                    )}
                  </Button>
                </div>

                {/* Output Section */}
                {output && (
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Test Results:</h4>
                        <Badge variant="secondary" className="text-xs">
                          {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                        </Badge>
                      </div>
                      {executionTime !== null && (
                        <Badge variant="outline" className="text-xs">
                          {executionTime}ms
                        </Badge>
                      )}
                    </div>
                    <div className="bg-[#1e1e1e] rounded-lg p-4 border-2 border-[#3e3e3e] max-h-48 overflow-y-auto">
                      <pre className="text-sm text-[#d4d4d4] font-mono whitespace-pre-wrap mb-3">{output}</pre>
                      
                      {showTestResults && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-[#3e3e3e]">
                          {testResults.map((result, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded border ${
                                result.passed 
                                  ? 'bg-green-900/20 border-green-700' 
                                  : 'bg-red-900/20 border-red-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold ${
                                  result.passed ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {result.passed ? '✓' : '✗'} Test Case {idx + 1}
                                </span>
                              </div>
                              {!result.passed && (
                                <div className="text-xs space-y-1 mt-2">
                                  <div>
                                    <span className="text-gray-400">Input: </span>
                                    <span className="text-[#d4d4d4]">{result.input.replace(/\n/g, ' → ')}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected: </span>
                                    <span className="text-green-400">"{result.expected}"</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Got: </span>
                                    <span className="text-red-400">"{result.actual || '(empty)'}"</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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
